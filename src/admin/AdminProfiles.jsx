import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaFilter } from "react-icons/fa";
import { getAllProfilesAdminAPI } from "../apis/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/adminProfiles.css";

export default function AdminProfiles() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [religion, setReligion] = useState("All Religion");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch profiles", err);
      toast.error("Failed to load profiles");
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

  const handleView = (id) => {
    navigate(`/profile-details/${id}`);
  };

  const filteredProfiles = profiles.filter((p) => {
    return (
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase()) 
    );
  });

  if (loading) return <div className="loading-spinner">Loading profiles...</div>;

  return (
    <div className="admin-users-content">
      <div className="admin-profiles-top">
        <h1>Profiles</h1>
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
                  <th>Phone</th> 
                  <th>Religion</th>
                  <th>Location</th>
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
                        <span className="profile-name-text">
                          {profile.full_name}, {calculateAge(profile.date_of_birth)}
                        </span>
                      </div>
                    </td>

                    <td data-label="Basic Info">
                      <span className="cell-value">{getGenderText(profile.gender)}, {profile.height || "N/A"}</span>
                    </td>

                    
                    <td data-label="Phone">
                      <span className="cell-value">{profile.phone || "N/A"}</span>
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

                    <td data-label="Actions">
                      <div className="profile-actions">
                        <button className="action-btn view" title="View" onClick={() => handleView(profile.id)}>
                          <FaEye />
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
    </div>
  );
}


