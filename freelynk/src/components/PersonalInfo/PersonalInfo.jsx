import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function PersonalInfo({ onValidationChange, onDataChange, initialData }) {
  const initialValidationRun = useRef(false);
  
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
    initialData?.languages
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

  const [focusedField, setFocusedField] = useState(null);

  const currentData = useMemo(() => ({
    firstName,
    lastName,
    profileImage,
    description,
    yearsOfExp: yearsExperience,
    location,
    languages: languages.filter(lang => lang.trim() !== '')
  }), [firstName, lastName, profileImage, description, yearsExperience, location, languages]);

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
      if (prev[field] !== isValid) {
        return { ...prev, [field]: isValid };
      }
      return prev;
    });
  }, []);

  const prevDataRef = useRef();
  const prevValidationRef = useRef();

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
    const isFormValid = Object.values(validation).every(v => v === true);
    
    if (onValidationChange && prevValidationRef.current !== isFormValid) {
      onValidationChange(isFormValid);
    }
    prevValidationRef.current = isFormValid;
  }, [validation, onValidationChange]);

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
      width: `${(Object.values(validation).filter(v => v).length / 4) * 100}%`,
    },
    formField: {
      marginBottom: '2.5rem',
      position: 'relative',
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2f3c7e',
      fontSize: '1rem',
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
    nameInputs: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    profileImageUpload: {
      width: '120px',
      height: '120px',
      backgroundColor: '#f8f9ff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      border: '3px solid #e1e5e9',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
    },
    profileImageHover: {
      borderColor: '#2f3c7e',
      boxShadow: '0 8px 24px rgba(47, 60, 126, 0.2)',
      transform: 'scale(1.05)',
    },
    profileImageError: {
      borderColor: '#e74c3c',
      boxShadow: '0 8px 24px rgba(231, 76, 60, 0.2)',
    },
    uploadIcon: {
      color: '#2f3c7e',
      opacity: 0.7,
    },
    uploadText: {
      marginLeft: '1rem',
      color: '#666',
      fontSize: '0.95rem',
    },
    textarea: {
      width: '100%',
      minHeight: '140px',
      padding: '1rem',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1rem',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      outline: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    charCount: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      marginTop: '0.75rem',
    },
    minChars: {
      fontStyle: 'italic',
      color: '#777',
    },
    minCharsError: {
      color: '#e74c3c',
    },
    charCounter: {
      color: '#777',
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
    },
    selectContainer: {
      position: 'relative',
    },
    select: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1rem',
      appearance: 'none',
      color: '#333',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    selectArrow: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #777',
      pointerEvents: 'none',
      transition: 'transform 0.3s ease',
    },
    languageSection: {
      backgroundColor: '#f8f9ff',
      padding: '2rem',
      borderRadius: '16px',
      border: '1px solid rgba(47, 60, 126, 0.1)',
    },
    languageHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    languageTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2f3c7e',
      marginRight: '1rem',
    },
    languageBadge: {
      backgroundColor: '#2f3c7e',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    languageRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e1e5e9',
      transition: 'all 0.3s ease',
    },
    languageRowHover: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)',
    },
    languageInput: {
      flex: 1,
      padding: '0.75rem',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    removeButton: {
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      minWidth: '36px',
      height: '36px',
    },
    addButton: {
      background: 'linear-gradient(135deg, #2f3c7e 0%, #4a5ba3 100%)',
      color: 'white',
      border: 'none',
      padding: '0.875rem 2rem',
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
    addButtonHover: {
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
    },
    hiddenInput: {
      display: 'none',
    },
  };

  const [hoveredImage, setHoveredImage] = useState(false);
  const [hoveredAdd, setHoveredAdd] = useState(false);

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

  const progress = (Object.values(validation).filter(v => v).length / 4) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Personal Information</h2>
        <p style={styles.subtitle}>
          Tell us about yourself. This information will appear on your public profile 
          to help potential clients get to know you better.
        </p>
        <p style={styles.mandatory}>* Required fields</p>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
      </div>

      <div style={styles.formField}>
        <label style={styles.label}>Full Name *</label>
        <p style={styles.fieldHelper}>Your professional name as it will appear to clients</p>
        <div style={styles.nameInputs}>
          <div style={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="First Name" 
              style={getFieldStyle('firstName', firstName)}
              value={firstName}
              onChange={handleFirstNameChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
            />
            {validation.firstName && firstName && (
              <span style={{...styles.validIcon, position: 'absolute', right: '1rem', top: '1rem'}}>✓</span>
            )}
          </div>
          <div style={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Last Name" 
              style={getFieldStyle('lastName', lastName)}
              value={lastName}
              onChange={handleLastNameChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
            />
            {validation.lastName && lastName && (
              <span style={{...styles.validIcon, position: 'absolute', right: '1rem', top: '1rem'}}>✓</span>
            )}
          </div>
        </div>
        {(!validation.firstName || !validation.lastName) && (firstName !== '' || lastName !== '') && (
          <p style={styles.errorText}>
            <span>⚠</span> Both first and last name are required
          </p>
        )}
      </div>

      <div style={styles.formField}>
        <label style={styles.label}>Profile Picture *</label>
        <p style={styles.fieldHelper}>
          Upload a professional photo so clients know who they're working with
        </p>
        <div style={styles.profileSection}>
          <div
            style={{
              ...styles.profileImageUpload,
              ...(hoveredImage ? styles.profileImageHover : {}),
              ...(!validation.profileImage ? styles.profileImageError : {}),
              backgroundImage: profileImage ? `url(${profileImage})` : 'none'
            }}
            onClick={() => document.getElementById('profileImageInput').click()}
            onMouseEnter={() => setHoveredImage(true)}
            onMouseLeave={() => setHoveredImage(false)}
          >
            {!profileImage && (
              <div style={styles.uploadIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
            {validation.profileImage && (
              <span style={{...styles.validIcon, position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'white', borderRadius: '50%', padding: '0.25rem'}}>✓</span>
            )}
          </div>
          <div style={styles.uploadText}>
            <p style={{margin: 0, fontWeight: '500', color: '#2f3c7e'}}>
              Click to upload your photo
            </p>
            <p style={{margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#777'}}>
              JPG, PNG or GIF (max 5MB)
            </p>
          </div>
        </div>
        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          style={styles.hiddenInput}
          onChange={handleProfileImageChange}
        />
        {!validation.profileImage && (
          <p style={styles.errorText}>
            <span>⚠</span> Profile picture is required
          </p>
        )}
      </div>

      <div style={styles.formField}>
        <label style={styles.label}>Professional Description *</label>
        <textarea
          style={{
            ...styles.textarea,
            ...(focusedField === 'description' ? styles.inputFocused : {}),
            ...(!validation.description && description !== '' ? styles.inputError : {}),
            ...(validation.description ? styles.inputValid : {})
          }}
          placeholder="Share your work experience, notable projects, and areas of expertise. What makes you unique as a professional?"
          value={description}
          onChange={handleDescriptionChange}
          onFocus={() => setFocusedField('description')}
          onBlur={() => setFocusedField(null)}
          maxLength={255}
        />
        <div style={styles.charCount}>
          <span style={{
            ...styles.minChars,
            ...(descriptionChars < 100 ? styles.minCharsError : {})
          }}>
            {descriptionChars < 100 ? `${100 - descriptionChars} characters needed` : 'Minimum met ✓'}
          </span>
          <span style={styles.charCounter}>{descriptionChars} / 255</span>
        </div>
        {!validation.description && description !== '' && (
          <p style={styles.errorText}>
            <span>⚠</span> Description must be at least 100 characters
          </p>
        )}
      </div>

      <div style={styles.twoColumn}>
        <div style={styles.formField}>
          <label style={styles.label}>Years of Experience</label>
          <div style={styles.selectContainer}>
            <select
              style={styles.select}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            >
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option} {option === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
            <div style={styles.selectArrow} />
          </div>
        </div>

        <div style={styles.formField}>
          <label style={styles.label}>Location</label>
          <div style={styles.selectContainer}>
            <select
              style={styles.select}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div style={styles.selectArrow} />
          </div>
        </div>
      </div>

      <div style={styles.formField}>
        <div style={styles.languageSection}>
          <div style={styles.languageHeader}>
            <span style={styles.languageTitle}>Languages</span>
            <span style={styles.languageBadge}>{languages.filter(lang => lang.trim()).length}</span>
          </div>
          <p style={styles.fieldHelper}>
            Add the languages you can communicate in with clients
          </p>

          {languages.map((lang, index) => (
            <div 
              key={index} 
              style={{
                ...styles.languageRow,
                ...(lang.trim() ? styles.languageRowHover : {})
              }}
            >
              <input
                type="text"
                style={styles.languageInput}
                value={lang}
                onChange={(e) => updateLanguage(index, e.target.value)}
                placeholder="Enter language"
              />
              {languages.length > 1 && (
                <button 
                  style={styles.removeButton}
                  onClick={() => removeLanguage(index)}
                  title="Remove language"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
          ))}

          <button 
            style={{
              ...styles.addButton,
              ...(hoveredAdd ? styles.addButtonHover : {})
            }}
            onClick={addNewLanguage}
            onMouseEnter={() => setHoveredAdd(true)}
            onMouseLeave={() => setHoveredAdd(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Language
          </button>
        </div>
      </div>
    </div>
  );
}