"use client";

import { useState, useEffect } from "react";
import styles from "./signin.module.css";
import ResetPassword from "../forgotPassword/forgotPassword";
import { useRouter } from "next/navigation";

export default function LoginForm({ onClose }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error("Invalid JSON response");
            }

            if (!res.ok) {
                setError(data.message || "Wrong email or password");
                return;
            }

            // Store tokens, role, and email
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            // Fetch and store user ID based on role
            if (data.role === "FREELANCER") {
                await fetchFreelancerData(data.email);
                router.push("/Home_Freelancer");
            } else if (data.role === "CLIENT") {
                await fetchClientData(data.email);
                router.push("/home_client");
            } else {
                router.push("/");
            }

            console.log("Login successful!");
            if (onClose) onClose();

        } catch (err) {
            console.error("Network or parsing error:", err);
            setError(err.message || "Network error. Please try again.");
        }
    };

    const fetchFreelancerData = async (email) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/email/${email}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format. Expected JSON.');
            }
            const data = await response.json();
            localStorage.setItem("freelancerId", data.id);
        } catch (error) {
            console.error('Error fetching freelancer data:', error);
        }
    };

    const fetchClientData = async (email) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clients/email/${email}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format. Expected JSON.');
            }
            const data = await response.json();
            localStorage.setItem("clientId", data.id);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setShowResetPassword(true);
    };

    const handleResetPasswordClose = () => {
        setShowResetPassword(false);
    };

    // If showing reset password, return that component instead
    if (showResetPassword) {
        return <ResetPassword onClose={handleResetPasswordClose} />;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.signUpModal}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.title}>Sign In</h1>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <label htmlFor="email" className={styles.formLabel} style={{ fontWeight: "bold" }}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.formInput}
                            placeholder="Enter Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password" className={styles.formLabel} style={{ fontWeight: "bold" }}>
                                Password
                            </label>
                            <a href="#" style={{ fontSize: '12px', textDecoration: 'underline' }} onClick={handleForgotPassword}>
                                Forgot Password?
                            </a>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className={styles.formInput}
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={togglePasswordVisibility}
                            className={styles.checkbox}
                        />
                        <label htmlFor="showPassword" className={styles.checkboxLabel} style={{fontWeight:"bold"}}>Show password</label>
                    </div>

                    <button type="submit" className={styles.signUpButton}>
                        Sign In
                    </button>

                    <div className={styles.divider}>
                        <span className={styles.dividerLine}></span>
                        <span className={styles.dividerText}>or</span>
                        <span className={styles.dividerLine}></span>
                    </div>

                    <button type="button" className={styles.googleButton}>
                        <img src="assets/image.png" style={{ height: "18px", width: "18px" }} />
                        Continue with google
                    </button>
                </form>
            </div>
        </div>
    );
}