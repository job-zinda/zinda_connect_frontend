// import React, { useState } from "react";
// import { updatePasswordAPI } from "../apis/Api";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "../styles/settings.css";

// const PasswordSecurity = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({...prev, [name]: value }));
//     setMessage({ type: "", text: "" });
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({...prev, [field]:!prev[field] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });

//     if (!formData.currentPassword ||!formData.newPassword ||!formData.confirmPassword) {
//       setMessage({ type: "error", text: "All fields are required" });
//       return;
//     }

//     if (formData.newPassword.length < 8) {
//       setMessage({ type: "error", text: "New password must be at least 8 characters" });
//       return;
//     }

//     if (formData.newPassword!== formData.confirmPassword) {
//       setMessage({ type: "error", text: "New passwords do not match" });
//       return;
//     }

//     if (formData.currentPassword === formData.newPassword) {
//       setMessage({ type: "error", text: "New password must be different from current password" });
//       return;
//     }

//     setSaving(true);
//     try {
//       await updatePasswordAPI({
//         old_password: formData.currentPassword,
//         new_password: formData.newPassword
//       });

//       setMessage({ type: "success", text: "Password updated successfully!" });
//       setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       console.error("Password update error:", err);
//       const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Password update failed. Please check your current password";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="settings-page">
//       <div className="settings-page-header">
//         <div>
//           <h2>Password & Security</h2>
//           <p>Manage your password and account security.</p>
//         </div>
//       </div>

//       <form className="settings-card" onSubmit={handleSubmit}>
//         <h3>Change Password</h3>

//         {message.text && (
//           <div className={`alert-message ${message.type}`}>
//             {message.text}
//           </div>
//         )}

//         <div className="form-group">
//           <label>Current Password</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPasswords.current? "text" : "password"}
//               name="currentPassword"
//               value={formData.currentPassword}
//               onChange={handleChange}
//               placeholder="Enter current password"
//               autoComplete="current-password"
//               required
//             />
//             <button
//               type="button"
//               className="password-toggle"
//               onClick={() => togglePasswordVisibility("current")}
//             >
//               {showPasswords.current? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>New Password</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPasswords.new? "text" : "password"}
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               placeholder="Enter new password (min 8 characters)"
//               autoComplete="new-password"
//               required
//             />
//             <button
//               type="button"
//               className="password-toggle"
//               onClick={() => togglePasswordVisibility("new")}
//             >
//               {showPasswords.new? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Confirm Password</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPasswords.confirm? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm new password"
//               autoComplete="new-password"
//               required
//             />
//             <button
//               type="button"
//               className="password-toggle"
//               onClick={() => togglePasswordVisibility("confirm")}
//             >
//               {showPasswords.confirm? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>
//         </div>

//         <button type="submit" className="primary-btn" disabled={saving}>
//           {saving? "Updating..." : "Update Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PasswordSecurity;









import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaShieldAlt } from "react-icons/fa";
import { updatePasswordAPI } from "../apis/Api";

const PasswordSecurity = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Ellaa fieldsum fill cheyyuka" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: "error", text: "New password 8 characters minimum venam" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New password match aavunnilla" });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({
        type: "error",
        text: "New password current password-il ninnu vyathyasam venam",
      });
      return;
    }

    setSaving(true);

    try {
      await updatePasswordAPI({
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
      });

      setMessage({ type: "success", text: "Password successfully update cheythu!" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Password update failed. Current password sheriyano ennu nokkuka";

      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-content" style={{ flex: 1 }}>

    <div className="password-security-page">
      <div className="settings-header">
        <div>
          <h1>Password & Security</h1>
          <p>Manage your password and account security.</p>
        </div>
      </div>

      <form className="password-card" onSubmit={handleSubmit}>
        <div className="password-card-title">
          <div className="password-title-icon">
            <FaShieldAlt />
          </div>

          <div>
            <h3>Change Password</h3>
            <p>Use a strong password with at least 8 characters.</p>
          </div>
        </div>

        {message.text && (
          <div className={`password-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="password-form-group">
          <label>Current Password</label>

          <div className="password-input-wrap">
            <FaLock className="password-lock-icon" />

            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-eye-btn"
              onClick={() => togglePasswordVisibility("current")}
              aria-label="Toggle current password visibility"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="password-form-group">
          <label>New Password</label>

          <div className="password-input-wrap">
            <FaLock className="password-lock-icon" />

            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-eye-btn"
              onClick={() => togglePasswordVisibility("new")}
              aria-label="Toggle new password visibility"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="password-form-group">
          <label>Confirm Password</label>

          <div className="password-input-wrap">
            <FaLock className="password-lock-icon" />

            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-eye-btn"
              onClick={() => togglePasswordVisibility("confirm")}
              aria-label="Toggle confirm password visibility"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="password-submit-btn" disabled={saving}>
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
    </div>

  );
};

export default PasswordSecurity;