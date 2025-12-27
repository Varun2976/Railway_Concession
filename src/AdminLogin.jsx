import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Simple authentication - replace with your actual credentials
        if (
            credentials.username === "admin" &&
            credentials.password === "admin123"
        ) {
            // Store authentication state
            sessionStorage.setItem("adminAuthenticated", "true");
            navigate("/admin/dashboard");
        } else {
            setError("Invalid username or password");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div style={styles.container}>
            {/* Animated background elements */}
            <div style={styles.backgroundOrb1}></div>
            <div style={styles.backgroundOrb2}></div>
            <div style={styles.backgroundOrb3}></div>

            <div style={styles.contentWrapper}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <div style={styles.icon}>
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                    </div>
                    <h1 style={styles.title}>Admin Portal</h1>
                    <p style={styles.subtitle}>Railway Concession Management</p>
                </div>

                {/* Login Card */}
                <div style={styles.card}>
                    <div style={styles.cardGlow}></div>
                    <div style={styles.cardContent}>
                        <h2 style={styles.cardTitle}>Welcome Back</h2>
                        <p style={styles.cardSubtitle}>
                            Sign in to access the admin dashboard
                        </p>

                        {error && (
                            <div style={styles.errorMessage}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    style={{ flexShrink: 0 }}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username</label>
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            username: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your username"
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#a855f7";
                                        e.target.style.boxShadow =
                                            "0 0 0 3px rgba(168, 85, 247, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e9d5ff";
                                        e.target.style.boxShadow = "none";
                                    }}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your password"
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#a855f7";
                                        e.target.style.boxShadow =
                                            "0 0 0 3px rgba(168, 85, 247, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e9d5ff";
                                        e.target.style.boxShadow = "none";
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.button}
                                onMouseOver={(e) => {
                                    e.target.style.background =
                                        "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)";
                                    e.target.style.transform =
                                        "translateY(-2px)";
                                    e.target.style.boxShadow =
                                        "0 20px 40px -12px rgba(168, 85, 247, 0.5)";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background =
                                        "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow =
                                        "0 10px 25px -5px rgba(168, 85, 247, 0.3)";
                                }}
                            >
                                <span>Sign In</span>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </form>

                        <div style={styles.footer}>
                            <button
                                onClick={() => navigate("/")}
                                style={styles.backButton}
                                onMouseOver={(e) => {
                                    e.target.style.color = "#7c3aed";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.color = "#9333ea";
                                }}
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
    },
    backgroundOrb1: {
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "600px",
        height: "600px",
        background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 20s ease-in-out infinite",
    },
    backgroundOrb2: {
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "500px",
        height: "500px",
        background:
            "radial-gradient(circle, rgba(217, 70, 239, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 15s ease-in-out infinite reverse",
    },
    backgroundOrb3: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "400px",
        background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        animation: "pulse 10s ease-in-out infinite",
    },
    contentWrapper: {
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "440px",
    },
    header: {
        textAlign: "center",
        marginBottom: "2rem",
    },
    iconContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1rem",
    },
    icon: {
        width: "70px",
        height: "70px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow:
            "0 20px 40px -12px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        animation: "bounce 3s ease-in-out infinite",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "700",
        background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "0.5rem",
        letterSpacing: "-0.02em",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#9333ea",
        fontWeight: "500",
    },
    card: {
        position: "relative",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "28px",
        padding: "2.5rem",
        boxShadow:
            "0 25px 50px -12px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)",
        border: "1px solid rgba(233, 213, 255, 0.5)",
    },
    cardGlow: {
        position: "absolute",
        inset: "-2px",
        background: "linear-gradient(135deg, #a855f7, #d946ef, #8b5cf6)",
        borderRadius: "32px",
        opacity: 0.1,
        filter: "blur(20px)",
        zIndex: -1,
    },
    cardContent: {
        position: "relative",
    },
    cardTitle: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#581c87",
        marginBottom: "0.5rem",
        textAlign: "center",
    },
    cardSubtitle: {
        fontSize: "0.95rem",
        color: "#9333ea",
        marginBottom: "2rem",
        textAlign: "center",
    },
    errorMessage: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
        background: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "12px",
        color: "#dc2626",
        fontSize: "0.875rem",
        fontWeight: "500",
        marginBottom: "1.5rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    label: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#7c3aed",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    input: {
        width: "100%",
        padding: "1rem 1.25rem",
        fontSize: "1rem",
        background: "white",
        border: "2px solid #e9d5ff",
        borderRadius: "12px",
        outline: "none",
        transition: "all 0.3s ease",
        color: "#1f2937",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "1rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: "white",
        background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)",
        marginTop: "0.5rem",
        userSelect: "none",
    },
    footer: {
        marginTop: "2rem",
        textAlign: "center",
    },
    backButton: {
        background: "none",
        border: "none",
        color: "#9333ea",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        padding: "0.5rem",
    },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-30px); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 0.08; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.12; transform: translate(-50%, -50%) scale(1.1); }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(styleSheet);
