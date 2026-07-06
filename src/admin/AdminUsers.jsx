import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { getAllUsersAPI, deleteUserAPI, createUserByAdminAPI, getUserDetailsAPI } from "../apis/Api";
import "../styles/adminUsers.css";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // View Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersAPI();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Users fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.full_name ||!newUser.email ||!newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setCreating(true);
      await createUserByAdminAPI(newUser);
      alert("User created successfully!");
      setShowModal(false);
      setNewUser({ full_name: "", email: "", password: "", phone_number: "" });
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.email?.[0] ||
                      err.response?.data?.error ||
                      "Failed to create user";
      alert(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      const res = await getUserDetailsAPI(userId);
      setSelectedUser(res.data);
    } catch (err) {
      alert("Failed to fetch user details");
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await deleteUserAPI(id);
        setUsers(users.filter((user) => user.id!== id));
        alert("User deleted successfully");
      } catch (err) {
        alert(err.response?.data?.error || "Delete failed");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const roleMatch = role === "All Roles" || user.role === role;
    const statusMatch = status === "All Status" || (status === "Active"? user.is_active :!user.is_active);
    return searchMatch && roleMatch && statusMatch;
  });

  if (loading) return <div style={{ padding: "20px" }}>Loading users...</div>;

  return (
    <div className="admin-users-content">
      <div className="admin-users-top">
        <h1>Users</h1>
      </div>

      <div className="admin-users-toolbar">
        <div className="admin-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>All Roles</option>
          <option>User</option>
          <option>Admin</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add User
        </button>
      </div>

      <div className="users-table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info-cell">
                    <img
                      src={user.profile_picture || "https://via.placeholder.com/40"}
                      alt={user.full_name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span>{user.full_name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.role || "User"}</td>
                <td>
                  <span className={user.is_active? "status active" : "status inactive"}>
                    {user.is_active? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {user.is_created_by_admin? (
                    <span style={{ color: "#ff6b6b", fontWeight: "600" }}>
                      Admin: {user.created_by_admin || "Admin"}
                    </span>
                  ) : (
                    <span style={{ color: "#666" }}>Self</span>
                  )}
                </td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td>
                  <div className="user-action-icons">
                    <button title="View" onClick={() => handleViewUser(user.id)}>
                      <FaEye />
                    </button>
                    <button title="Edit"><FaEdit /></button>
                    <button title="Delete" className="delete" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No users found
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  placeholder="Enter full name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={newUser.phone_number}
                  onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Min 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-submit">
                  {creating? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={() => setShowViewModal(false)} className="close-btn">
                <FaTimes />
              </button>
            </div>
            {viewLoading? (
              <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
            ) : selectedUser? (
              <div className="modal-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={selectedUser.user?.profile_picture || "https://via.placeholder.com/80"}
                    alt={selectedUser.user?.full_name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedUser.user?.full_name}</h3>
                    <p style={{ margin: '4px 0', color: '#666' }}>{selectedUser.user?.email}</p>
                    <span className={selectedUser.user?.is_active? "status active" : "status inactive"}>
                      {selectedUser.user?.is_active? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="detail-grid">
                  <div><strong>Phone:</strong> {selectedUser.profile?.phone_number || 'N/A'}</div>
                  <div><strong>Gender:</strong> {selectedUser.profile?.gender || 'N/A'}</div>
                  <div><strong>Date of Birth:</strong> {selectedUser.profile?.date_of_birth || 'N/A'}</div>
                  <div><strong>Marital Status:</strong> {selectedUser.profile?.marital_status || 'N/A'}</div>
                  <div><strong>Religion:</strong> {selectedUser.profile?.religion || 'N/A'}</div>
                  <div><strong>Education:</strong> {selectedUser.profile?.education || 'N/A'}</div>
                  <div><strong>Occupation:</strong> {selectedUser.profile?.occupation || 'N/A'}</div>
                  <div><strong>City:</strong> {selectedUser.profile?.city || 'N/A'}</div>
                  <div><strong>State:</strong> {selectedUser.profile?.state || 'N/A'}</div>
                  <div><strong>Country:</strong> {selectedUser.profile?.country || 'N/A'}</div>
                  <div><strong>Created By:</strong> {selectedUser.user?.is_created_by_admin? `Admin: ${selectedUser.user?.created_by_admin}` : 'Self'}</div>
                  <div><strong>Joined:</strong> {new Date(selectedUser.user?.date_joined).toLocaleDateString()}</div>
                </div>

                {selectedUser.profile?.about_me && (
                  <div style={{ marginTop: '16px' }}>
                    <strong>About:</strong>
                    <p style={{ marginTop: '8px', color: '#666' }}>{selectedUser.profile.about_me}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
