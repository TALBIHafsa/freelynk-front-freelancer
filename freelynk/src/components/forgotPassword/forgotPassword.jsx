"use client";

import { useState } from "react";
import styles from "../LoginForm/signin.module.css";
import ResetPassword2 from "../ResetPassword2/ResetPassword2";

export default function ResetPassword({ onClose }) {
  const [formData, setFormData] = useState({
    email: "",
  });
  
  const [showNextStep, setShowNextStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });

      const message = await response.text();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while sending the reset email. Please try again.");
      console.error("Error sending reset email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.signUpModal} style={{height:"280px"}}>
          <div className={styles.modalHeader}>
            <h1 className={styles.title} style={{marginBottom:"20px"}}>Check Your Email</h1>
            <button className={styles.closeButton} style={{marginBottom:"20px"}} onClick={onClose}>✕</button>
          </div>
          
          <div style={{textAlign: "center", padding: "20px"}}>
            <p style={{marginBottom: "20px", color: "#666"}}>
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
            <p style={{marginBottom: "20px", color: "#666", fontSize: "14px"}}>
              Please check your email and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            <button 
              className={styles.signUpButton}
              onClick={onClose}
              style={{marginTop: "10px"}}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.signUpModal} style={{height:"280px"}}>
        <div className={styles.modalHeader}>
          <h1 className={styles.title} style={{marginBottom:"30px"}}>Reset Your Password</h1>
          <button className={styles.closeButton} style={{marginBottom:"30px"}} onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel} style={{ fontWeight: "bold" }}>Email address</label>
            <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                style={{marginBottom:"20px"}}
                required
            />
          </div>

          {error && <p className={styles.errorMessage} style={{marginBottom: "15px"}}>{error}</p>}

          <button 
            type="submit" 
            className={styles.signUpButton}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}