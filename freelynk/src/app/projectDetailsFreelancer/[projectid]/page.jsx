"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './ProjectDetailsFreelancer.module.css';
import { BookmarkIcon, User, Mail, X } from 'lucide-react';
import NavBar from '../../../components/navbar2/Navbar';
import Footer from '../../../components/Footer/Footer';

export default function ProjectDetailsFreelancer() {
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const params = useParams();
  const projectId = params.projectid;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [freelancerEmail, setFreelancerEmail] = useState(null);
  const currency = "USD"
  
  // Calculate deadline
  const deadline = new Date(projectData.bindingDeadline);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  const [bidForm, setBidForm] = useState({
    offer: '',
    deliveryTime: '',
    motivation: ''
  });
  
  const [bidData, setBidData] = useState([]);
  const [freelancersData, setFreelancersData] = useState({});

  // Get freelancer email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email');
    setFreelancerEmail(email);
  }, []);

  // Fetch saved project status when both projectId and freelancerEmail are available
  useEffect(() => {
    if (projectId && freelancerEmail) {
      fetchSavedProjectStatus();
    }
  }, [projectId, freelancerEmail]);

  // Fetch saved project status
  const fetchSavedProjectStatus = async () => {
    if (!freelancerEmail || !projectId) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${freelancerEmail}/is-project-saved/${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isSaved);
      } else {
        // If the request fails, default to false
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error fetching saved project status:', error);
      setIsBookmarked(false);
    }
  };

  // Toggle bookmark for the current project
  const toggleBookmark = async () => {
    if (!freelancerEmail || !projectId) {
      console.error('Freelancer email or project ID not available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${freelancerEmail}/toggle-saved-project/${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsBookmarked(data.isSaved);
          console.log(data.message);
        } else {
          console.error('Error:', data.message);
        }
      } else {
        console.error('Failed to toggle bookmark');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bid data
  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format. Expected JSON.');
        }
        const data = await response.json();
        setBidData(data);
        
        // Extract unique freelancer IDs and fetch their details
        const freelancerIds = [...new Set(data.map(bid => bid.freelancerId))];
        await fetchFreelancersData(freelancerIds);
        
      } catch (error) {
        console.error('Error fetching bid data:', error);
      }
    };
    
    if (projectId) {
      fetchBidData();
    }
  }, [projectId]);

  // Fetch freelancers data
  const fetchFreelancersData = async (freelancerIds) => {
    try {
      const freelancersMap = {};
      
      // Fetch each freelancer's data
      for (const freelancerId of freelancerIds) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${freelancerId}`);
          if (response.ok) {
            const freelancerData = await response.json();
            freelancersMap[freelancerId] = freelancerData;
          }
        } catch (error) {
          console.error(`Error fetching freelancer ${freelancerId}:`, error);
        }
      }
      
      setFreelancersData(freelancersMap);
    } catch (error) {
      console.error('Error fetching freelancers data:', error);
    }
  };

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format. Expected JSON.');
        }
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBidForm({
      ...bidForm,
      [name]: value
    });
  };

  // Validation function
  const validateBidForm = () => {
    const errors = {};
    
    if (!bidForm.offer.trim()) {
      errors.offer = 'Offer amount is required';
    } else if (!/\d/.test(bidForm.offer)) {
      errors.offer = 'Offer must contain a valid amount';
    }
    
    if (!bidForm.deliveryTime.trim()) {
      errors.deliveryTime = 'Delivery time is required';
    } else if (!/\d/.test(bidForm.deliveryTime)) {
      errors.deliveryTime = 'Delivery time must contain a valid number';
    }
    
    if (!bidForm.motivation.trim()) {
      errors.motivation = 'Motivation is required';
    } else if (bidForm.motivation.length > 200) {
      errors.motivation = 'Motivation cannot exceed 200 characters';
    }
    
    return errors;
  };

  // Submit bid function
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateBidForm();
    if (Object.keys(errors).length > 0) {
      alert('Please fix the following errors:\n' + Object.values(errors).join('\n'));
      return;
    }
    
    try {
      // Get freelancer email from localStorage
      const freelancerEmail = localStorage.getItem("email");
      if (!freelancerEmail) {
        alert("Please log in to submit a bid");
        return;
      }

      const bidDataToSubmit = {
        projectId: projectId,
        offer: bidForm.offer,
        deliveryTime: bidForm.deliveryTime,
        motivation: bidForm.motivation,
        freelancerEmail: freelancerEmail
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidDataToSubmit)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit bid');
      }

      const result = await response.json();
      console.log('Bid submitted successfully:', result);
      
      // Close modal and reset form
      setIsBidModalOpen(false);
      setBidForm({
        offer: '',
        deliveryTime: '',
        motivation: ''
      });

      // Refresh bid data to show the new bid
      const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/projects/${projectId}`);
      if (updatedResponse.ok) {
        const updatedBidData = await updatedResponse.json();
        setBidData(updatedBidData);
        
        // Fetch freelancer data for new bids
        const freelancerIds = [...new Set(updatedBidData.map(bid => bid.freelancerId))];
        await fetchFreelancersData(freelancerIds);
      }

      // Show success message
      alert('Bid submitted successfully!');

    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid: ' + error.message);
    }
  };

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <div>
      <NavBar/>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.projectName}>{projectData.name}</h1>
          <div className={styles.actions}>
            <div className={styles.bids}>
              <span>Bids :</span>
              <span className={styles.bidCount}>{bidData.length}</span>
            </div>
           
            <button 
              className={styles.bidButton}
              onClick={() => setIsBidModalOpen(true)}
            >
              Make a bid
            </button>
             <button 
              className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
              onClick={toggleBookmark}
              disabled={loading || !freelancerEmail}
            >
              <BookmarkIcon 
                className={`${styles.icon} ${isBookmarked ? styles.bookmarkedIcon : ''}`} 
                fill={isBookmarked ? "currentColor" : "none"} 
              />
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'proposals' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            Proposals
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'details' ? (
            <div className={styles.detailsContainer}>
              <div className={styles.mainDetails}>
                <div className={styles.projectDetailsSection}>
                  <h2 className={styles.sectionTitle}>Project Details</h2>
                  
                  <div className={styles.budgetAndDeadline}>
                    <div className={styles.budget}>
                      ${projectData?.minBudget?.toFixed?.(2)} - {projectData?.maxBudget?.toFixed?.(2)} {currency}
                    </div>
                    <div className={styles.deadline}>
                      <span className={styles.deadlineIcon}>⏱</span>
                      BIDDING ENDS IN {days} DAYS, {hours} HOURS
                    </div>
                  </div>
                  
                  <p className={styles.description}>
                    {projectData.description}
                  </p>
                  
                  <div className={styles.skillsRequired}>
                    <h3>Skills Required</h3>
                    <div className={styles.skillTags}>
                      {projectData.requiredSkills?.map((skill, index) => (
  <span key={index} className={styles.skillTag}>
    {skill}
    {index < projectData.requiredSkills.length - 1 && '  '}
  </span>
))}


                    </div>
                  </div>
                  
                  <div className={styles.projectId}>
                    Project ID: {projectData.id}
                  </div>
                </div>
              </div>
              
              <div className={styles.clientInfo}>
                <h2 className={styles.clientTitle}>About the client</h2>
                <div className={styles.clientLocation}>
                  <User className={styles.infoIcon} size={16} />
                  {projectData.client && (
                    <span>{projectData.client.firstName} {projectData.client.lastName}</span>
                  )}
                </div>
                <div className={styles.clientCountry}>
                  <Mail className={styles.flagIcon} size={16} />
                  {projectData.client && (
                    <span>{projectData.client.email}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.proposalsContainer}>
              {bidData && bidData.length > 0 ? (
                bidData.map((bid, index) => {
                  const freelancer = freelancersData[bid.freelancerId];
                  return (
                    <div key={index} className={styles.proposalCard}>
                      <div className={styles.freelancerInfo}>
                        <div className={styles.avatarContainer}>
                          <div className={styles.avatar}>
                            {freelancer?.profileImage ? (
                              <img src={freelancer.profileImage} alt="Profile" />
                            ) : (
                              <div className={styles.defaultAvatar}>
                                {freelancer ? `${freelancer.firstName?.[0] || ''}${freelancer.lastName?.[0] || ''}` : '?'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.freelancerDetails}>
                          <h3 className={styles.freelancerName}>
                            {freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : bid.freelancerEmail}
                          </h3>
                          <div className={styles.freelancerTitle}>
                            {freelancer?.occupation || 'Freelancer'}
                            {freelancer?.rating && (
                              <>
                                <span className={styles.rating}>({freelancer.rating.toFixed(1)})</span>
                                <span className={styles.stars}>{renderStars(freelancer.rating)}</span>
                              </>
                            )}
                          </div>
                          {freelancer?.location && (
                            <div className={styles.freelancerLocation}>
                              📍 {freelancer.location}
                            </div>
                          )}
                        </div>
                        <div className={styles.proposalPrice}>
                          <div className={styles.price}>${bid.bidAmount?.toFixed(2)} USD</div>
                          <div className={styles.deliveryTime}>in {bid.deliveryDays} days</div>
                        </div>
                      </div>
                      <div className={styles.proposalDescription}>
                        {bid.motivation}
                      </div>
                      {freelancer?.skills && (
                        <div className={styles.freelancerSkills}>
                          <strong>Skills: </strong>
                          {freelancer.skills.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={styles.noProposals}>
                  <p>No proposals have been submitted yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {isBidModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.bidModal}>
            <div className={styles.modalHeader}>
              <h2>Submit Your Bid</h2>
              <button 
                className={styles.closeModalButton}
                onClick={() => setIsBidModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitBid} className={styles.bidForm}>
              <div className={styles.formGroup}>
                <label>Enter your offer</label>
                <input
                  type="text"
                  name="offer"
                  placeholder="Example : 700USD"
                  value={bidForm.offer}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Enter the estimated delivery time (days)</label>
                <input
                  type="text"
                  name="deliveryTime"
                  placeholder="Example : 5 days"
                  value={bidForm.deliveryTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Enter your motivation</label>
                <textarea
                  name="motivation"
                  value={bidForm.motivation}
                  onChange={handleInputChange}
                  className={styles.textareaInput}
                  required
                />
                <div className={styles.characterCount}>
                  {bidForm.motivation.length}/200
                </div>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
        <Footer />
      </div>
    </div>
  );
}