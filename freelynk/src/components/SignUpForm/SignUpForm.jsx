"use client";

import { useState } from "react";
import styles from "./signup.module.css";
import Image from "next/image";
import Swal from 'sweetalert2';


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
  const [errors, setErrors] = useState({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Password validation requirements
  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      return "Password is required";
    }
    
    if (password.length < passwordRequirements.minLength) {
      errors.push(`at least ${passwordRequirements.minLength} characters`);
    }
    
    if (!passwordRequirements.hasUpperCase.test(password)) {
      errors.push("one uppercase letter");
    }
    
    if (!passwordRequirements.hasLowerCase.test(password)) {
      errors.push("one lowercase letter");
    }
    
    if (!passwordRequirements.hasNumber.test(password)) {
      errors.push("one number");
    }
    
    if (!passwordRequirements.hasSpecialChar.test(password)) {
      errors.push("one special character");
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}`;
    }
    
    return "";
  };

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }

    // Real-time validation for password confirmation
    if (id === "confirmPassword" || (id === "password" && formData.confirmPassword)) {
      const confirmPasswordValue = id === "confirmPassword" ? value : formData.confirmPassword;
      const passwordValue = id === "password" ? value : formData.password;
      
      if (confirmPasswordValue && passwordValue !== confirmPasswordValue) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const error = validateField(id, value);
    
    setErrors(prev => ({
      ...prev,
      [id]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== "userType") {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword, 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Signup failed: ${errorText}`);
      }

const result = await response.text();
console.log("Signup successful:", result);
Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Signup successful!',
});

onClose();
} catch (err) {
  console.error(err);
  Swal.fire({
    icon: 'error',
    title: 'Signup Failed',
    text: 'Check the console for more details.',
  });
}
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
                className={`${styles.formInput} ${errors.firstName ? styles.errorInput : ''}`}
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <input
                type="text"
                id="lastName"
                className={`${styles.formInput} ${errors.lastName ? styles.errorInput : ''}`}
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email address</label>
            <input
              type="email"
              id="email"
              className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
              placeholder="Enter Email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`${styles.formInput} ${errors.password ? styles.errorInput : ''}`}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.errorInput : ''}`}
                placeholder="Repeat Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
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

          
        

          <p className={styles.termsText}>
            By Signing Up you accept our <a href="#" className={styles.termsLink}>Privacy Policy and Terms of Services</a>
          </p>
        </form>
      </div>
    </div>
  );
}