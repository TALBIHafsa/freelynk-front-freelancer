"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function ProfessionalInfo({ onValidationChange, onDataChange, initialData }) {
  const prevValidationRef = useRef();
  const prevDataRef = useRef();
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredAdd, setHoveredAdd] = useState(false);
  
  const initialDataMemo = useMemo(() => ({
    occupation: initialData?.occupation || '',
    skills: initialData?.skills || []
  }), [initialData?.occupation, initialData?.skills]);

  const [occupation, setOccupation] = useState(initialDataMemo.occupation);
  const [skills, setSkills] = useState(initialDataMemo.skills);
  const [newSkill, setNewSkill] = useState('');

  const occupationOptions = useMemo(() => [
    'Graphics & Design',
    'Web Development',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Business',
    'Data'
  ], []);

  const currentData = useMemo(() => ({
    occupation,
    skills
  }), [occupation, skills]);

  const validation = useMemo(() => ({
    occupation: !!occupation,
    skills: skills.length > 0
  }), [occupation, skills.length]);

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
    const isValid = Object.values(validation).every(v => v === true);
    
    if (onValidationChange && prevValidationRef.current !== isValid) {
      onValidationChange(isValid);
    }
    prevValidationRef.current = isValid;
  }, [validation, onValidationChange]);

  const addSkill = useCallback(() => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, { skill: newSkill.trim() }]);
      setNewSkill('');
    }
  }, [newSkill]);

  const removeSkill = useCallback((index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  }, [addSkill]);

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
      width: `${(Object.values(validation).filter(v => v).length / 2) * 100}%`,
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
    selectFocused: {
      borderColor: '#2f3c7e',
      boxShadow: '0 4px 16px rgba(47, 60, 126, 0.15)',
      transform: 'translateY(-1px)',
    },
    selectValid: {
      borderColor: '#27ae60',
      boxShadow: '0 4px 16px rgba(39, 174, 96, 0.15)',
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
    skillsSection: {
      backgroundColor: '#f8f9ff',
      padding: '2rem',
      borderRadius: '16px',
      border: '1px solid rgba(47, 60, 126, 0.1)',
    },
    skillsHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    skillsTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2f3c7e',
      marginRight: '1rem',
    },
    skillsBadge: {
      backgroundColor: '#2f3c7e',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    skillRow: {
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
    skillRowHover: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)',
    },
    skillName: {
      flex: 1,
      fontWeight: '500',
      color: '#333',
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
    removeButtonHover: {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
    },
    addSkillRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e1e5e9',
      marginTop: '1rem',
    },
    input: {
      flex: 1,
      padding: '0.875rem',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: '#ffffff',
    },
    inputFocused: {
      borderColor: '#2f3c7e',
      boxShadow: '0 2px 8px rgba(47, 60, 126, 0.15)',
    },
    addButton: {
      background: 'linear-gradient(135deg, #2f3c7e 0%, #4a5ba3 100%)',
      color: 'white',
      border: 'none',
      padding: '0.875rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 16px rgba(47, 60, 126, 0.3)',
      minWidth: '80px',
    },
    addButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(47, 60, 126, 0.4)',
    },
    addButtonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
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
    emptyState: {
      textAlign: 'center',
      padding: '2rem',
      color: '#777',
      fontStyle: 'italic',
    }
  };

  const getSelectStyle = () => {
    const baseStyle = { ...styles.select };
    
    if (focusedField === 'occupation') {
      Object.assign(baseStyle, styles.selectFocused);
    } else if (validation.occupation) {
      Object.assign(baseStyle, styles.selectValid);
    }
    
    return baseStyle;
  };

  const progress = (Object.values(validation).filter(v => v).length / 2) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Professional Information</h2>
        <p style={styles.subtitle}>
          This is your time to shine. Let potential buyers know what you do 
          best and how you gained your skills, certifications and experience.
        </p>
        <p style={styles.mandatory}>* Required fields</p>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
      </div>

      <div style={styles.formField}>
        <label style={styles.label}>Your Occupation *</label>
        <p style={styles.fieldHelper}>Select the category that best describes your professional expertise</p>
        <div style={styles.selectContainer}>
          <select
            style={getSelectStyle()}
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            onFocus={() => setFocusedField('occupation')}
            onBlur={() => setFocusedField(null)}
          >
            {occupationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div style={styles.selectArrow} />
          {validation.occupation && (
            <span style={{...styles.validIcon, position: 'absolute', right: '3rem', top: '1rem'}}>✓</span>
          )}
        </div>
      </div>

      <div style={styles.formField}>
        <div style={styles.skillsSection}>
          <div style={styles.skillsHeader}>
            <span style={styles.skillsTitle}>Skills *</span>
            <span style={styles.skillsBadge}>{skills.length}</span>
          </div>
          <p style={styles.fieldHelper}>
            Add your key skills and expertise areas that clients should know about
          </p>

          {!validation.skills && (
            <p style={styles.errorText}>
              <span>⚠</span> Please add at least one skill
            </p>
          )}

          {skills.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No skills added yet. Add your first skill below!</p>
            </div>
          ) : (
            skills.map((skill, index) => (
              <div 
                key={index} 
                style={styles.skillRow}
              >
                <div style={styles.skillName}>
                  {skill.skill || skill}
                </div>
                <button 
                  style={styles.removeButton}
                  onClick={() => removeSkill(index)}
                  title="Remove skill"
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.removeButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.removeButton)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))
          )}

          <div style={styles.addSkillRow}>
            <input
              type="text"
              style={{
                ...styles.input,
                ...(focusedField === 'newSkill' ? styles.inputFocused : {})
              }}
              placeholder="Add a skill (e.g., Web Design, SEO, Content Writing)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setFocusedField('newSkill')}
              onBlur={() => setFocusedField(null)}
            />
            
            <button 
              style={{
                ...styles.addButton,
                ...(hoveredAdd ? styles.addButtonHover : {}),
                ...(!newSkill.trim() ? styles.addButtonDisabled : {})
              }}
              onClick={addSkill}
              disabled={!newSkill.trim()}
              onMouseEnter={() => setHoveredAdd(true)}
              onMouseLeave={() => setHoveredAdd(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}