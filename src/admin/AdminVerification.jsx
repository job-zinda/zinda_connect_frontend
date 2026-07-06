import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaFilter, FaCheck, FaTimes, FaIdCard } from "react-icons/fa";
import { getAllProfilesAdminAPI, approveProfileAPI, rejectProfileAPI } from "../apis/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/adminverification.css";

export default function AdminVerification() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [religion, setReligion] = useState("All Religion");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, [status, religion]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (status !== "All Status") params.status = status.toLowerCase();
      if (religion !== "All Religion") params.religion = religion;

      const res = await getAllProfilesAdminAPI(params);
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch profiles for verification", err);
      toast.error("Failed to load verification profiles");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderText = (gender) => {
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    return gender || 'N/A';
  };

  const handleVerify = async (id, hasAadhaar) => {
    if (!hasAadhaar) {
      toast.warning("Aadhaar upload cheytha profiles mathrame verify cheyyan pattu");
      return;
    }

    setActionLoading(id);
    try {
      await approveProfileAPI(id);
      await fetchProfiles();
      toast.success("Profile verified successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Verification failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (!reason || reason.trim() === "") return;

    setActionLoading(id);
    try {
      await rejectProfileAPI(id, { rejection_reason: reason });
      await fetchProfiles();
      toast.success("Profile rejected");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (id) => {
    navigate(`/profile-details/${id}`);
  };

  const handleEditClick = (profile) => {
    setSelectedProfile(profile);
    setEditStatus(profile.verification_status);
    setRejectReason(profile.rejection_reason || "");
    setShowEditModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedProfile) return;

    if (editStatus === 'rejected' && !rejectReason.trim()) {
      toast.error("Rejection reason required");
      return;
    }

    setActionLoading(selectedProfile.id);
    try {
      if (editStatus === 'verified') {
        await approveProfileAPI(selectedProfile.id);
        toast.success("Profile verified successfully");
      } else if (editStatus === 'rejected') {
        await rejectProfileAPI(selectedProfile.id, { rejection_reason: rejectReason });
        toast.success("Profile rejected");
      } else if (editStatus === 'pending') {
        await rejectProfileAPI(selectedProfile.id, {
          status: 'pending',
          rejection_reason: ''
        });
        toast.success("Status changed to pending");
      }

      await fetchProfiles();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    return (
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <div className="loading-spinner">Loading verification profiles...</div>;

  return (
    <div className="admin-users-content">
      <div className="admin-profiles-top">
        <h1>Profile Verification</h1>
      </div>

      <section className="admin-profiles-content">
        <div className="profiles-toolbar">
          <div className="profiles-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>

          <select value={religion} onChange={(e) => setReligion(e.target.value)}>
            <option>All Religion</option>
            <option>Hindu</option>
            <option>Muslim</option>
            <option>Sikh</option>
            <option>Christian</option>
            <option>Jain</option>
            <option>Buddhist</option>
          </select>

          <button className="filter-btn" onClick={fetchProfiles}>
            <FaFilter /> Filter
          </button>
        </div>

        <div className="profiles-table-wrapper">
          <div className="profiles-table-card">
            <table>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Basic Info</th>
                  <th>Religion</th>
                  <th>Location</th>
                  <th>Aadhaar</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id}>
                    <td data-label="Profile">
                      <div className="profile-user-cell">
                        <img
                          src={profile.profile_picture || "https://via.placeholder.com/40"}
                          alt={profile.full_name}
                          onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                        />
                        <span className="profile-name-text">{profile.full_name}, {calculateAge(profile.date_of_birth)}</span>
                      </div>
                    </td>

                    <td data-label="Basic Info">
                      <span className="cell-value">{getGenderText(profile.gender)}, {profile.height || "N/A"}</span>
                    </td>

                    <td data-label="Religion">
                      <span className="cell-value">{profile.religion || "N/A"}</span>
                    </td>

                    <td data-label="Location">
                      <span className="cell-value">
                        {[profile.district || profile.city, profile.state || profile.country]
                         .filter(Boolean)
                         .join(", ") || "N/A"}
                      </span>
                    </td>

                    <td data-label="Aadhaar">
                      <div className="cell-value">
                        {profile.has_aadhaar ? (
                          <span className={`aadhaar-status-tag ${profile.aadhaar_status || 'pending'}`}>
                            <FaIdCard />
                            {profile.aadhaar_status || "pending"}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "13px" }}>Not uploaded</span>
                        )}
                      </div>
                    </td>

                    <td data-label="Status">
                      <div className="cell-value">
                        <span className={`profile-status ${profile.verification_status || 'pending'}`}>
                          {profile.verification_status || "pending"}
                        </span>
                        {profile.verification_status === 'rejected' && profile.rejection_reason && (
                          <div className="rejection-text-box">
                            {profile.rejection_reason}
                          </div>
                        )}
                      </div>
                    </td>

                    <td data-label="Actions">
                      <div className="profile-actions">
                        <button className="action-btn view" title="View" onClick={() => handleView(profile.id)}>
                          <FaEye />
                        </button>

                        {profile.verification_status === 'pending' && (
                          <button
                            className="action-btn check"
                            title={profile.has_aadhaar ? "Verify" : "Aadhaar not uploaded"}
                            onClick={() => handleVerify(profile.id, profile.has_aadhaar)}
                            disabled={!profile.has_aadhaar || actionLoading === profile.id}
                            style={{ opacity: profile.has_aadhaar ? 1 : 0.3 }}
                          >
                            <FaCheck />
                          </button>
                        )}

                        {profile.verification_status === 'pending' && (
                          <button
                            className="action-btn times"
                            title="Reject"
                            onClick={() => handleReject(profile.id)}
                            disabled={actionLoading === profile.id}
                          >
                            <FaTimes />
                          </button>
                        )}

                        <button className="action-btn edit" title="Edit Status" onClick={() => handleEditClick(profile)}>
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProfiles.length === 0 && (
              <div className="no-records-found">
                No profiles found
              </div>
            )}
          </div>
        </div>
      </section>

      {showEditModal && selectedProfile && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile Status</h2>
            <p style={{ color: '#64748b', marginBottom: '20px', fontWeight: '600' }}>
              {selectedProfile.full_name}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b' }}>
                Verification Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontWeight: '600'
                }}
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {editStatus === 'rejected' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b' }}>
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button
                className="modal-submit-btn"
                onClick={handleStatusUpdate}
                disabled={actionLoading === selectedProfile.id}
              >
                {actionLoading === selectedProfile.id ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}