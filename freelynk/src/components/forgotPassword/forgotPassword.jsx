"use client";

import { useState } from "react";
import styles from "../LoginForm/signin.module.css";

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
    // Clear error when user starts typing
    if (error) setError(null);
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
      <div className={styles.modalOverlay} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div className={styles.signUpModal} style={{
          height: "auto",
          minHeight: "320px",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          animation: 'slideUp 0.4s ease-out',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <div className={styles.modalHeader} style={{
            borderBottom: 'none',
            paddingBottom: '0',
            marginBottom: '24px',
            position: 'relative'
          }}>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e2e8f0';
                e.target.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#64748b';
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{
            textAlign: "center", 
            padding: "0",
            animation: 'fadeInUp 0.5s ease-out 0.2s both'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'bounce 0.6s ease-out 0.4s both'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <h1 className={styles.title} style={{
              marginBottom: "16px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              lineHeight: "1.2"
            }}>
              Check Your Email
            </h1>
            
            <p style={{
              marginBottom: "16px", 
              color: "#64748b",
              fontSize: "16px",
              lineHeight: "1.5"
            }}>
              We've sent a password reset link to
            </p>
            
            <p style={{
              marginBottom: "20px",
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "600",
              background: "#f1f5f9",
              padding: "8px 16px",
              borderRadius: "8px",
              display: "inline-block"
            }}>
              {formData.email}
            </p>
            
            <p style={{
              marginBottom: "32px", 
              color: "#64748b", 
              fontSize: "14px",
              lineHeight: "1.5",
              maxWidth: "280px",
              margin: "0 auto 32px"
            }}>
              Please check your email and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            
            <button 
              className={styles.signUpButton}
              onClick={onClose}
              style={{
                marginTop: "0",
                padding: "12px 32px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'block',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0, -8px, 0);
            }
            70% {
              transform: translate3d(0, -4px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className={styles.signUpModal} style={{
        height: "auto",
        minHeight: "320px",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: 'slideUp 0.4s ease-out',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div className={styles.modalHeader} style={{
          borderBottom: 'none',
          paddingBottom: '0',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              color: '#64748b',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e2e8f0';
              e.target.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f1f5f9';
              e.target.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Lock Reset Icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <path d="M12 14v3"/>
            </svg>
          </div>
          
          <h1 className={styles.title} style={{
            marginBottom: "8px",
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b",
            lineHeight: "1.2"
          }}>
            Reset Your Password
          </h1>
          
          <p style={{
            color: "#64748b",
            fontSize: "15px",
            lineHeight: "1.5",
            margin: "0"
          }}>
            Enter your email address and we'll send you a reset link
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="email" 
              className={styles.formLabel} 
              style={{ 
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
                marginBottom: "8px",
                display: "block"
              }}
            >
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  marginBottom: "0",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: "16px",
                  transition: 'all 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                required
              />
              {/* Email Icon */}
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              marginBottom: "20px",
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: 'shake 0.5s ease-in-out'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p className={styles.errorMessage} style={{
                margin: "0",
                color: "#dc2626",
                fontSize: "14px"
              }}>
                {error}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className={styles.signUpButton}
            disabled={isLoading}
            style={{
              width: "100%",
              display: 'block',
              margin: '0 auto',
              padding: "14px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              transition: 'all 0.2s ease',
              transform: 'translateY(0)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {isLoading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}