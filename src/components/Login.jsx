import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../apis/Api"; 
import "../styles/login.css";

import logo from "../assets/image.png";
import personIcon from "../assets/image copy.png";
import lockIcon from "../assets/image copy 2.png";
import heartIcon from "../assets/image copy 3.png";
import eyeCloseIcon from "../assets/image copy 4.png";
import eyeIconopen from "../assets/image copy 9.png";

import CreateAccountModal from "./CreateAccountModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import CreateProfileForModal from "./CreateProfileForModal";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(null);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginInput || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI({
        email: loginInput.toLowerCase().trim(),
        password: password,
    });

      console.log("LOGIN RESPONSE:", res.data); 

      // ✅ 1. Response il tokens undaano check cheyyu
      if (!res.data.access || !res.data.refresh) {
        throw new Error(res.data.detail || "Login failed. No tokens received");
      }

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role || "user");
      localStorage.setItem("email", res.data.email || loginInput);
      localStorage.setItem("profile_type", res.data.profile_type || "");
      localStorage.setItem("user_id", res.data.user_id || "");

      // ✅ 2. Role base aayi redirect
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message); 
      } else {
        setError("Server Error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-logo">
          <img src={logo} alt="Zinda Connect" />
        </div>
      </section>

      <section className="login-right">
        <div className="login-box">
          <div className="login-heart-circle">
            <img src={heartIcon} alt="heart" />
          </div>

          <h1 className="login-title">Login</h1>

          {error && <div className="login-error">{error}</div>}

          <form className="login-form" onSubmit={handleLogin} autoComplete="off">
            <div className="login-input">
              <img src={personIcon} alt="person" className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="login-input">
              <img src={lockIcon} alt="lock" className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? eyeIconopen : eyeCloseIcon} alt="toggle password" />
              </button>
            </div>

            <button
              type="button"
              className="forgot-link"
              onClick={() => setModal("forgot")}
            >
              Forgot Password?
            </button>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="create-text">
            New here?
            <button type="button" onClick={() => setModal("create")}>
              Create Account
            </button>
          </p>
        </div>
      </section>

      {modal === "create" && (
        <CreateAccountModal
          onClose={() => setModal(null)}
          onCreate={() => setModal("profile")}
        />
      )}

      {modal === "forgot" && (
        <ForgotPasswordModal onClose={() => setModal(null)} />
      )}

      {modal === "profile" && (
        <CreateProfileForModal onClose={() => setModal(null)} />
      )}
    </main>
  );
}