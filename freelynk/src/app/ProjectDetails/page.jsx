"use client"
import { useState } from 'react';
import styles from './ProjectDetails.module.css';
import Image from 'next/image';
import { BookmarkIcon, User, Mail } from 'lucide-react';
import NavBar from '../../components/navbar2/Navbar';
import Footer from '../../components/Footer/Footer';

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState('details');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Dummy data for the project
  const projectData = {
    projectName: 'Project Name',
    budget: { min: 250.00, max: 750.00, currency: 'USD' },
    biddingEndsIn: { days: 2, hours: 23 },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    keyOfferings: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit. Sed do eiusmod tempor incididunt',
      'Labore et dolore magna aliqua. Ut enim ad minim veniam',
      'Suis nostrud exercitation ullamco laboris nisi ut aliquip'
    ],
    skillsRequired: ['Website Design', 'Lead Generation'],
    projectId: '38456450',
    clientInfo: {
      name: 'Jhon Smith',
      email: 'Jhon@gmail.com',
    },
    proposals: [
      {
        name: 'Freelancer Name',
        title: 'Full Stack dev',
        rating: 5.0,
        price: 50.00,
        currency: 'USD',
        deliveryTime: '7 days',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        name: 'Freelancer Name',
        title: 'Full Stack dev',
        rating: 5.0,
        price: 50.00,
        currency: 'USD',
        deliveryTime: '7 days',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    ]
  };

  return (
    <div>
      <NavBar/>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.projectName}>{projectData.projectName}</h1>
        <div className={styles.actions}>
          <div className={styles.bids}>
            <span>Bids</span>
            <span className={styles.bidCount}>12</span>
          </div>
          <button 
            className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <BookmarkIcon className={`${styles.icon} ${isBookmarked ? styles.bookmarkedIcon : ''}`} fill={isBookmarked ? "currentColor" : "none"} />
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
                    ${projectData.budget.min.toFixed(2)} - {projectData.budget.max.toFixed(2)} {projectData.budget.currency}
                  </div>
                  <div className={styles.deadline}>
                    <span className={styles.deadlineIcon}>⏱</span>
                    BIDDING ENDS IN {projectData.biddingEndsIn.days} DAYS {projectData.biddingEndsIn.hours} HOURS
                  </div>
                </div>
                
                <p className={styles.description}>
                  {projectData.description}
                </p>
                
                <div className={styles.keyOfferings}>
                  <h3>Key Offerings:</h3>
                  <ul>
                    {projectData.keyOfferings.map((offering, index) => (
                      <li key={index}>{offering}</li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.skillsRequired}>
                  <h3>Skills Required</h3>
                  <div className={styles.skillTags}>
                    {projectData.skillsRequired.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.projectId}>
                  Project ID: {projectData.projectId}
                </div>
              </div>
            </div>
            
            <div className={styles.clientInfo}>
              <h2 className={styles.clientTitle}>About the client</h2>
              <div className={styles.clientLocation}>
                <User className={styles.infoIcon} size={16} />
                <span>{projectData.clientInfo.name}</span>
              </div>
              <div className={styles.clientCountry}>
                <Mail className={styles.flagIcon} size={16} />
                <span>{projectData.clientInfo.email}</span>
              </div>
              
            </div>
          </div>
        ) : (
          <div className={styles.proposalsContainer}>
            {projectData.proposals.map((proposal, index) => (
              <div key={index} className={styles.proposalCard}>
                <div className={styles.freelancerInfo}>
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatar}></div>
                  </div>
                  <div className={styles.freelancerDetails}>
                    <h3 className={styles.freelancerName}>{proposal.name}</h3>
                    <div className={styles.freelancerTitle}>
                      {proposal.title}
                      <span className={styles.rating}>({proposal.rating})</span>
                      <span className={styles.stars}>★★★★★</span>
                    </div>
                  </div>
                  <div className={styles.proposalPrice}>
                    <div className={styles.price}>${proposal.price.toFixed(2)} {proposal.currency}</div>
                    <div className={styles.deliveryTime}>in {proposal.deliveryTime}</div>
                  </div>
                </div>
                <div className={styles.proposalDescription}>
                  {proposal.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
      </div>
    </div>

  );
}