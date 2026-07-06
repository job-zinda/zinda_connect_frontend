// import React, { useState, useEffect } from "react";
// import { getPreferencesAPI, updatePreferencesAPI } from "../apis/Api";
// import { FaSave } from "react-icons/fa";
// import "../styles/settings.css";

// const PrivacySettings = () => {
//   const [privacy, setPrivacy] = useState({
//     profile_visibility: "Everyone",
//     last_seen: false,
//     online_status: true,
//     photo_visibility: "Everyone",
//     contact_visibility: "Matches Only",
//     activity_status: "Matches Only",
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     getPreferencesAPI()
//     .then((res) => {
//         setPrivacy(res.data);
//         setLoading(false);
//       })
//     .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   const handleChange = (key, value) => {
//     setPrivacy((prev) => ({...prev, [key]: value }));
//   };

//   const handleSaveChanges = async () => {
//     try {
//       setSaving(true);
//       await updatePreferencesAPI(privacy);
//       alert("Privacy settings saved successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="settings-loading">Loading...</div>;

//   return (
//     <div className="settings-page">
//       <div className="settings-page-header">
//         <div>
//           <h2>Privacy Settings</h2>
//           <p>Manage who can see your information.</p>
//         </div>
//         <button className="save-changes-btn" onClick={handleSaveChanges} disabled={saving}>
//           <FaSave /> {saving? 'Saving...' : 'Save Changes'}
//         </button>
//       </div>

//       <div className="settings-card">
//         <div className="form-group">
//           <label>Profile Visibility</label>
//           <p>Choose who can see your profile.</p>
//           <select
//             value={privacy.profile_visibility}
//             onChange={(e) => handleChange("profile_visibility", e.target.value)}
//           >
//             <option value="Everyone">Everyone</option>
//             <option value="Matches Only">Matches Only</option>
//             <option value="Only Me">Only Me</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Show Last Seen</label>
//           <p>Allow others to see when you were last active</p>
//           <label className="toggle-switch">
//             <input
//               type="checkbox"
//               checked={privacy.last_seen}
//               onChange={() => handleChange("last_seen",!privacy.last_seen)}
//             />
//             <span className="slider"></span>
//           </label>
//         </div>

//         <div className="form-group">
//           <label>Show Online Status</label>
//           <p>Allow others to see when you are online</p>
//           <label className="toggle-switch">
//             <input
//               type="checkbox"
//               checked={privacy.online_status}
//               onChange={() => handleChange("online_status",!privacy.online_status)}
//             />
//             <span className="slider"></span>
//           </label>
//         </div>

//         <div className="form-group">
//           <label>Photo Visibility</label>
//           <p>Choose who can view your photos</p>
//           <select
//             value={privacy.photo_visibility}
//             onChange={(e) => handleChange("photo_visibility", e.target.value)}
//           >
//             <option value="Everyone">Everyone</option>
//             <option value="Matches Only">Matches Only</option>
//             <option value="Only Me">Only Me</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Contact Visibility</label>
//           <p>Show my phone number to</p>
//           <select
//             value={privacy.contact_visibility}
//             onChange={(e) => handleChange("contact_visibility", e.target.value)}
//           >
//             <option value="Everyone">Everyone</option>
//             <option value="Matches Only">Matches Only</option>
//             <option value="Only Me">Only Me</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Activity Status</label>
//           <p>Show my activity to</p>
//           <select
//             value={privacy.activity_status}
//             onChange={(e) => handleChange("activity_status", e.target.value)}
//           >
//             <option value="Everyone">Everyone</option>
//             <option value="Matches Only">Matches Only</option>
//             <option value="Only Me">Only Me</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrivacySettings;



import React, { useState, useEffect } from "react";
import { getPreferencesAPI, updatePreferencesAPI } from "../apis/Api";

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profile_visibility: "Everyone",
    last_seen: false,
    online_status: true,
    photo_visibility: "Everyone",
    contact_visibility: "Matches Only",
    activity_status: "Matches Only",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPreferencesAPI()
     .then((res) => {
        setPrivacy(res.data);
        setLoading(false);
      })
     .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (key, value) => {
    setPrivacy((prev) => ({...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await updatePreferencesAPI(privacy);
      alert("Privacy settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <>
    <div className="settings-content" style={{ flex: 1 }}>

      <div className="settings-header">
        <div>
          <h1>Privacy Settings</h1>
          <p>Manage who can see your information.</p>
        </div>
        <button
          type="button"
          className="save-btn"
          onClick={handleSaveChanges}
          disabled={saving}
        >
          {saving? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-card privacy-card">
        <h3>Privacy Settings</h3>

        <div className="privacy-row">
          <div>
            <h4>Profile Visibility</h4>
            <p>Choose who can see your profile.</p>
          </div>
          <select
            value={privacy.profile_visibility}
            onChange={(e) => handleChange("profile_visibility", e.target.value)}
          >
            <option value="Everyone">Everyone</option>
            <option value="Matches Only">Matches Only</option>
            <option value="Only Me">Only Me</option>
          </select>
        </div>

        <div className="privacy-row">
          <div>
            <h4>Show Last Seen</h4>
            <p>Allow others to see when you were last active</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={privacy.last_seen}
              onChange={() => handleChange("last_seen",!privacy.last_seen)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="privacy-row">
          <div>
            <h4>Show Online Status</h4>
            <p>Allow others to see when you are online</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={privacy.online_status}
              onChange={() => handleChange("online_status",!privacy.online_status)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="privacy-row">
          <div>
            <h4>Photo Visibility</h4>
            <p>Choose who can view your photos</p>
          </div>
          <select
            value={privacy.photo_visibility}
            onChange={(e) => handleChange("photo_visibility", e.target.value)}
          >
            <option value="Everyone">Everyone</option>
            <option value="Matches Only">Matches Only</option>
            <option value="Only Me">Only Me</option>
          </select>
        </div>

        <div className="privacy-row">
          <div>
            <h4>Contact Visibility</h4>
            <p>Show my phone number to</p>
          </div>
          <select
            value={privacy.contact_visibility}
            onChange={(e) => handleChange("contact_visibility", e.target.value)}
          >
            <option value="Everyone">Everyone</option>
            <option value="Matches Only">Matches Only</option>
            <option value="Only Me">Only Me</option>
          </select>
        </div>

        <div className="privacy-row">
          <div>
            <h4>Activity Status</h4>
            <p>Show my activity to</p>
          </div>
          <select
            value={privacy.activity_status}
            onChange={(e) => handleChange("activity_status", e.target.value)}
          >
            <option value="Everyone">Everyone</option>
            <option value="Matches Only">Matches Only</option>
            <option value="Only Me">Only Me</option>
          </select>
        </div>
      </div>
      </div>

    </>
  );
};

export default PrivacySettings;