"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './AddGig.css';
import NavBar from '../../../components/navbar_freelancer/Navbar';

export default function AddGig() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gigName: '',
    gigDescription: '',
    photos: []
  });

  const [descriptionLength, setDescriptionLength] = useState(0);
  const [photoError, setPhotoError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'gigDescription') {
      setDescriptionLength(value.length);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const currentPhotos = formData.photos;
    const totalPhotos = currentPhotos.length + files.length;

    // Clear any previous errors
    setPhotoError('');

    // Check if total photos exceed 10
    if (totalPhotos > 10) {
      setPhotoError(`You can only upload a maximum of 10 photos. Currently you have ${currentPhotos.length} photos. You can add ${10 - currentPhotos.length} more.`);
      return;
    }

    // Validate file types (optional - add image validation)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setPhotoError('Please upload only image files (JPEG, PNG, GIF, WebP).');
      return;
    }

    // Validate file sizes (optional - 5MB limit per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setPhotoError('Each image must be smaller than 5MB.');
      return;
    }

    // Add new photos to existing ones
    setFormData({
      ...formData,
      photos: [...currentPhotos, ...files]
    });

    // Clear the input to allow re-selecting the same files if needed
    e.target.value = '';
  };

  const removePhoto = (indexToRemove) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, index) => index !== indexToRemove)
    });
    setPhotoError(''); // Clear error when photos are removed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    if (formData.photos.length > 10) {
      alert('Please upload a maximum of 10 photos');
      return;
    }

    try {
      const gigData = new FormData();
      gigData.append('title', formData.gigName);
      gigData.append('description', formData.gigDescription);
      
      formData.photos.forEach(photo => {
        gigData.append('gigUrls', photo);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: gigData
      });

      if (response.ok) {
        console.log('Gig added successfully');
        alert('Gig added successfully!');
        // Reset form
        setFormData({
          gigName: '',
          gigDescription: '',
          photos: []
        });
        setDescriptionLength(0);
        setPhotoError('');
        
        // Navigate to profile page
        router.push('/Freelancer/profile');
      } else {
        const errorData = await response.text();
        console.error('Failed to add gig:', errorData);
        alert('Failed to add gig. Please try again.');
      }
    } catch (error) {
      console.error('Error adding gig:', error);
      alert('An error occurred while adding the gig. Please try again.');
    }
  };

  return (
    <div className="add-gig-container">
      <NavBar />
      <div className="add-gig-content" style={{marginTop:"150px"}}>
        <h1>Add a Gig</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gigName">Gig name</label>
            <input
              type="text"
              id="gigName"
              name="gigName"
              value={formData.gigName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gigDescription">About this gig</label>
            <textarea
              id="gigDescription"
              name="gigDescription"
              value={formData.gigDescription}
              onChange={handleInputChange}
              maxLength={255}
              rows={8}
              required
            />
            <div className="character-count">
              {descriptionLength}/255
            </div>
          </div>
          
          <div className="form-group">
            <label>Add Photos (Max 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={formData.photos.length >= 10}
            />
            
            {photoError && (
              <div className="error-message" style={{color: 'red', marginTop: '5px'}}>
                {photoError}
              </div>
            )}
            
            <div className="photo-count" style={{marginTop: '5px', fontSize: '14px', color: '#666'}}>
              {formData.photos.length}/10 photos selected
            </div>
            
            {formData.photos.length > 0 && (
              <div className="photo-preview" style={{marginTop: '10px'}}>
                <h4>Selected Photos:</h4>
                <div className="photo-list">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="photo-item" style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '5px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      <span style={{flex: 1, fontSize: '14px'}}>{photo.name}</span>
                      <span style={{marginRight: '10px', fontSize: '12px', color: '#666'}}>
                        ({(photo.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}