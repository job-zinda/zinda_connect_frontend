import React, { useState, useRef } from "react";
import { FaArrowLeft, FaEnvelope, FaWhatsapp, FaPhoneAlt, FaPaperPlane, FaImage, FaTimes } from "react-icons/fa";
import { sendSupportMessageAPI } from "../apis/Api";
import "../styles/helpSupport.css";

const ContactSupport = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("message");
  const [subject, setSubject] = useState("Account Issue");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const SUPPORT_EMAIL = "zindasupport@gmail.com";
  const SUPPORT_PHONE = "+917592998150";
  const WHATSAPP_NUMBER = "917592998150";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    if (!message) return alert("ദയവായി സന്ദേശം ടൈപ്പ് ചെയ്യുക!   Please type your message here!");

    setLoading(true);
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (file) formData.append("attachment", file);

    try {
      await sendSupportMessageAPI(formData);
      alert("Message send to the admin successfully....! സന്ദേശം വിജയകരമായി അഡ്മിന്റെ ചാറ്റിലേക്ക് അയച്ചിട്ടുണ്ട്. അഡ്മിൻ ഉടൻ മറുപടി നൽകുന്നതാണ്!");
      setMessage("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error(err);
      alert("Can't send the message try again..!  അയക്കാൻ സാധിച്ചില്ല, വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}><FaArrowLeft /> Help & Support</button>
      <h1>Contact Support</h1>
      <p>Contact support team directly   /  സപ്പോർട്ട് ടീമുമായി നേരിട്ട് ബന്ധപ്പെടുക.</p>

      <div className="support-tabs">
        <button className={activeTab === "message"? "active" : ""} onClick={() => setActiveTab("message")}>Send Chat Message</button>
        <button className={activeTab === "direct"? "active" : ""} onClick={() => setActiveTab("direct")}>Direct Contact</button>
      </div>

      <div className="settings-card help-form-card">
        {activeTab === "message"? (
          <>
            <div className="form-group">
              <label>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="Account Issue">Account Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Profile Issue">Profile Issue</option>
                <option value="Technical Issue">Technical Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="ടീമിനോട് പറയാനുള്ളത് ഇവിടെ ടൈപ്പ് ചെയ്യുക..." />
              <small>{message.length}/1000</small>
            </div>

            <div className="form-group">
              <label>Attachments <span>(Optional)</span></label>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="file-input-hidden"
              />

              {/* Custom upload button */}
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
              <FaPaperPlane /> {loading? "Sending..." : "Send to Chat"}
            </button>
          </>
        ) : (
          <div className="email-support-box">
            <div className="direct-contact-container">
              {/* Email Option */}
              <div className="direct-card">
                <div className="direct-icon email-ic"><FaEnvelope /></div>
                <h3>Official Email</h3>
                <p>For official queries and statements.</p>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="direct-btn email-btn">{SUPPORT_EMAIL}</a>
              </div>

              {/* WhatsApp Option */}
              <div className="direct-card">
                <div className="direct-icon whatsapp-ic"><FaWhatsapp /></div>
                <h3>WhatsApp Support</h3>
                <p>Chat instantly on WhatsApp.</p>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Support Team,%0A%0AI need assistance from you.%0A%0A*Source: Zinda Connect App*%0A*Page: Help & Support*`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="direct-btn whatsapp-btn"
                >
                  Open WhatsApp
                </a> </div>

              {/* Direct Call Option */}
              <div className="direct-card">
                <div className="direct-icon call-ic"><FaPhoneAlt /></div>
                <h3>Call Customer Care</h3>
                <p>Talk directly with our executives.</p>
                <a href={`tel:${SUPPORT_PHONE}`} className="direct-btn call-btn">Call Support</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSupport;