import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaUpload } from "react-icons/fa";
import { getAllAdsAPI, createAdAPI, deleteAdAPI, updateAdAPI } from "../apis/Api";
import "../styles/adminBanners.css";

export default function AdminBanners() {
  const [adTitle, setAdTitle] = useState("");
  const [adLink, setAdLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getAllAdsAPI();
      setBanners(res.data || []);
    } catch (err) { console.error("Failed to fetch banners", err); }
    finally { setLoading(false); }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile &&!editId) { alert("ദയവായി ഒരു ഫയൽ തിരഞ്ഞെടുക്കുക"); return; }

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
        await createAdAPI(formData); 
        alert("പരസ്യം വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!");
      }
      resetForm(); fetchBanners();
    } catch (err) { console.error(err); alert("പ്രവർത്തനം പരാജയപ്പെട്ടു"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ഈ പരസ്യം ഡിലീറ്റ് ചെയ്യണോ?")) {
      try { await deleteAdAPI(id); setBanners(banners.filter((b) => b.id!== id)); alert("പരസ്യം ഡിലീറ്റ് ചെയ്തു"); }
      catch (err) { alert("ഡിലീറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല"); }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateAdAPI(banner.id, { is_active:!banner.is_active }); 
      fetchBanners();
    } catch (err) { console.error(err); alert("സ്റ്റാറ്റസ് മാറ്റാൻ കഴിഞ്ഞില്ല"); }
  };

  const handleEdit = (banner) => {
    setEditId(banner.id); setAdTitle(banner.title); setAdLink(banner.link_url || "");
    setSelectedFile(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setAdTitle(""); setAdLink(""); setSelectedFile(null); setEditId(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleFileClick = () => { fileInputRef.current.click(); };

  return (
    <div className="admin-content">
      <header className="admin-header">
        <h1 style={{color: '#ffff'}}>Manage Banner Ads</h1>
      </header>

      <div className="panel" style={{ padding: "20px", marginTop: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
        <h3>{editId ? "Edit Ad Banner" : "Upload Home Page Ad Banner (Image / Video)"}</h3>
        <form onSubmit={handleAdSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", marginTop: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Ad Title / Name:</label>
            <input
              type="text"
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="Enter ad title"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Target Link URL (Optional):</label>
            <input
              type="url"
              value={adLink}
              onChange={(e) => setAdLink(e.target.value)}
              placeholder="https://example.com"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          {/* ✅ FIXED FILE INPUT SECTION */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Select File (Image or Video) {editId && "- Optional for edit"}:
            </label>
            
            {/* Hidden actual input */}
            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={(e) => setSelectedFile(e.target.files[0])}
              required={!editId}
              style={{ display: "none" }}
            />

            {/* Custom Button */}
            <button
              type="button"
              onClick={handleFileClick}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px dashed #e91662",
                borderRadius: "8px",
                background: "#fff5f8",
                color: "#e91662",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <FaUpload /> 
              {selectedFile ? selectedFile.name : "Click to Choose Image / Video"}
            </button>

            {selectedFile && (
              <p style={{fontSize: "12px", color: "#16a34a", marginTop: "5px"}}>
                Selected: {selectedFile.name} - {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={uploading}
              style={{ flex: 1, padding: "10px", background: "#d23753", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              {uploading ? "Processing..." : editId ? "Update Ad" : "Publish Ad to Home Page"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "10px", background: "#757575", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

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
                          controls
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