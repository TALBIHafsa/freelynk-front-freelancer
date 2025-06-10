"use client";

import { useState } from "react";
import styles from "../LoginForm/signin.module.css";

export default function ResetPassword2({ email, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.signUpModal} style={{height:"230px", width: "500px"}}>
        <div className={styles.modalHeader}>
          <h1 className={styles.title} style={{marginBottom:"30px"}}>Reset Your Password</h1>
          <button className={styles.closeButton} style={{marginBottom:"30px"}} onClick={onClose}>✕</button>
        </div>
        
        <div style={{textAlign:"center", margin: "0 auto", padding: "0 20px"}}>
            <p>An email has been sent to "{email}". If this email address is registered to FreeLynk.ma, you'll receive instructions on how to set a new password.</p>
            <p style={{marginTop:"20px", color:"#2d3a8c", cursor: "pointer"}}>
              <u>Didn't get an email?</u>
            </p>
        </div>
      </div>
    </div>
  );
}