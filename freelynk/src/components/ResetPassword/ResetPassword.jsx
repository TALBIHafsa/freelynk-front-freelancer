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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const checkEmailExists = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/email/${encodeURIComponent(email)}`);
      if (response.ok) {
        return true;
      } else if (response.status === 404) {
        return false;
      } else {
        throw new Error("Failed to check email");
      }
    } catch (err) {
      setError("An error occurred while checking your email. Please try again.");
      console.error("Error checking email:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailExists = await checkEmailExists(formData.email);
    
    if (emailExists) {
      setShowNextStep(true);
    } else {
      alert("This email is not registered. Please sign up first.");
    }
  };

  if (showNextStep) {
    return <ResetPassword2 email={formData.email} onClose={onClose} />;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.signUpModal} style={{height:"250px"}}>
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
                placeholder="Enter Email address"
                value={formData.email}
                onChange={handleChange}
                style={{marginBottom:"20px"}}
                required
            />
          </div>

          <button 
            type="submit" 
            className={styles.signUpButton}
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Next"}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
}