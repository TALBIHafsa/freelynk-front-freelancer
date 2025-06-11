"use client"
import { useState, useCallback } from 'react';
import styles from './ProfilePage.module.css';
import PersonalInfo from '../../components/PersonalInfo/PersonalInfo';
import ProfessionalInfo from '../../components/ProfessionalInfo/ProfessionalInfo';
import AccountSecurity from '../../components/AccountSecurity/AccountSecurity';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
    description: '',
    yearsOfExp: 1,
    location: 'Morocco',
    languages: ['English'],
    occupation: 'Graphics & Design',
    skills: [],
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [validationStatus, setValidationStatus] = useState({
    personalInfo: false,
    professionalInfo: false,
    accountSecurity: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Stable callback for updating validation status
  const handleValidationChange = useCallback((component, isValid) => {
    console.log(`Validation changed for ${component}:`, isValid);
    setValidationStatus(prev => {
      const newStatus = {
        ...prev,
        [component]: isValid
      };
      console.log('Updated validation status:', newStatus);
      return newStatus;
    });
  }, []);

  // Stable callback for updating form data
  const handleDataChange = useCallback((component, data) => {
    console.log(`Data changed for ${component}:`, data);
    setFormData(prev => {
      const newData = {
        ...prev,
        ...data
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  }, []);

  const isFormValid = Object.values(validationStatus).every(Boolean);
  console.log('Form validation status:', validationStatus, 'Is form valid:', isFormValid);

  const handleSubmit = async () => {
    console.log('Submit button clicked!');
    console.log('Current form data:', formData);
    console.log('Current validation status:', validationStatus);
    console.log('Is form valid:', isFormValid);

    if (!isFormValid) {
      console.log('Form is not valid, showing error');
      setSubmitError('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Prepare the data to match your backend SignupFreelancerRequest
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profileImage: formData.profileImage,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        description: formData.description,
        yearsOfExp: parseInt(formData.yearsOfExp), // Ensure it's a number
        location: formData.location,
        languages: Array.isArray(formData.languages) 
          ? formData.languages.filter(lang => lang.trim()).join(', ')
          : formData.languages, // Handle both array and string
        occupation: formData.occupation,
        skills: Array.isArray(formData.skills) 
          ? formData.skills.map(skill => 
              typeof skill === 'object' ? skill.skill : skill
            ).filter(skill => skill && skill.trim())
          : [], // Ensure it's always an array
        phone: formData.phone || null,
        rating: null // Will be null for new users
      };

      console.log('Submitting data:', submitData);
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
      const apiUrl = `${backendUrl}/api/auth/signup/freelancer`;
      
      console.log('Making request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(errorText || `Registration failed with status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Registration successful:', result);
      
      setSubmitSuccess(true);
      setSubmitError('');
      
      // Optional: Redirect to login page or dashboard after successful registration
      setTimeout(() => {
        console.log('Redirecting to home page');
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error stack:', error.stack);
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src='/images/image.png' className={styles.logo} alt="Logo" />
      </header>
            <div className={styles.componentsContainer}>
      
      <PersonalInfo 
        onValidationChange={(isValid) => handleValidationChange('personalInfo', isValid)}
        onDataChange={(data) => handleDataChange('personalInfo', data)}
        initialData={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileImage: formData.profileImage,
          description: formData.description,
          yearsOfExp: formData.yearsOfExp,
          location: formData.location,
          languages: formData.languages
        }}
      />
      
      <ProfessionalInfo
        onValidationChange={(isValid) => handleValidationChange('professionalInfo', isValid)}
        onDataChange={(data) => handleDataChange('professionalInfo', data)}
        initialData={{
          occupation: formData.occupation,
          skills: formData.skills
        }}
      />
      
      <AccountSecurity
        onValidationChange={(isValid) => handleValidationChange('accountSecurity', isValid)}
        onDataChange={(data) => handleDataChange('accountSecurity', data)}
        initialData={{
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone
        }}
      />
      </div>
      <div className={styles.buttonContainer}>
        <button 
          className={`${styles.continueButton} ${!isFormValid ? styles.disabled : ''}`}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Continue'}
        </button>
      </div>
      
      {/* Debug information - remove in production */}
      {/* <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px 0', fontSize: '12px' }}>
        <strong>Debug Info:</strong><br/>
        Form Valid: {isFormValid ? 'Yes' : 'No'}<br/>
        Personal Info Valid: {validationStatus.personalInfo ? 'Yes' : 'No'}<br/>
        Professional Info Valid: {validationStatus.professionalInfo ? 'Yes' : 'No'}<br/>
        Account Security Valid: {validationStatus.accountSecurity ? 'Yes' : 'No'}<br/>
        Is Submitting: {isSubmitting ? 'Yes' : 'No'}
      </div> */}
      
      {submitError && (
        <div className={styles.errorMessage}>
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className={styles.successMessage}>
          Registration successful! Welcome to our platform!
        </div>
      )}
      
      
    </div>
  );
}