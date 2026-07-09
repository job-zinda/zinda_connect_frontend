import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Existing Imports
import Home from "./components/Home";
import Login from "./components/Login";
import ProfileDetails from "./components/ProfileDetails";
import ProfileCreationController from "./components/ProfileCreationController";
import AdminDashboard from "./admin/AdminDashboard";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";

// New Components
import AccountPreferences from "./components/AccountPreferences";
import BlockedUsers from "./components/BlockedUsers";
import ContactSupport from "./components/ContactSupport";
import FAQPage from "./components/FAQPage";
import HelpSupport from "./components/HelpSupport";
import Notifications from "./components/Notifications";
import PasswordSecurity from "./components/PasswordSecurity";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PrivacySettings from "./components/PrivacySettings";
import ReportProblem from "./components/ReportProblem";
import SafetyTips from "./components/SafetyTips";
import Subscription from "./components/Subscription";
import TermsConditions from "./components/TermsConditions";
import LikedProfiles from "./components/LikedProfiles";
import FavouriteProfiles from "./components/FavouriteProfiles";
import Matches from "./components/Matches";
import ChatPage from "./components/ChatPage";

// ✅ Footer Pages
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import Blog from "./components/Blog";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="/navbar" element={<Navbar />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Profile Creation Setup Route */}
        <Route path="/create-profile/:type" element={<ProfileCreationController />} />

        {/* User Home/Profile */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile-details/:id" element={<ProfileDetails />} />
        <Route path="/matches" element={<Matches />} />

        {/* View All Route Connections */}
        <Route path="/all-brides" element={<Matches initialFilter="bride" />} />
        <Route path="/all-grooms" element={<Matches initialFilter="groom" />} />

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* ✅ Footer Pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/blog" element={<Blog />} />

        {/* Settings - All tabs use same component */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile-information" element={<Settings />} />
        <Route path="/settings/get-verified" element={<Settings />} />
        <Route path="/settings/password-security" element={<Settings />} />
        <Route path="/settings/notifications" element={<Settings />} />
        <Route path="/settings/privacy-settings" element={<Settings />} />
        <Route path="/settings/account-preferences" element={<Settings />} />
        <Route path="/settings/blocked-users" element={<Settings />} />
        <Route path="/settings/subscription" element={<Settings />} />
        <Route path="/settings/favourites" element={<Settings />} />
        <Route path="/settings/likes" element={<Settings />} />
        <Route path="/settings/help-support" element={<Settings />} />

        {/* Standalone Pages - if needed */}
        <Route path="/favourites" element={<FavouriteProfiles />} />
        <Route path="/liked-profiles" element={<LikedProfiles />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/blocked-users" element={<BlockedUsers />} />
        <Route path="/account-preferences" element={<AccountPreferences />} />
        <Route path="/privacy-settings" element={<PrivacySettings />} />
        <Route path="/password-security" element={<PasswordSecurity />} />

        {/* Support & Problem Helpdesk */}
        <Route path="/support/contact" element={<ContactSupport />} />
        <Route path="/support/report" element={<ReportProblem />} />
        <Route path="/support/faq" element={<FAQPage />} />
        <Route path="/support/safety-tips" element={<SafetyTips />} />
        <Route path="/help-support" element={<HelpSupport />} />
        
        {/* ✅ FAQs for Footer */}
        <Route path="/faqs" element={<FAQPage />} />

        {/* Legal Policies */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        <Route path="/chat" element={<ChatPage />} />
        
        {/* 404 Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;