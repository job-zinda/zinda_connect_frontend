import React, { useState } from "react";
import "../styles/settings.css";

import Navbar from "./Navbar";
import SettingsSidebar from "./SettingsSidebar";
import ProfileInformation from "./ProfileInformation";
import PasswordSecurity from "./PasswordSecurity";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <Navbar />

      <div className="settings-page">
        <div className="settings-container">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="settings-content">
            {activeTab === "profile" && <ProfileInformation />}
            {activeTab === "password" && <PasswordSecurity />}

            {activeTab !== "profile" && activeTab !== "password" && (
              <div className="empty-settings-card">
                <h1>Coming Soon</h1>
                <p>This section will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}