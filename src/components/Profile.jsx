import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../utils/format";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${BASE_URL}/api/user/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setError("");
      } else {
        setError(data.error || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #fff9c4, #ffe082, #ffd54f)",
      fontFamily: "Arial",
    },

    card: {
      width: "380px",
      padding: "30px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(15px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
      textAlign: "center",
      color: "#5d4037",
      border: "1px solid #ffe082",
    },

    avatar: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #fbc02d, #f57f17)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "bold",
      margin: "0 auto 15px auto",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    },

    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#f57f17",
    },

    subtitle: {
      fontSize: "13px",
      marginBottom: "20px",
      color: "#795548",
    },

    infoBox: {
      background: "#fffde7",
      padding: "14px 16px",
      borderRadius: "12px",
      margin: "10px 0",
      border: "1px solid #ffe082",
      textAlign: "left",
    },
    label: {
      fontSize: "13px",
      color: "#8d6e63",
      marginBottom: "4px",
    },

    value: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#4e342e",
      wordBreak: "break-word",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {user ? (
          <>
            {/* Avatar */}
            <div style={styles.avatar}>
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div style={styles.title}>{user.username}</div>
            <div style={styles.subtitle}>Welcome back</div>

            {/* Email */}
            <div style={styles.infoBox}>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{user.email}</div>
            </div>

            {/* Username */}
            <div style={styles.infoBox}>
              <div style={styles.label}>Username</div>
              <div style={styles.value}>{user.username}</div>
            </div>

            {/* Logout */}
            {/* <button
              style={styles.button}
              onClick={logout}
            >
              Logout
            </button> */}
          </>
        ) : (
          <p style={{ color: "white" }}>{error || "Loading profile..."}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
