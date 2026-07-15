import React, { useState, useEffect } from "react";
import { getAdminStoriesAPI, createAdminStoryAPI, deleteAdminStoryAPI, updateSuccessStoryAPI } from "../apis/Api";
import { toast } from "react-toastify";
import { FaDownload, FaTimes } from "react-icons/fa";
import "../styles/AdminStories.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MAX_FILE_SIZE_MB = 10; // ✅ 10MB limit

export default function AdminStories() {
  const [showForm, setShowForm] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    partner_one_name: "", partner_two_name: "",
    marriage_date: "", location: "", story_text: "",
    image_one: null, image_two: null
  });

  const [previewOne, setPreviewOne] = useState(null);
  const [previewTwo, setPreviewTwo] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getAdminStoriesAPI();
      setStories(res.data || []);
    } catch (err) {
      console.error("Failed to load stories", err);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const validateFileSize = (file) => {
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`Image size ${MAX_FILE_SIZE_MB}MB ൽ കൂടാൻ പാടില്ല. Current: ${fileSizeMB.toFixed(2)}MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (!validateFileSize(file)) {
      e.target.value = ""; // reset input
      return;
    }

    setFormData({...formData, [name]: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      if (name === "image_one") setPreviewOne(reader.result);
      if (name === "image_two") setPreviewTwo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (imageType) => {
    if (imageType === "image_one") {
      setPreviewOne(null);
      setFormData({...formData, image_one: null });
    } else {
      setPreviewTwo(null);
      setFormData({...formData, image_two: null });
    }
  };

  const handleEditClick = (story) => {
    setIsEditing(true);
    setEditingId(story.id);
    setFormData({
      partner_one_name: story.partner_one_name,
      partner_two_name: story.partner_two_name,
      marriage_date: story.marriage_date || "",
      location: story.location || "",
      story_text: story.story_text,
      image_one: null, // ✅ puthiya file select cheyyan vendi null
      image_two: null
    });
    setPreviewOne(getImageUrl(story.image_one));
    setPreviewTwo(getImageUrl(story.image_two));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("partner_one_name", formData.partner_one_name);
      data.append("partner_two_name", formData.partner_two_name);
      data.append("marriage_date", formData.marriage_date);
      data.append("location", formData.location);
      data.append("story_text", formData.story_text);

      // ✅ File select cheyyitundel mathrame append cheyyu
      if (formData.image_one instanceof File) data.append("image_one", formData.image_one);
      if (formData.image_two instanceof File) data.append("image_two", formData.image_two);

      if (isEditing) {
        await updateSuccessStoryAPI(editingId, data);
        toast.success("Success story updated successfully!");
      } else {
        await createAdminStoryAPI(data);
        toast.success("Success story created successfully!");
      }

      resetForm();
      fetchStories();
    } catch (err) {
      console.error("Submit error:", err);
      if(err.response?.status === 413) {
        toast.error("File size too large. Max 10MB per image")
      } else {
        toast.error(isEditing? "Failed to update story." : "Failed to add success story.");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ partner_one_name: "", partner_two_name: "", marriage_date: "", location: "", story_text: "", image_one: null, image_two: null });
    setPreviewOne(null);
    setPreviewTwo(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteAdminStoryAPI(id);
      toast.success("Story deleted successfully!");
      fetchStories();
    } catch (err) {
      toast.error("Failed to delete story.");
    }
  };

  const downloadImage = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.jpg`;
    link.click();
  };

  return (
    <div className="admin-manage-content">
      <div className="page-header">
        <h2>Success Stories Management</h2>
        <button className="add-btn" onClick={() => { if(showForm) { resetForm(); } else { setShowForm(true); } }}>
          {showForm? "View Stories" : "+ Add New Story"}
        </button>
      </div>

      {showForm? (
        <div className="form-card">
          <h3 className="form-header">
            {isEditing? "Edit Success Story" : "Create Success Story"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-control">
                <label>Partner One Name *</label>
                <input type="text" name="partner_one_name" value={formData.partner_one_name} required onChange={handleChange} placeholder="Enter name" className="form-input" />
              </div>

              <div className="form-control">
                <label>Partner Two Name *</label>
                <input type="text" name="partner_two_name" value={formData.partner_two_name} required onChange={handleChange} placeholder="Enter name" className="form-input" />
              </div>

              <div className="form-control">
                <label>Marriage Date</label>
                <input type="date" name="marriage_date" value={formData.marriage_date} onChange={handleChange} className="form-input" />
              </div>

              <div className="form-control">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" className="form-input" />
              </div>

              <div className="form-control">
                <label>Image One - Max {MAX_FILE_SIZE_MB}MB</label>
                <div className="file-input-wrapper">
                  <input type="file" name="image_one" accept="image/*" onChange={handleFileChange} id="image_one" style={{ display: 'none' }} />
                  <label htmlFor="image_one" className="file-input-btn">
                    {previewOne? 'Change Image' : 'Choose File'}
                  </label>
                  {previewOne && (
                    <div className="image-preview-box">
                      <img src={previewOne} alt="Preview One" />
                      <div className="image-preview-actions">
                        <button type="button" className="action-btn view" onClick={() => downloadImage(previewOne, formData.partner_one_name || 'image_one')} title="Download">
                          <FaDownload />
                        </button>
                        <button type="button" className="action-btn times" onClick={() => clearImage('image_one')} title="Remove">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label>Image Two - Max {MAX_FILE_SIZE_MB}MB</label>
                <div className="file-input-wrapper">
                  <input type="file" name="image_two" accept="image/*" onChange={handleFileChange} id="image_two" style={{ display: 'none' }} />
                  <label htmlFor="image_two" className="file-input-btn">
                    {previewTwo? 'Change Image' : 'Choose File'}
                  </label>
                  {previewTwo && (
                    <div className="image-preview-box">
                      <img src={previewTwo} alt="Preview Two" />
                      <div className="image-preview-actions">
                        <button type="button" className="action-btn view" onClick={() => downloadImage(previewTwo, formData.partner_two_name || 'image_two')} title="Download">
                          <FaDownload />
                        </button>
                        <button type="button" className="action-btn times" onClick={() => clearImage('image_two')} title="Remove">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control form-textarea-control">
                <label>Story Text *</label>
                <textarea name="story_text" rows="4" value={formData.story_text} required onChange={handleChange} placeholder="Write their success story..." className="form-textarea"></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="action-btn-primary">
                {isEditing? "Update Story" : "Submit Story"}
              </button>
              <button type="button" className="action-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="table-container">
          {loading? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading stories...</div>
          ) : stories.length === 0? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No success stories available. Click "+ Add New Story" to create one.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Partners</th>
                  <th>Marriage Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id}>
                    <td data-label="Partners">{story.partner_one_name} & {story.partner_two_name}</td>
                    <td data-label="Marriage Date">{story.marriage_date || "N/A"}</td>
                    <td data-label="Location">{story.location || "N/A"}</td>
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" className="action-btn edit" onClick={() => handleEditClick(story)}>Edit</button>
                        <button type="button" className="action-btn delete" onClick={() => handleDelete(story.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}