"use client"
import { useState } from 'react';
import styles from './SavedFreelancers.module.css';
import { Search } from 'lucide-react';
import NavBar from '../../components/navbar2/Navbar';
import Footer from '../../components/Footer/Footer';

export default function SavedFreelancers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample freelancer data
  const freelancers = [
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
  ];

  // Filter freelancers based on search term
  const filteredfreelancers = freelancers.filter(freelancer => 
    freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar/>
    <div className={styles.container}>
      <h1 className={styles.title}>Saved Freelancers</h1>
      
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Search freelancer"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.freelancersContainer}>
            {filteredfreelancers.map((freelancer, index) => (
              <div key={index} className={styles.freelancerCard}>
                <div className={styles.freelancerInfo}>
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatar}></div>
                  </div>
                  <div className={styles.freelancerDetails}>
                    <h3 className={styles.freelancerName}>{freelancer.name}</h3>
                    <div className={styles.freelancerTitle}>
                      {freelancer.title}
                      <span className={styles.rating}>({freelancer.rating})</span>
                      <span className={styles.stars}>★★★★★</span>
                    </div>
                  </div>
                  <div className={styles.freelancerPrice}>
                  </div>
                </div>
                <div className={styles.freelancerDescription}>
                  {freelancer.description}
                </div>
              </div>
            ))}
          </div>
      
    </div>
    <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
      </div>
    </div>

  );
}