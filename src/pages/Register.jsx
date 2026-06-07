import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import registerUser from "../api/registerApi";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // REGISTER API CALL
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });


      // auto login after register
      login(res);
      navigate('/')

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    bg: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #fff9c4, #ffe082, #ffd54f)",
      fontFamily: "Arial",
    },
    card: {
      width: "360px",
      padding: "30px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(15px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      border: "1px solid #ffe082",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#f57f17",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #ffe082",
      outline: "none",
      background: "#fffde7",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "#fbc02d",
      color: "#5d4037",
      fontWeight: "bold",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginBottom: "10px",
      textAlign: "center",
    },
    linkText: {
      marginTop: "15px",
      fontSize: "13px",
      textAlign: "center",
    },
    link: {
      color: "#f57f17",
      fontWeight: "bold",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            name="username"
            autoComplete='current-username'
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            autoComplete='current-email'
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            autoComplete='current-password'
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={styles.linkText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;