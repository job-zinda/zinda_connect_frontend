import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaUpload } from "react-icons/fa";
import { getAllAdsAPI, createAdAPI, deleteAdAPI, updateAdAPI } from "../apis/Api";
import "../styles/adminBanners.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MAX_VIDEO_SIZE_MB = 30;
const MAX_IMAGE_SIZE_MB = 10;

const getImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
};

const getFileType = (file, url = "") => {
  // 1. File object undenkil athu check cheyyu
  if (file?.type) {
    return file.type.startsWith('video/')? 'video' : 'image';
  }
  // 2. URL ninnu extension vechu check cheyyu
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0];
  if (videoExts.includes(ext)) return 'video';
  return 'image';
};

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

  const validateFileSize = (file) => {
    const fileSizeMB = file.size / 1024 / 1024;
    const isVideo = file.type.startsWith('video/');

    if (isVideo && fileSizeMB > MAX_VIDEO_SIZE_MB) {
      alert(`Video size ${MAX_VIDEO_SIZE_MB}MB ൽ കൂടാൻ പാടില്ല. Current: ${fileSizeMB.toFixed(2)}MB`);
      return false;
    }
    if (!isVideo && fileSizeMB > MAX_IMAGE_SIZE_MB) {
      alert(`Image size ${MAX_IMAGE_SIZE_MB}MB ൽ കൂടാൻ പാടില്ല. Current: ${fileSizeMB.toFixed(2)}MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateFileSize(file)) {
      setSelectedFile(file);
    } else {
      e.target.value = "";
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile &&!editId) { alert("ദയവായി ഒരു ഫയൽ തിരഞ്ഞെടുക്കുക"); return; }

    if (selectedFile &&!validateFileSize(selectedFile)) return;

    const formData = new FormData();
    formData.append("title", adTitle);
    if (selectedFile) {
      formData.append("file", selectedFile);
      // ✅ file_type backend il save cheyyan vendi
      formData.append("file_type", getFileType(selectedFile));
    }
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
    } catch (err) {
      console.error(err);
      if(err.response?.status === 413) {
        alert("File size too large. Video: Max 30MB, Image: Max 10MB")
      } else if(err.response?.data) {
        alert(Object.values(err.response.data).flat().join("\n"))
      } else {
        alert("പ്രവർത്തനം പരാജയപ്പെട്ടു");
      }
    }
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
    setEditId(banner.id);
    setAdTitle(banner.title);
    setAdLink(banner.link_url || "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setAdTitle(""); setAdLink(""); setSelectedFile(null); setEditId(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileClick = () => { fileInputRef.current.click(); };

  return (
    <div className="admin-main">
      <div className="admin-banners-top">
        <h1>Manage Banner Ads</h1>
      </div>

      <div className="admin-banners-content">
        <div className="banners-title-row">
          <div>
            <h2>{editId? "Edit Ad Banner" : "Upload Home Page Ad Banner"}</h2>
            <p>Image: Max {MAX_IMAGE_SIZE_MB}MB / Video: Max {MAX_VIDEO_SIZE_MB}MB</p>
          </div>
        </div>

        <div className="banners-table-card" style={{padding: "24px", marginBottom: "24px"}}>
          <form onSubmit={handleAdSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "600px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900" }}>Ad Title / Name:</label>
              <input type="text" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} placeholder="Enter ad title" required
                style={{width: "100%", height: "48px", border: "1.5px solid #dfe4ec", borderRadius: "12px", padding: "0 16px"}}/>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900" }}>Target Link URL (Optional):</label>
              <input type="url" value={adLink} onChange={(e) => setAdLink(e.target.value)} placeholder="https://example.com"
                style={{width: "100%", height: "48px", border: "1.5px solid #dfe4ec", borderRadius: "12px", padding: "0 16px"}} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900" }}>
                Select File {editId && "- Optional for edit"}:
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                required={!editId}
                style={{ display: "none" }}
              />
              <button type="button" onClick={handleFileClick} className="add-banner-btn" style={{width: "100%"}}>
                <FaUpload /> {selectedFile? selectedFile.name : "Click to Choose Image / Video"}
              </button>
              {selectedFile && <p style={{fontSize: "13px", color: "#667085", marginTop: "8px"}}>
                Selected: {selectedFile.name} - {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
              </p>}
            </div>

            <button type="submit" disabled={uploading} className="add-banner-btn">
              {uploading? "Processing..." : editId? "Update Ad" : "Publish Ad to Home Page"}
            </button>
          </form>
        </div>

        <div className="banners-table-card">
          <div className="banners-toolbar">
            <h3 style={{gridColumn: "1/-1", margin: 0}}>All Banners ({banners.length})</h3>
          </div>

          {loading? <p style={{padding: "20px"}}>Loading banners...</p> : banners.length === 0?
            <p style={{padding: "20px"}}>No banners uploaded yet</p> : (
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
                {banners.map((banner) => {
                  // ✅ file_type illenkil URL vechu kandupidikanam
                  const type = banner.file_type || getFileType(null, banner.file_url);
                  return (
                    <tr key={banner.id}>
                      <td data-label="Preview">
                        {type === 'image'? (
                          <img src={getImageUrl(banner.file_url)} alt={banner.title} className="banner-thumb" />
                        ) : (
                          <video src={getImageUrl(banner.file_url)} className="banner-thumb" muted playsInline />
                        )}
                      </td>
                      <td data-label="Title" className="banner-title-cell">
                        <h4>{banner.title}</h4>
                      </td>
                      <td data-label="Type">
                        <span style={{textTransform: 'capitalize', fontWeight: '900'}}>{type}</span>
                      </td>
                      <td data-label="Link">
                        {banner.link_url?
                          <a href={banner.link_url} target="_blank" rel="noreferrer" style={{color: "#e91662"}}>
                            <FaEye /> View
                          </a> : "—"}
                      </td>
                      <td data-label="Status">
                        <button onClick={() => handleToggleActive(banner)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px'}}>
                          {banner.is_active?
                            <span className="banner-status active"><FaToggleOn /></span> :
                            <span className="banner-status inactive"><FaToggleOff /></span>
                          }
                        </button>
                      </td>
                      <td data-label="Created">{new Date(banner.created_at).toLocaleDateString()}</td>
                      <td data-label="Actions">
                        <div className="banner-actions">
                          <button onClick={() => handleEdit(banner)} title="Edit"><FaEdit /></button>
                          <button onClick={() => handleDelete(banner.id)} className="delete" title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}