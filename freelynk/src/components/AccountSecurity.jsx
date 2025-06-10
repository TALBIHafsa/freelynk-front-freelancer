"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function AccountSecurity({ onValidationChange, onDataChange, initialData }) {
  const initialValidationRun = useRef(false);
  const prevValidationRef = useRef();
  const prevDataRef = useRef();
  
  const initialDataMemo = useMemo(() => ({
    email: initialData?.email || '',
    password: initialData?.password || '',
    confirmPassword: initialData?.confirmPassword || '',
    phone: initialData?.phone || ''
  }), [initialData?.email, initialData?.password, initialData?.confirmPassword, initialData?.phone]);

  const [email, setEmail] = useState(initialDataMemo.email);
  const [password, setPassword] = useState(initialDataMemo.password);
  const [confirmPassword, setConfirmPassword] = useState(initialDataMemo.confirmPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(initialDataMemo.phone);
  const [isPhoneAdded, setIsPhoneAdded] = useState(!!initialDataMemo.phone);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredPhone, setHoveredPhone] = useState(false);

  const [validation, setValidation] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });

  const currentData = useMemo(() => ({
    email,
    password,
    confirmPassword,
    phone: phoneNumber
  }), [email, password, confirmPassword, phoneNumber]);

  const validateField = useCallback((field, value) => {
    let isValid = false;
    
    switch(field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = value.trim() !== '' && emailRegex.test(value);
        break;
      case 'password':
        isValid = value.length >= 8;
        break;
      case 'confirmPassword':
        isValid = value !== '' && value === password;
        break;
      default:
        isValid = false;
    }

    setValidation(prev => {
      if (prev[field] !== isValid) {
        return { ...prev, [field]: isValid };
      }
      return prev;
    });
  }, [password]);

  useEffect(() => {
    if (onDataChange && prevDataRef.current) {
      const hasChanged = JSON.stringify(currentData) !== JSON.stringify(prevDataRef.current);
      if (hasChanged) {
        onDataChange(currentData);
      }
    }
    prevDataRef.current = currentData;
  }, [currentData, onDataChange]);

  useEffect(() => {
    const isFormValid = validation.email && validation.password && validation.confirmPassword;
    
    if (onValidationChange && prevValidationRef.current !== isFormValid) {
      onValidationChange(isFormValid);
    }
    prevValidationRef.current = isFormValid;
  }, [validation, onValidationChange]);

  useEffect(() => {
    if (!initialValidationRun.current) {
      validateField('email', email);
      validateField('password', password);
      validateField('confirmPassword', confirmPassword);
      initialValidationRun.current = true;
    }
  }, [validateField, email, password, confirmPassword]);

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  }, [validateField]);

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
    // Re-validate confirm password when password changes
    if (confirmPassword) {
      validateField('confirmPassword', confirmPassword);
    }
  }, [validateField, confirmPassword]);

  const handleConfirmPasswordChange = useCallback((e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateField('confirmPassword', value);
  }, [validateField]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const handleAddPhoneNumber = useCallback(() => {
    setIsPhoneAdded(true);
  }, []);

  const handlePhoneNumberChange = useCallback((e) => {
    setPhoneNumber(e.target.value);
  }, []);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(47, 60, 126, 0.08)',
      border: '1px solid rgba(47, 60, 126, 0.1)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      position: 'relative',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      color: '#2f3c7e',
      background: 'linear-gradient(135deg, #2f3c7e 0%, #4a5ba3 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      color: '#666',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    mandatory: {
      fontSize: '0.9rem',
      color: '#777',
      fontStyle: 'italic',
    },
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#f0f0f0',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '1rem',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2f3c7e',
      borderRadius: '2px',
      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    formField: {
      marginBottom: '2.5rem',
      position: 'relative',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2f3c7e',
      fontSize: '1rem',
      gap: '0.5rem',
    },
    labelIcon: {
      color: '#2f3c7e',
      display: 'flex',
      alignItems: 'center',
    },
    requiredField: {
      color: '#e74c3c',
      marginLeft: '0.25rem',
    },
    privateTag: {
      backgroundColor: '#f39c12',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginLeft: '0.5rem',
    },
    fieldHelper: {
      fontSize: '0.9rem',
      color: '#777',
      marginBottom: '1rem',
      lineHeight: '1.5',
    },
    inputGroup: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e1e5e9',
      backgroundColor: '#ffffff',
      color: '#333',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    inputFocused: {
      borderColor: '#2f3c7e',
      boxShadow: '0 4px 16px rgba(47, 60, 126, 0.15)',
      transform: 'translateY(-1px)',
    },
    inputError: {
      borderColor: '#e74c3c',
      boxShadow: '0 4px 16px rgba(231, 76, 60, 0.15)',
    },
    inputValid: {
      borderColor: '#27ae60',
      boxShadow: '0 4px 16px rgba(39, 174, 96, 0.15)',
    },
    passwordContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
    },
    passwordInputWrapper: {
      position: 'relative',
    },
    togglePasswordButton: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(47, 60, 126, 0.1)',
      border: 'none',
      cursor: 'pointer',
      color: '#2f3c7e',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    togglePasswordButtonHover: {
      backgroundColor: 'rgba(47, 60, 126, 0.2)',
      transform: 'translateY(-50%) scale(1.1)',
    },
    addPhoneButton: {
      background: 'linear-gradient(135deg, #2f3c7e 0%, #4a5ba3 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 16px rgba(47, 60, 126, 0.3)',
    },
    addPhoneButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(47, 60, 126, 0.4)',
    },
    errorText: {
      color: '#e74c3c',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    validIcon: {
      color: '#27ae60',
      fontSize: '1.2rem',
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    phoneSection: {
      backgroundColor: '#f8f9ff',
      padding: '2rem',
      borderRadius: '16px',
      border: '1px solid rgba(47, 60, 126, 0.1)',
    },
    securityFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      backgroundColor: 'rgba(39, 174, 96, 0.1)',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      border: '1px solid rgba(39, 174, 96, 0.2)',
    },
    securityIcon: {
      color: '#27ae60',
      backgroundColor: 'white',
      padding: '0.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    securityText: {
      color: '#27ae60',
      fontWeight: '500',
      fontSize: '0.95rem',
    },
  };

  const getFieldStyle = (fieldName, value) => {
    const baseStyle = { ...styles.input };
    
    if (focusedField === fieldName) {
      Object.assign(baseStyle, styles.inputFocused);
    } else if (validation[fieldName] && value) {
      Object.assign(baseStyle, styles.inputValid);
    } else if (!validation[fieldName] && value) {
      Object.assign(baseStyle, styles.inputError);
    }
    
    return baseStyle;
  };

  const progress = (Object.values(validation).filter(v => v).length / 3) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Account Security</h2>
        <p style={styles.subtitle}>
          Trust and safety is a big deal in our community. Please verify your email and create a secure password
          to keep your account protected.
        </p>
        <p style={styles.mandatory}>* Required fields</p>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
      </div>

      

      <div style={styles.formField}>
        <label style={styles.label}>
          <span style={styles.labelIcon}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </span>
          Email Address <span style={styles.requiredField}>*</span>
        </label>
        <p style={styles.fieldHelper}>We'll use this email to send you important account updates</p>
        <div style={styles.inputGroup}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            style={getFieldStyle('email', email)}
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {validation.email && email && (
            <span style={styles.validIcon}>✓</span>
          )}
        </div>
        {!validation.email && email !== '' && (
          <p style={styles.errorText}>
            <span>⚠</span> Please enter a valid email address
          </p>
        )}
      </div>

      <div style={styles.formField}>
        <label style={styles.label}>Password Requirements</label>
        <div style={styles.passwordContainer}>
          <div>
            <label style={{...styles.label, fontSize: '0.95rem', marginBottom: '0.75rem'}}>
              <span style={styles.labelIcon}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              Password <span style={styles.requiredField}>*</span>
            </label>
            <div style={styles.passwordInputWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                style={getFieldStyle('password', password)}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <button 
                type="button" 
                style={styles.togglePasswordButton}
                onClick={togglePasswordVisibility}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.togglePasswordButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.togglePasswordButton)}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.15-6.15z"></path>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  )}
                </svg>
              </button>
             
            </div>
          </div>

          <div>
            <label style={{...styles.label, fontSize: '0.95rem', marginBottom: '0.75rem'}}>
              Confirm Password <span style={styles.requiredField}>*</span>
            </label>
            <div style={styles.passwordInputWrapper}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Repeat password" 
                style={getFieldStyle('confirmPassword', confirmPassword)}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
              <button 
                type="button" 
                style={styles.togglePasswordButton}
                onClick={toggleConfirmPasswordVisibility}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.togglePasswordButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.togglePasswordButton)}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.15-6.15z"></path>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  )}
                </svg>
              </button>
              
            </div>
          </div>
        </div>
        
        {(!validation.password && password !== '') && (
          <p style={styles.errorText}>
            <span>⚠</span> Password must be at least 8 characters long
          </p>
        )}
        
        {(!validation.confirmPassword && confirmPassword !== '') && (
          <p style={styles.errorText}>
            <span>⚠</span> Passwords do not match
          </p>
        )}
      </div>

      <div style={styles.formField}>
        <div style={styles.phoneSection}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </span>
            Phone Number (Optional)
          </label>
          <p style={styles.fieldHelper}>
            Adding your phone number helps secure your account and enables two-factor authentication
          </p>
          
          {!isPhoneAdded ? (
            <button
              style={{
                ...styles.addPhoneButton,
                ...(hoveredPhone ? styles.addPhoneButtonHover : {})
              }}
              onClick={handleAddPhoneNumber}
              onMouseEnter={() => setHoveredPhone(true)}
              onMouseLeave={() => setHoveredPhone(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Phone Number
            </button>
          ) : (
            <div style={styles.inputGroup}>
              <input 
                type="tel" 
                placeholder="Enter your phone number" 
                style={{
                  ...styles.input,
                  ...(focusedField === 'phone' ? styles.inputFocused : {})
                }}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}