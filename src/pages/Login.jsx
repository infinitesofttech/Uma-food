import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/loginApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setInfoMessage("");

  try {

    const res = await loginUser({
      username: formData.username.trim(),
      password: formData.password,
    });


    // save auth context and get user data
    const userData = await login();

    // debug cookies
    // try {
    //   console.log("🧾 document.cookie after login:", document.cookie);
    // } catch (e) {
    //   console.warn("Could not read document.cookie", e);
    // }

    // console.log("✅ Login context updated! User:", userData);
    setInfoMessage("Login successful");

    if (userData?.is_admin) {
      console.log("🛡️ Admin → /admin");
      navigate("/admin");
    } else {
      console.log("👤 User → /");
      navigate("/");
    }

  } catch (err) {
    // console.error("❌ Login Error:", err);

    setInfoMessage(
      err?.response?.data?.message ||
      err?.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login with username and password</p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="username"
            autoComplete='current-username'
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            autoComplete='current-password'
            onChange={handleChange}
            disabled={loading}
            required
          />

          {infoMessage && (
            <p
              style={{
                ...styles.message,
                color: infoMessage === "Login successful" ? "green" : "red",
              }}
            >
              {infoMessage}
            </p>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.linkText}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;


const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff384, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#2f2e2e",
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "13px",
    opacity: 0.8,
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#f19603",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },

  linkText: {
    marginTop: "15px",
    fontSize: "13px",
    textAlign: "center",
  },

  link: {
    color: "#282727",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },

  message: {
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
    fontWeight: "500",
  },
};
