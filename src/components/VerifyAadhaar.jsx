// // import React, { useState, useEffect } from "react";
// // import { getAadhaarVerificationAPI, submitAadhaarVerificationAPI } from "../apis/Api";

// // export default function VerifyAadhaar() {
// //   const [aadhaarNumber, setAadhaarNumber] = useState("");
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState("");
// //   const [verification, setVerification] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [message, setMessage] = useState({ type: "", text: "" });
// //   const [isEditing, setIsEditing] = useState(false); // ✅ Edit mode

// //   useEffect(() => {
// //     fetchVerificationStatus();
// //   }, []);

// //   const fetchVerificationStatus = async () => {
// //     try {
// //       const res = await getAadhaarVerificationAPI();
// //       if (res.data.status!== "not_submitted") {
// //         setVerification(res.data);
// //         setAadhaarNumber(res.data.aadhaar_number || "");
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch verification", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const maxSize = 5 * 1024 * 1024;
// //     if (file.size > maxSize) {
// //       setMessage({ type: "error", text: "ഫയൽ സൈസ് 5MB-യിൽ കൂടരുത്!" });
// //       e.target.value = "";
// //       return;
// //     }

// //     setMessage({ type: "", text: "" });
// //     setSelectedFile(file);

// //     if (previewUrl) {
// //       URL.revokeObjectURL(previewUrl);
// //     }

// //     setTimeout(() => {
// //       setPreviewUrl(URL.createObjectURL(file));
// //     }, 0);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage({ type: "", text: "" });

// //     if (aadhaarNumber.length!== 12) {
// //       setMessage({ type: "error", text: "Aadhaar number 12 digits ആയിരിക്കണം" });
// //       return;
// //     }

// //     if (!selectedFile &&!verification?.aadhaar_image) {
// //       setMessage({ type: "error", text: "Aadhaar image upload ചെയ്യുക" });
// //       return;
// //     }

// //     setSubmitting(true);
// //     const formData = new FormData();
// //     formData.append("aadhaar_number", aadhaarNumber);
// //     if (selectedFile) {
// //       formData.append("aadhaar_image", selectedFile);
// //     }

