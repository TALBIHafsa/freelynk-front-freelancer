"use client";

import { useState } from "react";
import styles from "../LoginForm/signin.module.css";
import ResetPassword2 from "../ResetPassword2/ResetPassword2"; // Import the second step component

export default function ResetPassword({ onClose }) {
  const [formData, setFormData] = useState({
    email: "",
  });
  
  const [showNextStep, setShowNextStep] = useState(false); // State to control which modal to show
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password form submitted:", formData);
    setShowNextStep(true); // Show the next modal when form is submitted
  };

  // If showing next step, return that component instead
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

          <button type="submit" className={styles.signUpButton}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
}