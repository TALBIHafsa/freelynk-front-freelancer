"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styles from './AccountSecurity.module.css';

export default function AccountSecurity({ onValidationChange, onDataChange, initialData }) {
  // Use ref to track previous validation state
  const prevValidationRef = useRef();
  const prevDataRef = useRef();
  
  // Memoize initial data with proper dependencies
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
  const [phoneNumber, setPhoneNumber] = useState(initialDataMemo.phone);
  const [isPhoneAdded, setIsPhoneAdded] = useState(!!initialDataMemo.phone);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formValid, setFormValid] = useState(false);

  // Memoize current data to prevent unnecessary updates
  const currentData = useMemo(() => ({
    email,
    password,
    confirmPassword,
    phone: phoneNumber
  }), [email, password, confirmPassword, phoneNumber]);

  // Stable validation functions
  const validateEmail = useCallback((email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;
    let newEmailError = '';
    let newPasswordError = '';

    // Email validation
    if (!email) {
      newEmailError = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newEmailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newPasswordError = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newPasswordError = 'Password must be at least 8 characters';
      isValid = false;
    } else if (password !== confirmPassword && confirmPassword !== '') {
      newPasswordError = 'Passwords do not match';
      isValid = false;
    }

    // Only update errors if they actually changed
    if (emailError !== newEmailError) {
      setEmailError(newEmailError);
    }
    if (passwordError !== newPasswordError) {
      setPasswordError(newPasswordError);
    }

    // Only update form validity if it changed
    if (formValid !== isValid) {
      setFormValid(isValid);
    }

    return isValid;
  }, [email, password, confirmPassword, validateEmail, emailError, passwordError, formValid]);

  // Update parent component with data changes - only when data actually changes
  useEffect(() => {
    if (onDataChange && prevDataRef.current) {
      const hasChanged = JSON.stringify(currentData) !== JSON.stringify(prevDataRef.current);
      if (hasChanged) {
        onDataChange(currentData);
      }
    }
    prevDataRef.current = currentData;
  }, [currentData, onDataChange]);

  // Validate form on any relevant input change
  useEffect(() => {
    validateForm();
  }, [email, password, confirmPassword]); // Remove validateForm from dependencies to prevent loops

  // Report validation status to parent component - only when it changes
  useEffect(() => {
    if (onValidationChange && prevValidationRef.current !== formValid) {
      onValidationChange(formValid);
    }
    prevValidationRef.current = formValid;
  }, [formValid, onValidationChange]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(''); // Clear error when user starts typing
  }, [emailError]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(''); // Clear error when user starts typing
  }, [passwordError]);

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value);
    if (passwordError && password === e.target.value) {
      setPasswordError(''); // Clear error if passwords now match
    }
  }, [password, passwordError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleAddPhoneNumber = useCallback(() => {
    setIsPhoneAdded(true);
  }, []);

  const handlePhoneNumberChange = useCallback((e) => {
    setPhoneNumber(e.target.value);
  }, []);

  return (
    <div className={styles.accountSecurityContainer}>
      <h2 className={styles.sectionTitle}>Account Security</h2>
      <p className={styles.sectionDescription}>
        Trust and safety is a big deal in our community. Please verify your email and phone number so that we
        can keep your account secured.
      </p>

      {/* Email Field */}
      <div className={styles.formField}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
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
          Email <span className={styles.requiredField}>*</span>
          <span className={styles.privateTag}>Private</span>
        </label>
        <input 
          type="email" 
          placeholder="Enter Email address" 
          className={`${styles.input} ${emailError ? styles.inputError : ''}`} 
          value={email}
          onChange={handleEmailChange}
          required
        />
        {emailError && <p className={styles.errorText}>{emailError}</p>}
      </div>

      {/* Password Fields */}
      <div className={styles.passwordContainer}>
        <div className={styles.passwordField}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
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
            Password <span className={styles.requiredField}>*</span>
          </label>
          <div className={styles.passwordInputWrapper}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter Password" 
              className={`${styles.input} ${passwordError ? styles.inputError : ''}`} 
              value={password}
              onChange={handlePasswordChange}
              required
            />
           
            <button 
              type="button" 
              className={styles.togglePasswordButton}
              onClick={togglePasswordVisibility}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.passwordField}>
          <label className={styles.label}>
            Confirm Password <span className={styles.requiredField}>*</span>
          </label>
          <input 
            type="password" 
            placeholder="Repeat Password" 
            className={`${styles.input} ${passwordError ? styles.inputError : ''}`} 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
      </div>
      {passwordError && <p className={styles.errorText}>{passwordError}</p>}

      {/* Phone Number Field */}
      <div className={styles.formField}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
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
          Phone Number
          <span className={styles.privateTag}>Private</span>
        </label>
        <p className={styles.fieldHelper}>We'll never share your phone number.</p>
        
        {!isPhoneAdded ? (
          <button
            className={styles.addPhoneButton}
            onClick={handleAddPhoneNumber}
          >
            Add Phone Number
          </button>
        ) : (
          <input 
            type="tel" 
            placeholder="Enter phone number" 
            className={styles.input} 
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        )}
      </div>
    </div>
  );
}