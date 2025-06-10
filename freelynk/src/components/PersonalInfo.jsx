"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styles from './PersonalInfo.module.css';

export default function PersonalInfo({ onValidationChange, onDataChange, initialData }) {
  // Use ref to track if initial validation has run to prevent infinite loops
  const initialValidationRun = useRef(false);
  
  // Memoize initial data to prevent re-renders
  const initialDataMemo = useMemo(() => ({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    profileImage: initialData?.profileImage || null,
    description: initialData?.description || '',
    yearsOfExp: initialData?.yearsOfExp || 1,
    location: initialData?.location || 'Morocco',
    languages: initialData?.languages || ['English']
  }), [
    initialData?.firstName, 
    initialData?.lastName, 
    initialData?.profileImage, 
    initialData?.description, 
    initialData?.yearsOfExp, 
    initialData?.location, 
    initialData?.languages // Remove JSON.stringify to prevent constant changes
  ]);

  const [profileImage, setProfileImage] = useState(initialDataMemo.profileImage);
  const [firstName, setFirstName] = useState(initialDataMemo.firstName);
  const [lastName, setLastName] = useState(initialDataMemo.lastName);
  const [description, setDescription] = useState(initialDataMemo.description);
  const [descriptionChars, setDescriptionChars] = useState(initialDataMemo.description.length);
  const [yearsExperience, setYearsExperience] = useState(initialDataMemo.yearsOfExp);
  const [location, setLocation] = useState(initialDataMemo.location);
  const [languages, setLanguages] = useState(initialDataMemo.languages);
  
  const [validation, setValidation] = useState({
    firstName: false,
    lastName: false,
    profileImage: false,
    description: false
  });

  // Memoize current data to prevent unnecessary updates
  const currentData = useMemo(() => ({
    firstName,
    lastName,
    profileImage,
    description,
    yearsOfExp: yearsExperience,
    location,
    languages: languages.filter(lang => lang.trim() !== '')
  }), [firstName, lastName, profileImage, description, yearsExperience, location, languages]);

  // Stable validation function
  const validateField = useCallback((field, value) => {
    let isValid = false;
    
    switch(field) {
      case 'firstName':
        isValid = value.trim() !== '';
        break;
      case 'lastName':
        isValid = value.trim() !== '';
        break;
      case 'profileImage':
        isValid = value !== null;
        break;
      case 'description':
        isValid = value.length >= 100;
        break;
      default:
        isValid = false;
    }

    setValidation(prev => {
      // Only update if the value actually changed
      if (prev[field] !== isValid) {
        return { ...prev, [field]: isValid };
      }
      return prev;
    });
  }, []);

  // Use refs to track previous values and prevent unnecessary calls
  const prevDataRef = useRef();
  const prevValidationRef = useRef();

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

  // Check all validations and notify parent component
  useEffect(() => {
    const isFormValid = Object.values(validation).every(v => v === true);
    
    // Only call onValidationChange if validation state actually changed
    if (onValidationChange && prevValidationRef.current !== isFormValid) {
      onValidationChange(isFormValid);
    }
    prevValidationRef.current = isFormValid;
  }, [validation, onValidationChange]);

  // Initial validation for fields with default values - run only once
  useEffect(() => {
    if (!initialValidationRun.current) {
      validateField('firstName', firstName);
      validateField('lastName', lastName);
      validateField('profileImage', profileImage);
      validateField('description', description);
      initialValidationRun.current = true;
    }
  }, [validateField, firstName, lastName, profileImage, description]);

  const handleProfileImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        validateField('profileImage', e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, [validateField]);

  const handleDescriptionChange = useCallback((e) => {
    const text = e.target.value;
    setDescription(text);
    setDescriptionChars(text.length);
    validateField('description', text);
  }, [validateField]);

  const handleFirstNameChange = useCallback((e) => {
    const value = e.target.value;
    setFirstName(value);
    validateField('firstName', value);
  }, [validateField]);

  const handleLastNameChange = useCallback((e) => {
    const value = e.target.value;
    setLastName(value);
    validateField('lastName', value);
  }, [validateField]);

  const experienceOptions = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'], []);
  const locationOptions = useMemo(() => ['Morocco', 'United States', 'France', 'United Kingdom', 'Canada', 'Germany'], []);

  const addNewLanguage = useCallback(() => {
    setLanguages(prev => [...prev, '']);
  }, []);

  const updateLanguage = useCallback((index, value) => {
    setLanguages(prev => {
      const newLanguages = [...prev];
      newLanguages[index] = value;
      return newLanguages;
    });
  }, []);

  const removeLanguage = useCallback((index) => {
    setLanguages(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  return (
    <div className={styles.personalInfoContainer}>
      <h2 className={styles.sectionTitle}>Personal Info</h2>
      <p className={styles.sectionDescription}>
        Tell us a bit about yourself. This information will appear on your 
        public profile, so that potential buyers can get to know you better.
      </p>
      <p className={styles.mandatoryNote}>* Mandatory fields</p>

      <div className={styles.formField}>
        <label className={styles.label}>
          Full Name* 
        </label>
        <p className={styles.fieldHelper}>Ex. John Smith</p>
        <div className={styles.nameInputs}>
          <input 
            type="text" 
            placeholder="First Name" 
            className={`${styles.input} ${!validation.firstName && firstName !== '' ? styles.inputError : ''}`} 
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            className={`${styles.input} ${!validation.lastName && lastName !== '' ? styles.inputError : ''}`} 
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
        {(!validation.firstName || !validation.lastName) && (firstName !== '' || lastName !== '') && (
          <p className={styles.errorText}>First and last name are required</p>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Profile Picture*</label>
        <p className={styles.fieldHelper}>
          Add a profile picture of yourself so customers will know exactly who 
          they'll be working with.
        </p>
        <div className={styles.profileImageContainer}>
          <div
            className={`${styles.profileImageUpload} ${!validation.profileImage && styles.imageError}`}
            onClick={() => document.getElementById('profileImageInput').click()}
            style={{ backgroundImage: profileImage ? `url(${profileImage})` : 'none' }}
          >
            {!profileImage && (
              <div className={styles.uploadIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </div>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleProfileImageChange}
          />
        </div>
        {!validation.profileImage && (
          <p className={styles.errorText}>Profile picture is required</p>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Description*</label>
        <textarea
          className={`${styles.textarea} ${!validation.description && description !== '' ? styles.inputError : ''}`}
          placeholder="Share a bit about your work experience, cool projects you've completed, and your area of expertise."
          value={description}
          onChange={handleDescriptionChange}
          maxLength={255}
        ></textarea>
        <div className={styles.charCount}>
          <span className={`${styles.minChars} ${descriptionChars < 100 ? styles.errorText : ''}`}>
            min. 100 characters
          </span>
          <span>{descriptionChars} / 255</span>
        </div>
        {!validation.description && description !== '' && (
          <p className={styles.errorText}>Description must be at least 100 characters</p>
        )}
      </div>

      <div className={styles.twoColumnGrid}>
        <div className={styles.formField}>
          <label className={styles.label}>Years of Experience*</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            >
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={styles.selectArrow}></div>
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Location*</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={styles.selectArrow}></div>
          </div>
        </div>
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Languages*</label>
        <p className={styles.fieldHelper}>
          Select which languages you can communicate in.
        </p>

        <div className={styles.languageTableHeader}>
          <div>Language</div>
        </div>

        {languages.map((lang, index) => (
          <div key={index} className={styles.languageRow}>
            <div className={styles.languageCol}>
              <input
                type="text"
                className={styles.input}
                value={lang}
                onChange={(e) => updateLanguage(index, e.target.value)}
                placeholder="Language"
              />
            </div>
            {languages.length > 1 && (
              <div className={styles.editCol}>
                <button 
                  className={styles.editButton}
                  onClick={() => removeLanguage(index)}
                  title="Remove language"
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
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}

        <button className={styles.addButton} onClick={addNewLanguage}>
          Add New
        </button>
      </div>
    </div>
  );
}