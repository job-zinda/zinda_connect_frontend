import React, { useState, useEffect } from "react";
import { getPreferencesAPI, updatePreferencesAPI, deleteAccountAPI } from "../apis/Api";

const AccountPreferences = () => {
  const [preferences, setPreferences] = useState({
    language: "English",
    distance: "Anywhere",
    age_preference: "All Ages",
    show_me: "Everyone",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPreferencesAPI()
     .then((res) => {
        setPreferences({
          language: res.data.language || "English",
          distance: res.data.distance || "Anywhere",
          age_preference: res.data.age_preference || "All Ages",
          show_me: res.data.show_me || "Everyone",
        });
        setLoading(false);
      })
     .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (field, value) => {
    setPreferences((prev) => ({...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await updatePreferencesAPI(preferences);
      alert("Preferences saved! Home page will update.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      return;
    }
    if (!window.confirm("Final confirmation: All your data will be deleted permanently. Continue?")) {
      return;
    }
    try {
      setDeleting(true);
      await deleteAccountAPI();
      alert("Account deleted successfully.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div className="settings-content" style={{ flex: 1 }}>
      <div className="settings-header">
        <div>
          <h1>Account Preferences</h1>
          <p>Customize your app experience.</p>
        </div>
        <button className="save-btn" onClick={handleSaveChanges} disabled={saving}>
          {saving? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="settings-card preferences-card">
        <div className="preference-row">
          <div className="preference-field">
            <label>Language</label>
            <select value={preferences.language} onChange={(e) => handleChange("language", e.target.value)}>
              <option value="English">English</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>

        <div className="preference-row">
          <div className="preference-field">
            <label>Distance Preference</label>
            <select value={preferences.distance} onChange={(e) => handleChange("distance", e.target.value)}>
              <option value="Anywhere">Anywhere</option>
              <option value="10 km">10 km</option>
              <option value="25 km">25 km</option>
              <option value="50 km">50 km</option>
              <option value="100 km">100 km</option>
            </select>
          </div>
        </div>

        <div className="preference-row">
          <div className="preference-field">
            <label>Age Preference</label>
            <select value={preferences.age_preference} onChange={(e) => handleChange("age_preference", e.target.value)}>
              <option value="All Ages">All Ages</option>
              <option value="18 - 25">18 - 25</option>
              <option value="22 - 30">22 - 30</option>
              <option value="25 - 35">25 - 35</option>
              <option value="30 - 40">30 - 40</option>
              <option value="40+">40+</option>
            </select>
          </div>
        </div>

        <div className="preference-row">
          <div className="preference-field">
            <label>Show Me</label>
            <select value={preferences.show_me} onChange={(e) => handleChange("show_me", e.target.value)}>
              <option value="Everyone">Everyone</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <button
            type="button"
            className="preference-link-row danger"
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "1px solid #ff4d4f", borderRadius: "8px", padding: "12px 16px", cursor: "pointer" }}
          >
            <div style={{ textAlign: "left" }}>
              <h4 style={{ color: "#ff4d4f", margin: 0 }}>{deleting? "Deleting..." : "Delete Account"}</h4>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#666" }}>Permanently delete your account and all data</p>
            </div>
            <span style={{ color: "#ff4d4f", fontSize: "20px" }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPreferences;