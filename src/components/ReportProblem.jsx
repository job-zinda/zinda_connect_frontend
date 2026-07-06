import React, { useState, useRef } from "react";
import { FaArrowLeft, FaPaperPlane, FaImage, FaTimes } from "react-icons/fa";
import { reportProblemAPI } from "../apis/Api";
import "../styles/helpSupport.css";

const ReportProblem = ({ onBack }) => {
  const [issueType, setIssueType] = useState("Bug");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!description) return alert("ദയവായി വിവരണം നൽകുക!");

    setLoading(true);
    const formData = new FormData();
    formData.append("issue_type", issueType);
    formData.append("description", description);
    if (file) formData.append("attachment", file);

    try {
      await reportProblemAPI(formData);
      alert("നിങ്ങളുടെ പരാതി വിജയകരമായി അഡ്മിന്റെ ചാറ്റിലേക്ക് അയച്ചിട്ടുണ്ട്. അഡ്മിൻ ഇത് പരിശോധിക്കുന്നതാണ്!");
      setDescription("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error(err);
      alert("സബ്മിറ്റ് ചെയ്യാൻ സാധിച്ചില്ല. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}><FaArrowLeft /> Help & Support</button>
      <h1>Report a Problem</h1>
      <p>സിസ്റ്റത്തിലെ തകരാറുകളും ബഗ്ഗുകളും അഡ്മിനെ നേരിട്ട് അറിയിക്കുക.</p>

      <div className="settings-card help-form-card">
        <div className="form-group">
          <label>Issue Type</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option>Bug</option>
            <option>Payment Problem</option>
            <option>Login Issue</option>
            <option>Profile Issue</option>
          </select>
        </div>

        <div className="form-group">
          <label>Describe the problem</label>
          <textarea
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="പ്രശ്നം എന്താണെന്ന് ഇവിടെ വ്യക്തമായി എഴുതുക..."
          />
          <small>{description.length}/1000</small>
        </div>

        <div className="form-group">
          <label>Attachments / Screenshots <span>(Optional)</span></label>

          {/* ✅ Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="file-input-hidden"
          />

          {/* ✅ Custom upload button */}
          {!file? (
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaImage /> Choose File or Screenshot
            </button>
          ) : (
            <div className="file-preview-container">
              {filePreview && (
                <img src={filePreview} alt="Preview" className="file-preview-img" />
              )}
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <button type="button" className="remove-file-btn" onClick={removeFile}>
                  <FaTimes /> Remove
                </button>
              </div>
            </div>
          )}
          <p>Max file size: 5MB. Supports: JPG, PNG, PDF</p>
        </div>

        <button className="submit-help-btn" onClick={handleSubmit} disabled={loading}>
          <FaPaperPlane /> {loading? "Submitting..." : "Submit to Admin Chat"}
        </button>
      </div>
    </div>
  );
};

export default ReportProblem;