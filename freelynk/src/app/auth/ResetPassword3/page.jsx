"use client";

import { useState } from "react";
import styles from "./signup.module.css";
import Image from "next/image";

export default function ResetPassword3() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.modalOverlay} style={{ marginTop: "500px" }}>
            <div className={styles.signUpModal} style={{ height: "350px" }}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.title} style={{ marginBottom: "30px" }}>Reset Your Password</h1>
                    <button className={styles.closeButton} style={{ marginBottom: "30px" }} >✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel} style={{ fontWeight: "bold" }}>New Password

                        </label>
                        <div style={{ position: "relative", width: "100%" }}>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    className={styles.formInput}
    placeholder="Enter a new password"
    value={formData.password}
    onChange={handleChange}
    style={{ marginBottom: "20px", paddingRight: "40px" }}
  />
  <img 
    src={showPassword ? "/assets/view.png" : "/assets/hide.png"}
    alt="Toggle visibility"
    onClick={() => setShowPassword(prev => !prev)}
    style={{
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-100%)",
      height: "18px",
      width: "18px",
      cursor: "pointer"
    }}
  />
</div>



                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel} style={{ fontWeight: "bold" }}>Confirm New Password</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.formInput}
                            placeholder="Re-enter the new password"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ marginBottom: "20px" }}
                        />
                    </div>


                    <button type="submit" className={styles.signUpButton}>
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}