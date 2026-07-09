import React, { useState } from "react";
import "../styles/settings.css";

import Navbar from "./Navbar";
import SettingsSidebar from "./SettingsSidebar";
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
            {activeTab === "password" && <PasswordSecurity />}

            {activeTab !== "password" && (
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