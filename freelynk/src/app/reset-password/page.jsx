'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // Redirect to login if no token provided
      router.push('/');
    }
  }, [searchParams, router]);

  const validatePassword = (password) => {
    const minLength = 8;
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {};
    
    // Validate new password
    const passwordError = validatePassword(passwords.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }
    
    // Validate password confirmation
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: passwords.newPassword
        }),
      });
      
      const message = await response.text();
      
      if (response.ok) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setErrors({ submit: message || 'Failed to reset password' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.resetCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Password Reset Successful!</h1>
            <p className={styles.subtitle}>Your password has been successfully reset.</p>
            <p className={styles.subtitle}>You will be redirected to the login page shortly...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <div className={styles.resetCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>Enter your new password below</p>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => togglePasswordVisibility('newPassword')}
                  aria-label="Toggle password visibility"
                >
                  {showPasswords.newPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.newPassword && (
                <span className={styles.error}>{errors.newPassword}</span>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  aria-label="Toggle password visibility"
                >
                  {showPasswords.confirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword}</span>
              )}
            </div>
            
            {errors.submit && (
              <div className={styles.submitError}>{errors.submit}</div>
            )}
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loader}>Resetting...</span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
    </div>
  );
}