// //     try {
// //       await submitAadhaarVerificationAPI(formData);
// //       setMessage({ type: "success", text: "Verification request അപ്ഡേറ്റ് ചെയ്തു! Admin വീണ്ടും review ചെയ്യും." });
// //       setSelectedFile(null);
// //       if (previewUrl) {
// //         URL.revokeObjectURL(previewUrl);
// //         setPreviewUrl("");
// //       }
// //       setIsEditing(false);
// //       fetchVerificationStatus();
// //     } catch (err) {
// //       console.error("Submit error:", err);
// //       setMessage({
// //         type: "error",
// //         text: err.response?.data?.error || err.response?.data?.aadhaar_number?.[0] || "Submit ചെയ്യാൻ സാധിച്ചില്ല"
// //       });
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   useEffect(() => {
// //     return () => {
// //       if (previewUrl) {
// //         URL.revokeObjectURL(previewUrl);
// //       }
// //     };
// //   }, [previewUrl]);

// //   if (loading) {
// //     return <div className="settings-content" style={{ flex: 1, padding: "40px", textAlign: "center" }}>Loading...</div>;
// //   }

// //   return (
// //     <div className="settings-content" style={{ flex: 1 }}>
// //       <div className="settings-header">
// //         <div>
// //           <h1>Get Verified</h1>
// //           <p>Aadhaar ഉപയോഗിച്ച് profile verify ചെയ്യുക</p>
// //         </div>
// //       </div>

// //       {message.text && (
// //         <div style={{
// //           padding: "12px",
// //           marginBottom: "20px",
// //           borderRadius: "4px",
// //           backgroundColor: message.type === "success"? "#d4edda" : "#f8d7da",
// //           color: message.type === "success"? "#155724" : "#721c24",
// //           fontWeight: "500"
// //         }}>
// //           {message.text}
// //         </div>
// //       )}

// //       {/*  Verified */}
// //       {verification?.status === "verified"? (
// //         <div className="profile-card">
// //           <div style={{ textAlign: "center", padding: "40px" }}>
// //             <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
// //             <h3 style={{ color: "#16a34a", marginBottom: "10px" }}>Verified</h3>
// //             <p style={{ color: "#667085" }}>നിങ്ങളുടെ Aadhaar verified ആയി!</p>
// //             <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
// //               Verified on: {verification.verified_at? new Date(verification.verified_at).toLocaleDateString() : "N/A"}
// //             </p>
// //           </div>
// //         </div>

      
// //       ) : verification?.status === "pending" &&!isEditing? (
// //         <div className="profile-card">
// //           <div style={{ textAlign: "center", padding: "40px" }}>
// //             <div style={{ fontSize: "60px", marginBottom: "20px" }}>⏳</div>
// //             <h3 style={{ color: "#f59e0b", marginBottom: "10px" }}>Pending Review</h3>
// //             <p style={{ color: "#667085" }}>നിങ്ങളുടെ verification request review ചെയ്യുന്നു</p>
// //             <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
// //               Submitted on: {verification.created_at? new Date(verification.created_at).toLocaleDateString() : "N/A"}
// //             </p>
// //             <button
// //               onClick={() => setIsEditing(true)}
// //               className="save-btn"
// //               style={{ marginTop: "20px", backgroundColor: "#3b82f6" }}
// //             >
// //               ✏️ Update Aadhaar
// //             </button>
// //           </div>
// //         </div>

    
// //       ) : verification?.status === "rejected" || isEditing? (
// //         <>
// //           {verification?.status === "rejected" && (
// //             <div className="profile-card" style={{ marginBottom: "20px", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
// //               <div style={{ padding: "20px" }}>
// //                 <h3 style={{ color: "#dc2626", marginBottom: "10px" }}>Rejected</h3>
// //                 <p style={{ color: "#7f1d1d" }}>{verification.rejection_reason || "Verification rejected"}</p>
// //               </div>
// //             </div>
// //           )}
// //           {renderForm()}
// //         </>
// //       ) : (
// //         renderForm()
// //       )}
// //     </div>
// //   );

// //   function renderForm() {
// //     return (
// //       <form className="profile-card" onSubmit={handleSubmit}>
// //         <div className="profile-right" style={{ width: "100%" }}>
// //           <h3>{isEditing? "Update Aadhaar Details" : "Aadhaar Details"}</h3>

// //           <div className="form-group">
// //             <label>Aadhaar Number *</label>
// //             <input
// //               type="text"
// //               value={aadhaarNumber}
// //               onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
// //               placeholder="12 digit Aadhaar number"
// //               maxLength="12"
// //               required
// //             />
// //             <span style={{ fontSize: "12px", color: "#667085" }}>
// //               Enter 12 digit number without spaces
// //             </span>
// //           </div>

// //           <div className="form-group">
// //             <label>Aadhaar Card Image *</label>
// //             <div className="profile-image-box" style={{ width: "300px", height: "200px", borderRadius: "8px", marginBottom: "10px", border: "2px dashed #e2e8f0" }}>
// //               {previewUrl? (
// //                 <img
// //                   src={previewUrl}
// //                   alt="Aadhaar Preview"
// //                   style={{ width: "100%", height: "100%", objectFit: "contain" }}
// //                 />
// //               ) : verification?.aadhaar_image? (
// //                 <img
// //                   src={verification.aadhaar_image}
// //                   alt="Current Aadhaar"
// //                   style={{ width: "100%", height: "100%", objectFit: "contain" }}
// //                 />
// //               ) : (
// //                 <div style={{
// //                   width: "100%",
// //                   height: "100%",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   backgroundColor: "#f8fafc",
// //                   color: "#999",
// //                   flexDirection: "column",
// //                   gap: "10px"
// //                 }}>
// //                   <span style={{ fontSize: "40px" }}>📄</span>
// //                   <span>No image selected</span>
// //                 </div>
// //               )}
// //               <label htmlFor="aadhaar-file" className="upload-icon" style={{ cursor: "pointer" }}>
// //                 📷
// //               </label>
// //               <input
// //                 id="aadhaar-file"
// //                 type="file"
// //                 accept="image/jpeg,image/jpg,image/png"
// //                 onChange={handleFileChange}
// //                 style={{ display: "none" }}
// //               />
// //             </div>
// //             <label htmlFor="aadhaar-file" className="upload-btn" style={{ cursor: "pointer", display: "inline-block" }}>
// //               {selectedFile? "Change Image" : "Upload Aadhaar Image"}
// //             </label>
// //             <span>JPG, PNG. Max size 5MB. Clear photo of front side.</span>
// //           </div>

// //           <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
// //             <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
// //               <strong>Note:</strong> നിങ്ങളുടെ Aadhaar details secure ആയി store ചെയ്യും. Admin verification ശേഷം verified badge കിട്ടും.
// //             </p>
// //           </div>

// //           <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
// //             {isEditing && (
// //               <button
// //                 type="button"
// //                 onClick={() => setIsEditing(false)}
// //                 className="save-btn"
// //                 style={{ backgroundColor: "#6b7280" }}
// //               >
// //                 Cancel
// //               </button>
// //             )}
// //             <button
// //               type="submit"
// //               className="save-btn"
// //               disabled={submitting}
// //             >
// //               {submitting? "Submitting..." : isEditing? "Update for Verification" : "Submit for Verification"}
// //             </button>
// //           </div>
// //         </div>
// //       </form>
// //     );
// //   }
// // }
// import React, { useState, useEffect } from "react";
// import { getAadhaarVerificationAPI, submitAadhaarVerificationAPI } from "../apis/Api";

// export default function VerifyAadhaar() {
//   const [aadhaarNumber, setAadhaarNumber] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [verification, setVerification] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [isEditing, setIsEditing] = useState(false); // ✅ Edit mode

//   useEffect(() => {
//     fetchVerificationStatus();
//   }, []);

//   const fetchVerificationStatus = async () => {
//     try {
//       const res = await getAadhaarVerificationAPI();
//       if (res.data.status!== "not_submitted") {
//         setVerification(res.data);
//         setAadhaarNumber(res.data.aadhaar_number || "");
//       }
//     } catch (err) {
//       console.error("Failed to fetch verification", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setMessage({ type: "error", text: "ഫയൽ സൈസ് 5MB-യിൽ കൂടരുത്!" });
//       e.target.value = "";
//       return;
//     }

//     setMessage({ type: "", text: "" });
//     setSelectedFile(file);

//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//     }

//     setTimeout(() => {
//       setPreviewUrl(URL.createObjectURL(file));
//     }, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });

//     if (aadhaarNumber.length!== 12) {
//       setMessage({ type: "error", text: "Aadhaar number 12 digits ആയിരിക്കണം" });
//       return;
//     }

//     if (!selectedFile &&!verification?.aadhaar_image) {
//       setMessage({ type: "error", text: "Aadhaar image upload ചെയ്യുക" });
//       return;
//     }

//     setSubmitting(true);
//     const formData = new FormData();
//     formData.append("aadhaar_number", aadhaarNumber);
//     if (selectedFile) {
//       formData.append("aadhaar_image", selectedFile);
//     }

//     try {
//       await submitAadhaarVerificationAPI(formData);
//       setMessage({ type: "success", text: "Verification request അപ്ഡേറ്റ് ചെയ്തു! Admin വീണ്ടും review ചെയ്യും." });
//       setSelectedFile(null);
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//         setPreviewUrl("");
//       }
//       setIsEditing(false);
//       fetchVerificationStatus();
//     } catch (err) {
//       console.error("Submit error:", err);
//       setMessage({
//         type: "error",
//         text: err.response?.data?.error || err.response?.data?.aadhaar_number?.[0] || "Submit ചെയ്യാൻ സാധിച്ചില്ല"
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   if (loading) {
//     return <div className="settings-content" style={{ flex: 1, padding: "40px", textAlign: "center" }}>Loading...</div>;
//   }

//   return (
//     <div className="settings-content" style={{ flex: 1 }}>
//       <div className="settings-header">
//         <div>
//           <h1>Get Verified</h1>
//           <p>Aadhaar ഉപയോഗിച്ച് profile verify ചെയ്യുക</p>
//         </div>
//       </div>

//       {message.text && (
//         <div style={{
//           padding: "12px",
//           marginBottom: "20px",
//           borderRadius: "4px",
//           backgroundColor: message.type === "success"? "#d4edda" : "#f8d7da",
//           color: message.type === "success"? "#155724" : "#721c24",
//           fontWeight: "500"
//         }}>
//           {message.text}
//         </div>
//       )}

//       {/* ✅ Verified */}
//       {verification?.status === "verified"? (
//         <div className="profile-card">
//           <div style={{ textAlign: "center", padding: "40px" }}>
//             <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
//             <h3 style={{ color: "#16a34a", marginBottom: "10px" }}>Verified</h3>
//             <p style={{ color: "#667085" }}>നിങ്ങളുടെ Aadhaar verified ആയി!</p>
//             <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
//               Verified on: {verification.verified_at? new Date(verification.verified_at).toLocaleDateString() : "N/A"}
//             </p>
//           </div>
//         </div>

      
//       ) : verification?.status === "pending" &&!isEditing? (
//         <div className="profile-card">
//           <div style={{ textAlign: "center", padding: "40px" }}>
//             <div style={{ fontSize: "60px", marginBottom: "20px" }}>⏳</div>
//             <h3 style={{ color: "#f59e0b", marginBottom: "10px" }}>Pending Review</h3>
//             <p style={{ color: "#667085" }}>നിങ്ങളുടെ verification request review ചെയ്യുന്നു</p>
//             <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
//               Submitted on: {verification.created_at? new Date(verification.created_at).toLocaleDateString() : "N/A"}
//             </p>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="save-btn"
//               style={{ marginTop: "20px", backgroundColor: "#3b82f6" }}
//             >
//               ✏️ Update Aadhaar
//             </button>
//           </div>
//         </div>

    
//       ) : verification?.status === "rejected" || isEditing? (
//         <>
//           {verification?.status === "rejected" && (
//             <div className="profile-card" style={{ marginBottom: "20px", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
//               <div style={{ padding: "20px" }}>
//                 <h3 style={{ color: "#dc2626", marginBottom: "10px" }}>Rejected</h3>
//                 <p style={{ color: "#7f1d1d" }}>{verification.rejection_reason || "Verification rejected"}</p>
//               </div>
//             </div>
//           )}
//           {renderForm()}
//         </>
//       ) : (
//         renderForm()
//       )}
//     </div>
//   );

//   function renderForm() {
//     return (
//       <form className="profile-card" onSubmit={handleSubmit}>
//         <div className="profile-right" style={{ width: "100%" }}>
//           <h3>{isEditing? "Update Aadhaar Details" : "Aadhaar Details"}</h3>

//           <div className="form-group">
//             <label>Aadhaar Number *</label>
//             <input
//               type="text"
//               value={aadhaarNumber}
//               onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
//               placeholder="12 digit Aadhaar number"
//               maxLength="12"
//               required
//             />
//             <span style={{ fontSize: "12px", color: "#667085" }}>
//               Enter 12 digit number without spaces
//             </span>
//           </div>

//           <div className="form-group">
//             <label>Aadhaar Card Image *</label>
//             <div className="profile-image-box" style={{ width: "300px", height: "200px", borderRadius: "8px", marginBottom: "10px", border: "2px dashed #e2e8f0" }}>
//               {previewUrl? (
//                 <img
//                   src={previewUrl}
//                   alt="Aadhaar Preview"
//                   style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                 />
//               ) : verification?.aadhaar_image? (
//                 <img
//                   src={verification.aadhaar_image}
//                   alt="Current Aadhaar"
//                   style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                 />
//               ) : (
//                 <div >
//                   <span style={{ fontSize: "40px" }}>📄</span>
//                   <span>No image selected</span>
//                 </div>
//               )}
//               <label htmlFor="aadhaar-file" className="upload-icon" style={{ cursor: "pointer" }}>
//                 📷
//               </label>
//               <input
//                 id="aadhaar-file"
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />
//             </div>
//             <label htmlFor="aadhaar-file" className="upload-btn" style={{ cursor: "pointer", display: "inline-block" }}>
//               {selectedFile? "Change Image" : "Upload Aadhaar Image"}
//             </label>
//             <span>JPG, PNG. Max size 5MB. Clear photo of front side.</span>
//           </div>

//           <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
//             <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
//               <strong>Note:</strong> നിങ്ങളുടെ Aadhaar details secure ആയി store ചെയ്യും. Admin verification ശേഷം verified badge കിട്ടും.
//             </p>
//           </div>

//           <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="save-btn"
//                 style={{ backgroundColor: "#6b7280" }}
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="save-btn"
//               disabled={submitting}
//             >
//               {submitting? "Submitting..." : isEditing? "Update for Verification" : "Submit for Verification"}
//             </button>
//           </div>
//         </div>
//       </form>
//     );
//   }
// }
import React, { useState, useEffect } from "react";
import { getAadhaarVerificationAPI, submitAadhaarVerificationAPI, getSubscriptionAPI, getPublicPlansAPI, API_BASE_URL } from "../apis/Api";
import { FaCrown, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function VerifyAadhaar() {
  const navigate = useNavigate();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Subscription check
  const [subscription, setSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [verifyRes, subRes, plansRes] = await Promise.all([
        getAadhaarVerificationAPI(),
        getSubscriptionAPI(),
        getPublicPlansAPI()
      ]);

      if (verifyRes.data.status!== "not_submitted") {
        setVerification(verifyRes.data);
        setAadhaarNumber(verifyRes.data.aadhaar_number || "");
      }

      setSubscription(subRes.data);
      setAvailablePlans(plansRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: "error", text: "ഫയൽ സൈസ് 5MB-യിൽ കൂടരുത്!" });
      e.target.value = "";
      return;
    }
    setMessage({ type: "", text: "" });
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setTimeout(() => setPreviewUrl(URL.createObjectURL(file)), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CRITICAL: Premium ഇല്ലെങ്കിൽ block ചെയ്യുക
    if (!subscription?.is_active) {
      setMessage({ type: "error", text: "Verification ചെയ്യാൻ Premium Plan എടുക്കണം!" });
      setShowPlans(true);
      return;
    }

    setMessage({ type: "", text: "" });
    if (aadhaarNumber.length!== 12) {
      setMessage({ type: "error", text: "Aadhaar number 12 digits ആയിരിക്കണം" });
      return;
    }
    if (!selectedFile &&!verification?.aadhaar_image) {
      setMessage({ type: "error", text: "Aadhaar image upload ചെയ്യുക" });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("aadhaar_number", aadhaarNumber);
    if (selectedFile) formData.append("aadhaar_image", selectedFile);

    try {
      await submitAadhaarVerificationAPI(formData);
      setMessage({ type: "success", text: "Verification request അപ്ഡേറ്റ് ചെയ്തു! Admin വീണ്ടും review ചെയ്യും." });
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      setIsEditing(false);
      fetchAllData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || err.response?.data?.aadhaar_number?.[0] || "Submit ചെയ്യാൻ സാധിച്ചില്ല"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (plan) => {
    setIsProcessingPayment(true);
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const token = localStorage.getItem("access");
      const orderRes = await axios.post(
        `${API_BASE_URL}/api/auth/payment/create-order/`,
        { plan_id: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, amount, currency, key, plan_name } = orderRes.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Zinda Connect",
        description: `${plan_name} Subscription`,
        order_id: order_id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_BASE_URL}/api/auth/payment/verify/`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful! ഇപ്പോൾ Verify ചെയ്യാം.");
            setShowPlans(false);
            fetchAllData();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: subscription?.user_name || "",
          email: subscription?.email || ""
        },
        theme: { color: "#E91E63" },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) {
    return <div className="settings-content" style={{ flex: 1, padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  // ✅ Free user ആണെങ്കിൽ Plans കാണിക്കും
  if (!subscription?.is_active && showPlans) {
    return (
      <div className="settings-content" style={{ flex: 1 }}>
        <div className="settings-header">
          <div>
            <h1>Get Verified</h1>
            <p>Premium Plan എടുത്ത് Aadhaar Verify ചെയ്യുക</p>
          </div>
        </div>

        <div className="profile-card" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", marginBottom: "20px" }}>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <FaCrown style={{ fontSize: "40px", color: "#f59e0b", marginBottom: "10px" }} />
            <h3 style={{ color: "#92400e", marginBottom: "8px" }}>Premium Required</h3>
            <p style={{ color: "#92400e", fontSize: "14px" }}>
              Aadhaar verification ചെയ്യാൻ Premium subscription വേണം. Plan select ചെയ്യുക.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {availablePlans.map((plan) => (
            <div key={plan.id} style={{
              border: `2px solid ${plan.badge_color || '#e0e0e0'}`,
              padding: "25px",
              borderRadius: "10px",
              textAlign: "center",
              background: "#fff"
            }}>
              <h4 style={{ fontSize: "20px", margin: "0 0 10px 0" }}>{plan.name}</h4>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: "15px 0", color: "#e91e63" }}>₹{plan.price}</p>
              <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "6px", margin: "15px 0", fontSize: "14px" }}>
                <strong>Validity:</strong> {plan.duration_months} Months
              </div>
              <div style={{ minHeight: "100px", textAlign: "left", margin: "15px 0" }}>
                {Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: "8px 0", fontSize: "14px" }}>
                    <FaCheck color="#2b8a3e" size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePayment(plan)}
                disabled={isProcessingPayment}
                style={{
                  background: "#e91e63",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  width: "100%",
                  cursor: isProcessingPayment? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  opacity: isProcessingPayment? 0.6 : 1
                }}
              >
                {isProcessingPayment? "Processing..." : "Pay Now"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowPlans(false)}
          style={{ marginTop: "20px", background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="settings-content" style={{ flex: 1 }}>
      <div className="settings-header">
        <div>
          <h1>Get Verified</h1>
          <p>Aadhaar ഉപയോഗിച്ച് profile verify ചെയ്യുക</p>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "4px",
          backgroundColor: message.type === "success"? "#d4edda" : "#f8d7da",
          color: message.type === "success"? "#155724" : "#721c24",
          fontWeight: "500"
        }}>
          {message.text}
        </div>
      )}

      {/* ✅ Premium ഇല്ലെങ്കിൽ warning */}
      {!subscription?.is_active && (
        <div className="profile-card" style={{ marginBottom: "20px", backgroundColor: "#fff3cd", border: "1px solid #ffc107" }}>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
            <FaCrown style={{ fontSize: "40px", color: "#f59e0b" }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: "#92400e", margin: "0 0 8px 0" }}>Premium Required</h3>
              <p style={{ color: "#92400e", fontSize: "14px", margin: 0 }}>
                Aadhaar verification ചെയ്യാൻ Premium subscription വേണം.
              </p>
            </div>
            <button
              onClick={() => setShowPlans(true)}
              style={{ background: "#e91e63", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              View Plans
            </button>
          </div>
        </div>
      )}

      {verification?.status === "verified"? (
        <div className="profile-card">
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
            <h3 style={{ color: "#16a34a", marginBottom: "10px" }}>Verified</h3>
            <p style={{ color: "#667085" }}>നിങ്ങളുടെ Aadhaar verified ആയി!</p>
            <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
              Verified on: {verification.verified_at? new Date(verification.verified_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      ) : verification?.status === "pending" &&!isEditing? (
        <div className="profile-card">
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>⏳</div>
            <h3 style={{ color: "#f59e0b", marginBottom: "10px" }}>Pending Review</h3>
            <p style={{ color: "#667085" }}>നിങ്ങളുടെ verification request review ചെയ്യുന്നു</p>
            <p style={{ fontSize: "14px", color: "#667085", marginTop: "10px" }}>
              Submitted on: {verification.created_at? new Date(verification.created_at).toLocaleDateString() : "N/A"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="save-btn"
              style={{ marginTop: "20px", backgroundColor: "#3b82f6" }}
            >
              ✏️ Update Aadhaar
            </button>
          </div>
        </div>
      ) : verification?.status === "rejected" || isEditing? (
        <>
          {verification?.status === "rejected" && (
            <div className="profile-card" style={{ marginBottom: "20px", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <div style={{ padding: "20px" }}>
                <h3 style={{ color: "#dc2626", marginBottom: "10px" }}>Rejected</h3>
                <p style={{ color: "#7f1d1d" }}>{verification.rejection_reason || "Verification rejected"}</p>
              </div>
            </div>
          )}
          {renderForm()}
        </>
      ) : (
        renderForm()
      )}
    </div>
  );

  function renderForm() {
    return (
      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-right" style={{ width: "100%" }}>
          <h3>{isEditing? "Update Aadhaar Details" : "Aadhaar Details"}</h3>

          <div className="form-group">
            <label>Aadhaar Number *</label>
            <input
              type="text"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="12 digit Aadhaar number"
              maxLength="12"
              required
              disabled={!subscription?.is_active}
            />
            <span style={{ fontSize: "12px", color: "#667085" }}>
              Enter 12 digit number without spaces
            </span>
          </div>

          <div className="form-group">
            <label>Aadhaar Card Image *</label>
            <div className="profile-image-box" style={{ width: "300px", height: "200px", borderRadius: "8px", marginBottom: "10px", border: "2px dashed #e2e8f0" }}>
              {previewUrl? (
                <img src={previewUrl} alt="Aadhaar Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : verification?.aadhaar_image? (
                <img src={verification.aadhaar_image} alt="Current Aadhaar" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", color: "#999", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "40px" }}>📄</span>
                  <span>No image selected</span>
                </div>
              )}
              <label htmlFor="aadhaar-file" className="upload-icon" style={{ cursor: subscription?.is_active? "pointer" : "not-allowed" }}>📷</label>
              <input
                id="aadhaar-file"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={!subscription?.is_active}
              />
            </div>
            <label htmlFor="aadhaar-file" className="upload-btn" style={{ cursor: subscription?.is_active? "pointer" : "not-allowed", display: "inline-block", opacity: subscription?.is_active? 1 : 0.5 }}>
              {selectedFile? "Change Image" : "Upload Aadhaar Image"}
            </label>
            <span>JPG, PNG. Max size 5MB. Clear photo of front side.</span>
          </div>

          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
            <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
              <strong>Note:</strong> നിങ്ങളുടെ Aadhaar details secure ആയി store ചെയ്യും. Admin verification ശേഷം verified badge കിട്ടും.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {isEditing && (
              <button type="button" onClick={() => setIsEditing(false)} className="save-btn" style={{ backgroundColor: "#6b7280" }}>
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="save-btn"
              disabled={submitting ||!subscription?.is_active}
              style={{ opacity:!subscription?.is_active? 0.5 : 1 }}
            >
              {submitting? "Submitting..." : isEditing? "Update for Verification" : "Submit for Verification"}
            </button>
          </div>
        </div>
      </form>
    );
  }
}