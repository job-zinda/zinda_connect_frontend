import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaCloudUploadAlt } from "react-icons/fa";
import { getAllAdsAPI, deleteAdAPI, updateAdAPI, API_BASE_URL } from "../apis/Api";
import "../styles/adminBanners.css";

export default function AdminBanners() {
  const [adTitle, setAdTitle] = useState("");
  const [adLink, setAdLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getAllAdsAPI();
      console.log("Banners:", res.data);
      setBanners(res.data || []);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !editId) {
      alert("ദയവായി ഒരു ഫയൽ തിരഞ്ഞെടുക്കുക");
      return;
    }

    const formData = new FormData();
    formData.append("title", adTitle);
    if (selectedFile) formData.append("file", selectedFile);
    if (adLink) formData.append("link_url", adLink);
    formData.append("is_active", "true");

    try {
      setUploading(true);
      if (editId) {
        await updateAdAPI(editId, formData);
        alert("പരസ്യം അപ്ഡേറ്റ് ചെയ്തു!");
      } else {
        const token = localStorage.getItem("access");
        const response = await fetch(`${API_BASE_URL}/api/auth/admin/ads/`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        alert("പരസ്യം വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!");
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("പ്രവർത്തനം പരാജയപ്പെട്ടു");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ഈ പരസ്യം ഡിലീറ്റ് ചെയ്യണോ?")) {
      try {
        await deleteAdAPI(id);
        setBanners(banners.filter((b) => b.id !== id));
        alert("പരസ്യം ഡിലീറ്റ് ചെയ്തു");
      } catch (err) {
        alert("ഡിലീറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല");
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/ads/${banner.id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !banner.is_active }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Toggle error:", errorData);
        throw new Error("Toggle failed");
      }

      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("സ്റ്റാറ്റസ് മാറ്റാൻ കഴിഞ്ഞില്ല");
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);
    setAdTitle(banner.title);
    setAdLink(banner.link_url || "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setAdTitle("");
    setAdLink("");
    setSelectedFile(null);
    setEditId(null);
  };

  return (
    <div className="admin-content">
      <header className="admin-header">
        <h1 style={{color: '#ffff'}}>Manage Banner Ads</h1>
      </header>

      <div className="panel" style={{ padding: "30px", marginTop: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "950", marginBottom: "5px", color: "#10182f" }}>
          {editId ? "Edit Ad Banner" : "Upload New Banner"}
        </h2>
        <p style={{ margin: "0 0 25px 0", color: "#667085", fontSize: "14px", fontWeight: "650" }}>
          Home page il varunna image/video ads manage cheyyu
        </p>

        <form onSubmit={handleAdSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px" }}>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "950", fontSize: "14px", color: "#10182f" }}>Ad Title / Name</label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="Enter ad title"
                style={{ width: "100%", height: "48px", padding: "0 16px", borderRadius: "8px", border: "1.5px solid #dfe4ec", outline: "none", fontSize: "14px", fontWeight: "700" }}
                required
              />
            </div>

            <div style={{ flex: "1", minWidth: "250px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "950", fontSize: "14px", color: "#10182f" }}>Target Link URL</label>
              <input
                type="url"
                value={adLink}
                onChange={(e) => setAdLink(e.target.value)}
                placeholder="https://example.com"
                style={{ width: "100%", height: "48px", padding: "0 16px", borderRadius: "8px", border: "1.5px solid #dfe4ec", outline: "none", fontSize: "14px", fontWeight: "700" }}
              />
            </div>
          </div>

          {/* 📂 സുന്ദരമായ പുതിയ ഫയൽ സെലക്ഷൻ ബോക്സ് */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "950", fontSize: "14px", color: "#10182f" }}>
              Select File (Image or Video) {editId && "- Optional for edit"}
            </label>

            <label style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              border: "2px dashed #ff9fbd",
              borderRadius: "12px",
              backgroundColor: "#fff5f8",
              cursor: "pointer",
              transition: "0.2s ease",
              textAlign: "center"
            }}>
              <FaCloudUploadAlt style={{ fontSize: "32px", color: "#e91662", marginBottom: "8px" }} />
              <span style={{ fontSize: "14px", fontWeight: "750", color: "#10182f" }}>
                {selectedFile ? selectedFile.name : "Click to upload Image or Video"}
              </span>
              <span style={{ fontSize: "12px", color: "#667085", marginTop: "4px" }}>
                Supports JPG, PNG, MP4 etc.
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required={!editId}
                style={{ display: "none" }} // ഒറിജിനൽ ഇൻപുട്ട് ഹൈഡ് ചെയ്തു
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={uploading}
              style={{
                height: "48px",
                padding: "0 24px",
                background: "linear-gradient(135deg, #e91662, #ff4b91)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(233, 22, 98, 0.2)"
              }}
            >
              {uploading ? "Processing..." : editId ? "Update Ad" : "+ Publish Banner"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ height: "48px", padding: "0 24px", background: "#64748b", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "900", fontSize: "14px" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tables Row */}
      <div className="panel" style={{ padding: "20px", marginTop: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
        <h3>All Banners ({banners.length})</h3>
        {loading ? (
          <p>Loading banners...</p>
        ) : banners.length === 0 ? (
          <p>No banners uploaded yet</p>
        ) : (
          <div className="users-table-card">
            <table>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td>
                      {banner.file_type === 'image' ? (
                        <img
                          src={banner.file_url}
                          alt={banner.title}
                          style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => {e.target.src = '/placeholder.png'}}
                        />
                      ) : (
                        <video
                          src={banner.file_url}
                          style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      )}
                    </td>
                    <td>{banner.title}</td>
                    <td>
                      <span className={`status ${banner.file_type}`}>
                        {banner.file_type}
                      </span>
                    </td>
                    <td>
                      {banner.link_url ? (
                        <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                          <FaEye /> View
                        </a>
                      ) : "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(banner)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}
                        title={banner.is_active ? "Active - Click to deactivate" : "Inactive - Click to activate"}
                      >
                        {banner.is_active ? (
                          <FaToggleOn style={{ color: "#4CAF50" }} />
                        ) : (
                          <FaToggleOff style={{ color: "#ccc" }} />
                        )}
                      </button>
                    </td>
                    <td>{new Date(banner.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="user-action-icons">
                        <button title="Edit" onClick={() => handleEdit(banner)}>
                          <FaEdit />
                        </button>
                        <button
                          title="Delete"
                          className="delete"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
