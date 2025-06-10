"use client";

import { useState } from "react";
import styles from "./signup.module.css";
import Image from "next/image";

export default function SignUpForm({ onClose, userType }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: userType
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
    <div className={styles.modalOverlay}>
      <div className={styles.signUpModal}>
        <div className={styles.modalHeader}>
          <h1 className={styles.title}>Sign Up as {userType}</h1>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <input
                type="text"
                id="firstName"
                className={styles.formInput}
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <input
                type="text"
                id="lastName"
                className={styles.formInput}
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email address</label>
            <input
              type="email"
              id="email"
              className={styles.formInput}
              placeholder="Enter Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles.formInput}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className={styles.formInput}
                placeholder="Repeat Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={togglePasswordVisibility}
              className={styles.checkbox}
            />
            <label htmlFor="showPassword" className={styles.checkboxLabel}>Show password</label>
          </div>
          
          <button type="submit" className={styles.signUpButton}>
            Sign Up
          </button>
          
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine}></span>
          </div>
          
          <button type="button" className={styles.googleButton}>
          <img src="assets/image.png" style={{ height: "18px", width: "18px" }} />
            Continue with Google
          </button>
          
          <p className={styles.termsText}>
            By Signing Up you accept our <a href="#" className={styles.termsLink}>Privacy Policy and Terms of Services</a>
          </p>
        </form>
      </div>
    </div>
  );
}