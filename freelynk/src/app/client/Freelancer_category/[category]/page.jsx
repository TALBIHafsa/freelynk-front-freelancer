"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../SavedFreelancers/SavedFreelancers.module.css';
import { Search } from 'lucide-react';
import NavBar from "@/components/navbar_client/Navbar";
import Footer from "@/components/Footer/Footer";

export default function Freelancer_category() {
  const params = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const category = params?.category || '';

  // Map category names to display titles
  const categoryTitles = {
    'web-development': 'Web and App Development',
    'graphic-design': 'Graphic & UI/UX Design',
    'writing-translation': 'Writing and Translation',
    'digital-marketing': 'Digital Marketing',
    'video-animation': 'Video & Animation Services',
    'business-assistance': 'Business & Virtual Assistance'
  };

  useEffect(() => {
    const fetchFreelancers = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/occupation/${category}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch freelancers');
        }
        
        const data = await response.json();
        setFreelancers(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching freelancers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [category]);

  // Filter freelancers based on search term
  const filteredFreelancers = freelancers.filter(freelancer =>
    freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.skills?.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCategoryTitle = () => {
    return categoryTitles[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading freelancers...</p>
          </div>
        </div>
        <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Error loading freelancers: {error}</p>
            <button 
              onClick={() => router.back()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#f2a469',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
          </div>
        </div>
        <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>{getCategoryTitle()} Freelancers</h1>
        
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search freelancers"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredFreelancers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>No freelancers found in this category.</p>
          </div>
        ) : (
          <div className={styles.freelancersContainer}>
            {filteredFreelancers.map((freelancer) => (
              <div key={freelancer.id} className={styles.freelancerCard}>
                <div className={styles.freelancerInfo}>
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatar}>
                      {freelancer.profileImage ? (
                        <img 
                          src={freelancer.profileImage} 
                          alt={freelancer.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          backgroundColor: '#f0f0f0',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}>
                          {freelancer.name?.charAt(0)?.toUpperCase() || 'F'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.freelancerDetails}>
                    <h3 className={styles.freelancerName}>{freelancer.firstName}&nbsp;{freelancer.lastName}</h3>
                    <div className={styles.freelancerTitle}>
                      {freelancer.occupation || 'Freelancer'}
                      <span className={styles.rating}>({freelancer.rating || 0})</span>
                      <span className={styles.stars}>
                        {'★'.repeat(Math.floor(freelancer.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(freelancer.rating || 0))}
                      </span>
                    </div>
                    {freelancer.skills && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Skills: {freelancer.skills.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className={styles.freelancerPrice}>
                    {freelancer.hourlyRate && (
                      <span>${freelancer.hourlyRate}/hr</span>
                    )}
                  </div>
                </div>
                <div className={styles.freelancerDescription}>
                  {freelancer.description || freelancer.bio || 'No description available.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
        <Footer />
      </div>
    </div>
  );
}