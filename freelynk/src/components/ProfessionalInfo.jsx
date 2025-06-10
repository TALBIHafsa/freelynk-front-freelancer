"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styles from './ProfessionalInfo.module.css';

export default function ProfessionalInfo({ onValidationChange, onDataChange, initialData }) {
  // Use refs to track previous values
  const prevValidationRef = useRef();
  const prevDataRef = useRef();
  
  // Memoize initial data with proper dependencies
  const initialDataMemo = useMemo(() => ({
    occupation: initialData?.occupation || 'Graphics & Design',
    skills: initialData?.skills || []
  }), [initialData?.occupation, initialData?.skills]); // Remove JSON.stringify

  const [occupation, setOccupation] = useState(initialDataMemo.occupation);
  const [skills, setSkills] = useState(initialDataMemo.skills);
  const [newSkill, setNewSkill] = useState('');

  // Sample options for dropdowns - memoized to prevent re-creation
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

  // Memoize current data to prevent unnecessary updates
  const currentData = useMemo(() => ({
    occupation,
    skills
  }), [occupation, skills]);

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

  // Check validation only when relevant data changes - prevent infinite loops
  useEffect(() => {
    const isValid = occupation && skills.length > 0;
    
    // Only call onValidationChange if validation state actually changed
    if (onValidationChange && prevValidationRef.current !== isValid) {
      onValidationChange(isValid);
    }
    prevValidationRef.current = isValid;
  }, [occupation, skills.length, onValidationChange]); // Use skills.length instead of skills array

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

  const handleOccupationChange = useCallback((e) => {
    setOccupation(e.target.value);
  }, []);

  const handleNewSkillChange = useCallback((e) => {
    setNewSkill(e.target.value);
  }, []);

  
  return (
    <div className={styles.professionalInfoContainer}>
      <h2 className={styles.sectionTitle}>Professional Info</h2>
      <p className={styles.sectionDescription}>
        This is your time to shine. Let potential buyers know what you do 
        best and how you gained your skills, certifications and 
        experience.
      </p>
      <p className={styles.mandatoryNote}>* Mandatory fields</p>

      {/* Occupation Section */}
      <div className={styles.formField}>
        <label className={styles.label}>Your Occupation*</label>
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          >
            {occupationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className={styles.selectArrow}></div>
        </div>
      </div>

      {/* Skills Section */}
      <div className={styles.formField}>
        <label className={styles.label}>Skills*</label>
        {skills.length === 0 && (
          <p className={styles.validationError}>Please add at least one skill</p>
        )}
        
        <div className={styles.skillTableHeader}>
          <div>Skill</div>
        </div>

        {skills.map((skill, index) => (
          <div key={index} className={styles.skillRow}>
            <div>{skill.skill || skill}</div>
            <div className={styles.editCol}>
              <button 
                className={styles.editButton}
                onClick={() => removeSkill(index)}
                title="Remove skill"
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
          </div>
        ))}

        <div className={styles.addSkillRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <button 
            className={styles.addButton} 
            onClick={addSkill}
            disabled={!newSkill.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}