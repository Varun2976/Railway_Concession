import { useState } from "react";

function App() {
    const [currentPage, setCurrentPage] = useState("login");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        year: "",
        degree: "",
        class: "",
        gender: "",
        source: "",
        destination: "",
        plan: "",
        amount: 0,
    });

    const [idData, setIdData] = useState({
        phone: "",
        aadhar: "",
        driveLink: "",
    });

    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycby7pI3sOU_AfT2KBjavs-3sWez5XHnRT0u8kdLjXVuSaVPpPAwxYBQhZ7LLvdtRJWxR4g/exec";

    const submitToGoogleSheets = async () => {
        if (!idData.phone || !idData.aadhar || !idData.driveLink) {
            alert("Please fill in all fields and provide the Drive link");
            return;
        }

        if (!idData.driveLink.includes("drive.google.com")) {
            alert("Please enter a valid Google Drive link");
            return;
        }

        // Validate phone number (10 digits and numeric only)
        if (idData.phone.length !== 10) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }
        if (!/^\d+$/.test(idData.phone)) {
            alert("Phone number must contain only numeric digits (0-9)");
            return;
        }

        // Validate Aadhar number (12 digits and numeric only)
        if (idData.aadhar.length !== 12) {
            alert("Please enter a valid 12-digit Aadhar number");
            return;
        }
        if (!/^\d+$/.test(idData.aadhar)) {
            alert("Aadhar number must contain only numeric digits (0-9)");
            return;
        }

        setIsSubmitting(true);
        try {
            // FIX: Calculate amount one final time and ensure it's a number
            const calculatedAmount = calculateAmount(
                formData.source,
                formData.plan
            );

            const dataToSend = {
                email: email,
                name: formData.name,
                degree: formData.degree,
                year: formData.year,
                class: formData.class,
                gender: formData.gender,
                source: formData.source,
                destination: formData.destination,
                plan: formData.plan,
                phone: idData.phone,
                aadhar: idData.aadhar,
                driveLink: idData.driveLink,
                amount: Number(calculatedAmount),
            };

            console.log("Data being sent:", dataToSend); // Debug log

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            alert("Form submitted successfully!");

            setEmail("");
            setFormData({
                name: "",
                year: "",
                degree: "",
                class: "",
                gender: "",
                source: "",
                destination: "",
                plan: "",
                amount: 0,
            });
            setIdData({
                phone: "",
                aadhar: "",
                driveLink: "",
            });

            setCurrentPage("login");
        } catch (error) {
            console.error("Detailed error:", error);
            alert(`Error submitting form: ${error.message}. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = () => {
        if (!email) {
            setEmailError("Email is required");
            return;
        }
        if (!email.endsWith("@somaiya.edu")) {
            setEmailError("Email must be a @somaiya.edu address");
            return;
        }
        setEmailError("");
        setCurrentPage("registration");
    };

    const handleRegistrationNext = () => {
        if (
            !formData.name ||
            !formData.degree ||
            !formData.year ||
            !formData.class ||
            !formData.gender ||
            !formData.source ||
            !formData.destination ||
            !formData.plan
        ) {
            alert("Please fill in all fields before proceeding");
            return;
        }
        setCurrentPage("idcard");
    };

    // FIX: Ensure calculateAmount always returns a number
    const calculateAmount = (source, plan) => {
        if (!source || !plan) return 0;

        const tier1Stations = [
            "Goregaon",
            "Borivali",
            "Malad",
            "Thane",
            "Ghansoli",
            "Ghatkopar",
        ];
        const tier2Stations = ["Airoli", "Kharghar", "Mumra", "Matunga"];

        let monthlyPrice = 0;
        if (tier1Stations.includes(source)) {
            monthlyPrice = 463;
        } else if (tier2Stations.includes(source)) {
            monthlyPrice = 612;
        }

        let amount = 0;
        if (plan === "monthly") {
            amount = monthlyPrice;
        } else if (plan === "quarterly") {
            amount = monthlyPrice * 3;
        }

        return Number(amount);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updated = {
                ...prevData,
                [name]: value,
                ...(name === "degree" && { year: "" }),
                ...(name === "source" && { destination: "" }),
            };

            if (name === "source" || name === "plan") {
                updated.amount = calculateAmount(updated.source, updated.plan);
            }

            return updated;
        });
    };

    const handleIdChange = (e) => {
        setIdData({
            ...idData,
            [e.target.name]: e.target.value,
        });
    };

    const styles = {
        loginContainer: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
                "linear-gradient(to bottom right, #f9fafb, #e5e7eb, white)",
            position: "relative",
            overflow: "hidden",
        },
        loginBackground: {
            position: "absolute",
            inset: 0,
            background:
                "linear-gradient(to bottom right, rgba(219, 234, 254, 0.3), transparent, rgba(243, 232, 255, 0.3))",
        },
        loginTitle: {
            fontSize: "5rem",
            fontWeight: "200",
            color: "#111827",
            textAlign: "center",
            marginTop: "-3rem",
            marginBottom: "1rem",
            whiteSpace: "nowrap",
            letterSpacing: "0.025em",
            position: "relative",
            zIndex: 10,
        },
        loginTitleGradient: {
            background: "linear-gradient(to right, #2563eb, #111827, #2563eb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
        },
        loginCard: {
            width: "100%",
            maxWidth: "48rem",
            padding: "1rem",
            position: "relative",
            zIndex: 10,
        },
        loginCardInner: {
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(40px)",
            borderRadius: "24px",
            padding: "2rem",
            border: "1px solid rgba(229, 231, 235, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        loginHeading: {
            fontSize: "3rem",
            fontWeight: "300",
            color: "#111827",
            textAlign: "center",
            marginTop: "-1rem",
            marginBottom: "1rem",
            letterSpacing: "0.025em",
        },
        loginLabel: {
            display: "block",
            fontSize: "1.4rem",
            fontWeight: "500",
            color: "#374151",
            marginTop: "2rem",
            marginLeft: "0.5rem",
            marginBottom: "1rem",
        },
        loginInput: {
            width: "100%",
            padding: "1.25rem 1.5rem",
            fontSize: "1.25rem",
            background: "rgba(249, 250, 251, 0.3)",
            border: "1px solid rgba(209, 213, 219, 0.3)",
            borderRadius: "16px",
            outline: "none",
            transition: "all 0.3s",
            color: "#111827",
            boxSizing: "border-box",
        },
        loginButton: {
            width: "100%",
            background: "#2563eb",
            color: "white",
            fontWeight: "500",
            padding: "0.9rem 1.5rem",
            fontSize: "1.25rem",
            borderRadius: "16px",
            transition: "all 0.3s",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
        },
        regContainer: {
            minHeight: "100vh",
            background:
                "linear-gradient(to bottom right, #f8fafc, rgba(224, 242, 254, 0.3), white)",
        },
        regInner: {
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0rem 2rem 4rem",
        },
        regHeader: {
            textAlign: "center",
            marginBottom: "2rem",
        },
        regTitle: {
            fontSize: "3.75rem",
            fontWeight: "300",
            color: "#0f172a",
            marginTop: "0rem",
            marginBottom: "1rem",
            letterSpacing: "-0.025em",
        },
        regSubtitle: {
            fontSize: "1.25rem",
            color: "#64748b",
            fontWeight: "300",
            marginTop: "0rem",
        },
        regCard: {
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(40px)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(226, 232, 240, 0.5)",
            padding: "3rem",
            marginTop: "-0.5rem",
        },
        sectionTitle: {
            fontSize: "1.5rem",
            fontWeight: "500",
            color: "#1e293b",
            marginBottom: "1.5rem",
            marginTop: "-0.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #e2e8f0",
        },
        label: {
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#475569",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        },
        input: {
            width: "100%",
            padding: "1rem 1.25rem",
            fontSize: "1rem",
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            outline: "none",
            transition: "all 0.2s",
            color: "#0f172a",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            boxSizing: "border-box",
        },
        button: {
            width: "100%",
            background: "linear-gradient(to right, #2563eb, #1e40af)",
            color: "white",
            fontWeight: "600",
            padding: "1.25rem",
            fontSize: "1.125rem",
            borderRadius: "12px",
            transition: "all 0.3s",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            border: "none",
            cursor: "pointer",
        },
        buttonSecondary: {
            width: "100%",
            background: "#f1f5f9",
            color: "#475569",
            fontWeight: "600",
            padding: "1.25rem",
            fontSize: "1.125rem",
            borderRadius: "12px",
            transition: "all 0.2s",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            border: "none",
            cursor: "pointer",
        },
        amountDisplay: {
            width: "100%",
            padding: "1rem 1.25rem",
            fontSize: "1rem",
            background: "#dbeafe",
            border: "2px solid #bfdbfe",
            borderRadius: "12px",
            color: "#0f172a",
            fontWeight: "600",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            boxSizing: "border-box",
        },
        amountText: {
            fontSize: "1.5rem",
            color: "#1e40af",
        },
        idContainer: {
            minHeight: "100vh",
            background:
                "linear-gradient(to bottom right, #f8fafc, rgba(224, 242, 254, 0.3), white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
        },
        idInner: {
            maxWidth: "64rem",
            width: "100%",
        },
        idTitle: {
            fontSize: "3rem",
            fontWeight: "300",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "3rem",
        },
        idCard: {
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(40px)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(226, 232, 240, 0.5)",
            padding: "2.5rem",
        },
        fileUploadLabel: {
            display: "block",
            width: "100%",
            padding: "1rem",
            border: "2px dashed #cbd5e1",
            borderRadius: "12px",
            fontSize: "1rem",
            background: "#f8fafc",
            transition: "all 0.2s",
            cursor: "pointer",
            textAlign: "center",
            color: "#64748b",
            fontWeight: "500",
            boxSizing: "border-box",
        },
        pdfPreviewContainer: {
            marginTop: "1.5rem",
            padding: "1.5rem",
            background: "#f8fafc",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
        },
        pdfPreview: {
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
        },
        note: {
            fontSize: "0.75rem",
            color: "#64748b",
            marginTop: "0.75rem",
            textAlign: "center",
        },

        // CHATBOT UI
        chatbotWindow: {
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            width: "360px",
            height: "500px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            overflow: "hidden",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
        },

        chatbotHeader: {
            height: "48px",
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
            fontWeight: "600",
            flexShrink: 0,
        },

        chatbotTitle: {
            fontSize: "1rem",
        },

        chatbotClose: {
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
        },
        adminButton: {
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "rgba(37, 99, 235, 0.9)",
            backdropFilter: "blur(20px)",
            color: "white",
            fontWeight: "600",
            padding: "0.875rem 1.75rem",
            fontSize: "0.875rem",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            boxShadow:
                "0 20px 40px -12px rgba(37, 99, 235, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1000,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
        },
    };

    if (currentPage === "login") {
        return (
            <>
                <div style={styles.loginContainer}>
                    <div style={styles.loginBackground}></div>
                    <button
                        onClick={() => (window.location.href = "/admin.html")}
                        style={styles.adminButton}
                        onMouseOver={(e) => {
                            e.target.style.background = "#1d4ed8";
                            e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = "#2563eb";
                            e.target.style.transform = "scale(1)";
                        }}
                    >
                        Admin Panel
                    </button>
                    <h2 style={styles.loginTitle}>
                        <span style={styles.loginTitleGradient}>
                            Railway Concession
                        </span>
                    </h2>
                    <div style={styles.loginCard}>
                        <div style={styles.loginCardInner}>
                            <h1 style={styles.loginHeading}>Sign In</h1>
                            <hr />
                            <div style={{ marginBottom: "2.5rem" }}>
                                <label style={styles.loginLabel}>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleLogin();
                                        }
                                    }}
                                    placeholder="Example: joe.adam@somaiya.edu"
                                    style={styles.loginInput}
                                    onFocus={(e) => {
                                        e.target.style.outline =
                                            "2px solid #2563eb";
                                        e.target.style.outlineOffset = "2px";
                                        e.target.style.borderColor =
                                            "transparent";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.borderColor =
                                            "rgba(209, 213, 219, 0.3)";
                                    }}
                                />
                                {emailError && (
                                    <p
                                        style={{
                                            color: "#ef4444",
                                            fontSize: "0.875rem",
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        {emailError}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleLogin}
                                style={styles.loginButton}
                                onMouseOver={(e) => {
                                    e.target.style.background = "#1d4ed8";
                                    e.target.style.boxShadow =
                                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = "#2563eb";
                                    e.target.style.boxShadow =
                                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
                {/* Chatbot Window */}
            </>
        );
    }

    if (currentPage === "registration") {
        return (
            <div style={styles.regContainer}>
                <div style={styles.regInner}>
                    <div style={styles.regHeader}>
                        <h1 style={styles.regTitle}>Railway Concession</h1>
                        <p style={styles.regSubtitle}>
                            Student Registration Form
                        </p>
                    </div>
                    <div style={styles.regCard}>
                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={styles.sectionTitle}>
                                Personal Information
                            </h2>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={styles.label}>Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter your full name"
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.outline =
                                            "2px solid #2563eb";
                                        e.target.style.outlineOffset = "2px";
                                        e.target.style.borderColor = "#2563eb";
                                        e.target.style.background = "white";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.borderColor = "#cbd5e1";
                                        e.target.style.background = "#f8fafc";
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: "1.5rem",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <div>
                                    <label style={styles.label}>Degree</label>
                                    <select
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleFormChange}
                                        style={styles.input}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    >
                                        <option value="">Select degree</option>
                                        <option value="btech">B.Tech</option>
                                        <option value="mtech">M.Tech</option>
                                        <option value="mba">MBA</option>
                                        <option value="bcom">B.Com</option>
                                        <option value="mcom">M.Com</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={styles.label}>Year</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleFormChange}
                                        style={styles.input}
                                        disabled={!formData.degree}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    >
                                        <option value="">Select Year</option>
                                        {formData.degree === "btech" && (
                                            <>
                                                <option value="1st">
                                                    1st Year
                                                </option>
                                                <option value="2nd">
                                                    2nd Year
                                                </option>
                                                <option value="3rd">
                                                    3rd Year
                                                </option>
                                                <option value="4th">
                                                    4th Year
                                                </option>
                                            </>
                                        )}
                                        {(formData.degree === "mtech" ||
                                            formData.degree === "mba" ||
                                            formData.degree === "mcom") && (
                                            <>
                                                <option value="1st">
                                                    1st Year
                                                </option>
                                                <option value="2nd">
                                                    2nd Year
                                                </option>
                                            </>
                                        )}
                                        {formData.degree === "bcom" && (
                                            <>
                                                <option value="1st">
                                                    1st Year
                                                </option>
                                                <option value="2nd">
                                                    2nd Year
                                                </option>
                                                <option value="3rd">
                                                    3rd Year
                                                </option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label style={styles.label}>Class</label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleFormChange}
                                        style={styles.input}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    >
                                        <option value="">Select class</option>
                                        <option value="first">First</option>
                                        <option value="second">Second</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={styles.label}>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleFormChange}
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.outline =
                                            "2px solid #2563eb";
                                        e.target.style.outlineOffset = "2px";
                                        e.target.style.borderColor = "#2563eb";
                                        e.target.style.background = "white";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.borderColor = "#cbd5e1";
                                        e.target.style.background = "#f8fafc";
                                    }}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={styles.sectionTitle}>
                                Travel Information
                            </h2>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "1.5rem",
                                }}
                            >
                                <div>
                                    <label style={styles.label}>
                                        Source Station
                                    </label>
                                    <select
                                        name="source"
                                        value={formData.source}
                                        onChange={handleFormChange}
                                        style={styles.input}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    >
                                        <option value="">
                                            Select source station
                                        </option>
                                        <option value="Goregaon">
                                            Goregaon
                                        </option>
                                        <option value="Borivali">
                                            Borivali
                                        </option>
                                        <option value="Malad">Malad</option>
                                        <option value="Thane">Thane</option>
                                        <option value="Ghansoli">
                                            Ghansoli
                                        </option>
                                        <option value="Ghatkopar">
                                            Ghatkopar
                                        </option>
                                        <option value="Airoli">Airoli</option>
                                        <option value="Kharghar">
                                            Kharghar
                                        </option>
                                        <option value="Mumra">Mumra</option>
                                        <option value="Matunga">Matunga</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={styles.label}>
                                        Destination Station
                                    </label>
                                    <select
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleFormChange}
                                        style={styles.input}
                                        disabled={!formData.source}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    >
                                        <option value="">
                                            Select destination station
                                        </option>
                                        <option value="VidyaVihar">
                                            VidyaVihar
                                        </option>
                                        <option value="TilakNagar">
                                            Tilak Nagar
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={styles.sectionTitle}>
                                Subscription Details
                            </h2>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={styles.label}>
                                    Subscription Plan
                                </label>
                                <select
                                    name="plan"
                                    value={formData.plan}
                                    onChange={handleFormChange}
                                    style={styles.input}
                                    onFocus={(e) => {
                                        e.target.style.outline =
                                            "2px solid #2563eb";
                                        e.target.style.outlineOffset = "2px";
                                        e.target.style.borderColor = "#2563eb";
                                        e.target.style.background = "white";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.borderColor = "#cbd5e1";
                                        e.target.style.background = "#f8fafc";
                                    }}
                                >
                                    <option value="">
                                        Select Subscription Plan
                                    </option>
                                    <option value="monthly">
                                        Monthly (1 Month)
                                    </option>
                                    <option value="quarterly">
                                        Quarterly (3 Months)
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label style={styles.label}>Total Amount</label>
                                <div style={styles.amountDisplay}>
                                    <span style={styles.amountText}>
                                        ₹ {formData.amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ paddingTop: "1.5rem" }}>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button
                                    onClick={handleRegistrationNext}
                                    style={styles.button}
                                    onMouseOver={(e) => {
                                        e.target.style.background =
                                            "linear-gradient(to right, #1e40af, #1e3a8a)";
                                        e.target.style.boxShadow =
                                            "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                                        e.target.style.transform =
                                            "scale(1.02)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background =
                                            "linear-gradient(to right, #2563eb, #1e40af)";
                                        e.target.style.boxShadow =
                                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                                        e.target.style.transform = "scale(1)";
                                    }}
                                >
                                    Submit Application
                                </button>
                                <button
                                    onClick={() => setCurrentPage("login")}
                                    style={styles.buttonSecondary}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#e2e8f0";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "#f1f5f9";
                                    }}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: "0.875rem",
                            color: "#64748b",
                            marginTop: "2rem",
                        }}
                    >
                        Please ensure all information is accurate before
                        submission
                    </p>
                </div>
            </div>
        );
    }

    if (currentPage === "idcard") {
        return (
            <div style={styles.idContainer}>
                <div style={styles.idInner}>
                    <h1 style={styles.idTitle}>ID Card Verification</h1>
                    <div style={styles.idCard}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "2.5rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    gap: "2rem",
                                }}
                            >
                                <div>
                                    <label style={styles.label}>
                                        Phone Number
                                    </label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={idData.phone}
                                        onChange={handleIdChange}
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength="10"
                                        style={styles.input}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>
                                        Aadhar Number
                                    </label>
                                    <input
                                        name="aadhar"
                                        type="text"
                                        value={idData.aadhar}
                                        onChange={handleIdChange}
                                        placeholder="Enter 12-digit Aadhar number"
                                        maxLength="12"
                                        style={styles.input}
                                        onFocus={(e) => {
                                            e.target.style.outline =
                                                "2px solid #2563eb";
                                            e.target.style.outlineOffset =
                                                "2px";
                                            e.target.style.borderColor =
                                                "#2563eb";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.outline = "none";
                                            e.target.style.borderColor =
                                                "#cbd5e1";
                                            e.target.style.background =
                                                "#f8fafc";
                                        }}
                                    />
                                </div>
                                <p style={styles.note}>
                                    Your information is secure and will be used
                                    only for verification purposes
                                </p>
                            </div>
                            <div>
                                <label style={styles.label}>
                                    Google Drive Link
                                </label>
                                <input
                                    type="url"
                                    name="driveLink"
                                    value={idData.driveLink}
                                    onChange={handleIdChange}
                                    placeholder="https://drive.google.com/file/d/..."
                                    style={styles.input}
                                />
                                <p style={styles.note}>
                                    Make sure the link access is set to{" "}
                                    <b>Anyone with the link → Viewer</b>
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: "2.5rem" }}>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button
                                    onClick={submitToGoogleSheets}
                                    style={styles.button}
                                    disabled={isSubmitting}
                                    onMouseOver={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.background =
                                                "linear-gradient(to right, #1e40af, #1e3a8a)";
                                            e.target.style.boxShadow =
                                                "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                                            e.target.style.transform =
                                                "scale(1.02)";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background =
                                            "linear-gradient(to right, #2563eb, #1e40af)";
                                        e.target.style.boxShadow =
                                            "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                                        e.target.style.transform = "scale(1)";
                                    }}
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Verify & Continue"}
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage("registration")
                                    }
                                    style={styles.buttonSecondary}
                                    disabled={isSubmitting}
                                    onMouseOver={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.background =
                                                "#e2e8f0";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "#f1f5f9";
                                    }}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

export default App;
