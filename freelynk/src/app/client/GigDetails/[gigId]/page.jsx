"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import styles from './GigDetails.module.css';
import NavBar from '@/components/navbar_client/Navbar';
import Link from 'next/link';

export default function GigDetails() {
  const params = useParams();
  const id = params.gigId;
  
  const [gig, setGig] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch gig data
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/${id}`)      .then((res) => {
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
      stars.push(
        <span key={`full-${i}`} className={styles.starFilled}>★</span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={styles.starHalf}>★</span>
      );
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} className={styles.starEmpty}>☆</span>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.noDataContainer}>
          <div className={styles.noDataIcon}>📋</div>
          <h2 className={styles.noDataTitle}>No gig found</h2>
          <p className={styles.noDataText}>The gig you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const truncatedDescription = gig.description?.length > 200 
    ? gig.description.substring(0, 200) + "..."
    : gig.description;

  return (
    <div className={styles.container}>
      <NavBar/>
      <Head>
        <title>{gig.title} | Freelancer Portfolio</title>
        <meta name="description" content={gig.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.heroContent}>
              
              <h1 className={styles.gigTitle}>{gig.title}</h1>
              
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Portfolio Slider */}
              {portfolioItems.length > 0 && (
                <div className={styles.portfolioSlider}>
                  <div className={styles.sliderContainer}>
                    {portfolioItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`${styles.slide} ${
                          index === currentSlide ? styles.activeSlide : styles.hiddenSlide
                        }`}
                      >
                        <div className={styles.slideImageContainer}>
                          <img 
                            src={item.image}
                            alt={`Gig portfolio ${index + 1}`}
                            className={styles.slideImage}
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
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          onClick={nextSlide}
                          className={`${styles.navButton} ${styles.nextButton}`}
                          aria-label="Next slide"
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Slide Indicators */}
                    {portfolioItems.length > 1 && (
                      <div className={styles.slideIndicators}>
                        {portfolioItems.map((_, index) => (
                          <button
                            key={index}
                            className={`${styles.indicator} ${
                              index === currentSlide ? styles.activeIndicator : ''
                            }`}
                            onClick={() => setCurrentSlide(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Freelancer Card */}
              <div className={styles.freelancerCard}>
                <div className={styles.freelancerHeader}>
                  <div className={styles.avatarContainer}>
                    {freelancer?.profileImage ? (
                      <img 
                        src={freelancer.profileImage} 
                        alt="Freelancer Avatar" 
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {freelancer ? `${freelancer.firstName?.[0] || ''}${freelancer.lastName?.[0] || ''}` : '?'}
                      </div>
                    )}
                    <div className={styles.onlineIndicator}></div>
                  </div>
                  <div className={styles.freelancerInfo}>
                    <h3 className={styles.freelancerName}>
                      {freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Loading...'}
                    </h3>
                    <p className={styles.jobTitle}>{freelancer?.occupation || 'Freelancer'}</p>
                    <div className={styles.ratingContainer}>
                      <div className={styles.stars}>
                        {renderStars(freelancer?.rating || 0)}
                      </div>
                      <span className={styles.ratingScore}>({freelancer?.rating || 0})</span>
                    </div>
                  </div>
                </div>
                
                
                    <Link href={`/client/Freelancer_profile/${gig.freelancerId}`} passHref>
                <button className={styles.contactButton}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
                </Link>
              </div>
              {/* About Section */}
              <div className={styles.aboutSection}>
                <h2 className={styles.sectionTitle}>About this gig</h2>
                <div className={styles.descriptionContainer}>
                  <p className={styles.descriptionText}>
                    {showFullDescription ? gig.description : truncatedDescription}
                  </p>
                  {gig.description?.length > 200 && (
                    <button 
                      className={styles.toggleButton}
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {/* Tags */}
                {gig.tags && gig.tags.length > 0 && (
                  <div className={styles.tagsSection}>
                    <h4 className={styles.tagsTitle}>Skills & Expertise</h4>
                    <div className={styles.tagsContainer}>
                      {gig.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Package Details */}
              {/* <div className={styles.packageCard}>
                <h3 className={styles.packageTitle}>Package Details</h3>
                <div className={styles.packageInfo}>
                  {gig.price && (
                    <div className={styles.packageItem}>
                      <span className={styles.packageLabel}>Price</span>
                      <span className={styles.packageValue}>${gig.price}</span>
                    </div>
                  )}
                  {gig.deliveryTime && (
                    <div className={styles.packageItem}>
                      <span className={styles.packageLabel}>Delivery Time</span>
                      <span className={styles.packageValue}>{gig.deliveryTime} days</span>
                    </div>
                  )}
                  <div className={styles.packageItem}>
                    <span className={styles.packageLabel}>Revisions</span>
                    <span className={styles.packageValue}>3 included</span>
                  </div>
                </div>
                
                <div className={styles.packageFeatures}>
                  <div className={styles.feature}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Source file included</span>
                  </div>
                  <div className={styles.feature}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Commercial use</span>
                  </div>
                  <div className={styles.feature}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 Support</span>
                  </div>
                </div>

                <button className={styles.orderButton}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 8L4 6H2m5 7v6a1 1 0 001 1h10a1 1 0 001-1v-6m-9 0h8" />
                  </svg>
                  Order Now
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}