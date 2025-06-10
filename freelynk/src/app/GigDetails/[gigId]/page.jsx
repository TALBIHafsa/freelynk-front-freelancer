"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import styles from './GigDetails.module.css';
import NavBar from '../../../components/navbar2/Navbar';

export default function GigDetails() {
  const params = useParams();
  const id = params.gigId; // Get gig ID from URL parameters
  
  const [gig, setGig] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch gig data
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("No token found in localStorage");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gig not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log('Gig data:', data);
        setGig(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gig data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch freelancer data based on gig owner
  useEffect(() => {
    if (!gig || !gig.freelancerId) return;
    
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${gig.freelancerId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Freelancer not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log('Freelancer data:', data);
        setFreelancer(data);
      })
      .catch((error) => {
        console.error("Error fetching freelancer data:", error);
        setError(error.message);
      });
  }, [gig]);

  // Portfolio items from gig images
  const portfolioItems = gig?.gigUrls?.map((url, index) => ({
    id: index + 1,
    image: url,
  })) || [];

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? portfolioItems.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === portfolioItems.length - 1 ? 0 : prev + 1
    );
  };

  // Helper function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading gig details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '18px',
          color: '#ff6b6b'
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div>
        <NavBar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '18px',
          color: '#666'
        }}>
          No gig data found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavBar/>
      <Head>
        <title>{gig.title} | Freelancer Portfolio</title>
        <meta name="description" content={gig.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{borderRadius:"8px"}}>
          <div style={{backgroundColor:"white",color:"#2f3c7e",fontSize:"35px",padding:"30px"}}>
            <p style={{marginLeft:"30px",fontWeight:"700"}}>{gig.title}</p>
          </div>

          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatarContainer}>
                {freelancer?.profileImage ? (
                  <img 
                    src={freelancer.profileImage} 
                    alt="Freelancer Avatar" 
                    width={80} 
                    height={80}
                    className={styles.avatar}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '24px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {freelancer ? `${freelancer.firstName?.[0] || ''}${freelancer.lastName?.[0] || ''}` : '?'}
                  </div>
                )}
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.freelancerName}>
                  {freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Loading...'}
                </h1>
                <p className={styles.jobTitle}>{freelancer?.occupation || 'Freelancer'}</p>
                <div className={styles.ratingContainer}>
                  <p className={styles.ratingScore}>({freelancer?.rating || 0})</p>
                  <div className={styles.stars}>
                    <span style={{ color: "#f0c420" }}>
                      {renderStars(freelancer?.rating || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className={styles.contactButton}>
              View Profil
            </button>
          </div>

          {portfolioItems.length > 0 && (
            <div className={styles.portfolioSlider}>
              {portfolioItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`${styles.slide} ${
                    index === currentSlide ? styles.activeSlide : styles.hiddenSlide
                  }`}
                >
                  <div className={styles.slideImageContainer}>
                    <img 
                      style={{width:"100%",height:"100%",objectFit:"cover"}} 
                      src={item.image}
                      alt={`Gig image ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
              
              {portfolioItems.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className={`${styles.navButton} ${styles.prevButton}`}
                    aria-label="Previous slide"
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className={`${styles.navButton} ${styles.nextButton}`}
                    aria-label="Next slide"
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          <div className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>About this gig</h2>
            <div className={styles.projectDescription}>
              <p className={styles.descriptionText}>
                {gig.description}
              </p>
              
              {/* Additional gig details */}
              <div style={{ marginTop: '20px' }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  {gig.price && (
                    <div>
                      <span style={{ fontWeight: '600', color: '#f2a469' }}>Price: </span>
                      <span>${gig.price}</span>
                    </div>
                  )}
                  {gig.deliveryTime && (
                    <div>
                      <span style={{ fontWeight: '600', color: '#f2a469' }}>Delivery Time: </span>
                      <span>{gig.deliveryTime} days</span>
                    </div>
                  )}
                  {gig.category && (
                    <div>
                      <span style={{ fontWeight: '600', color: '#f2a469' }}>Category: </span>
                      <span>{gig.category}</span>
                    </div>
                  )}
                </div>
                
                {/* Skills/Tags if available */}
                {gig.tags && gig.tags.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ color: '#2f3c7e', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                      Tags
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {gig.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            border: '1px solid #ddd'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}