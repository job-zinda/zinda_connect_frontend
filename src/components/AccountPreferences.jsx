
import React, { useState, useEffect } from "react";
import { getPreferencesAPI, updatePreferencesAPI } from "../apis/Api";

const AccountPreferences = () => {
  const [preferences, setPreferences] = useState({
    language: "English",
    distance: "Anywhere", // ✅ Default Anywhere
    age_preference: "All Ages", // ✅ Default All Ages
    show_me: "Everyone", // ✅ Default Everyone
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      alert("Account deletion request submitted.");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <>
    <div className="settings-content" style={{ flex: 1 }}>

      <div className="settings-header">
        <div>
          <h1>Account Preferences</h1>
          <p>Customize your app experience.</p>
        </div>
        <button className="save-btn" onClick={handleSaveChanges} disabled={saving}>
          {saving? 'Saving...' : 'Save Changes'}
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

        <button type="button" className="preference-link-row danger" onClick={handleDeleteAccount}>
          <div>
            <h4>Delete Account</h4>
            <p>Permanently delete your account and all data</p>
          </div>
          <span>›</span>
        </button>
      </div>
      </div>

    </>
  );
};

export default AccountPreferences;