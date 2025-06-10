"use client"
import React, { useState } from 'react';
import './RatingFreelancer.css';
import NavBar from '../../components/navbar2/Navbar';
import Footer from '../../components/Footer/Footer';

const RatingFreelancer = () => {
  const [ratings, setRatings] = useState({
    communication: 0,
    quality: 0,
    value: 0
  });
  const [comment, setComment] = useState('');
  
  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (comment.length < 100) {
      alert('Comment must be at least 100 characters long.');
      return;
    }
    
    // Here you would integrate with your API
    console.log({ ratings, comment });
    alert('Rating submitted successfully!');
  };
  
  const renderStars = (category) => {
    return (
      <div className="star-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= ratings[category] ? 'star-filled' : ''}`}
            onClick={() => handleRatingChange(category, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <NavBar/>
    <div className="rating-container">
      <h1 className="rating-title">Rating The Freelancer</h1>
      
      <form onSubmit={handleSubmit} className="rating-form">
        <div className="rating-row">
          <label className="rating-label">Communication Level</label>
          {renderStars('communication')}
        </div>
        
        <div className="rating-row">
          <label className="rating-label">Quality of delivery</label>
          {renderStars('quality')}
        </div>
        
        <div className="rating-row">
          <label className="rating-label">Value of delivery</label>
          {renderStars('value')}
        </div>
        
        <div className="comment-section">
          <label className="comment-label">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="comment-textarea"
            placeholder="Write your comment here..."
            minLength={100}
            required
          />
          <div className="character-count">
            <span>min. 100 characters</span>
            <span>{comment.length}/750</span>
          </div>
        </div>
        
        <div className="button-container">
          <button
            type="submit"
            className="submit-button"
            disabled={comment.length < 100}
          >
            Post
          </button>
        </div>
      </form>
    </div>
    <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
    </div>
  </div>

  );
};

export default RatingFreelancer;