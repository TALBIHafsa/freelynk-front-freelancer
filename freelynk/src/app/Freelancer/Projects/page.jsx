"use client"
import { useState, useEffect } from 'react';
import styles from './Projects.module.css';
import { Search } from 'lucide-react';
import NavBar from '../../../components/navbar_freelancer/Navbar';
import Footer from '../../../components/Footer/Footer';
import Link from 'next/link';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ongoing');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Replace this with actual freelancer ID (from auth context, props, or local storage)
 // State to store freelancer ID from localStorage
  const [freelancerId, setFreelancerId] = useState(null);

  // Get freelancer ID from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFreelancerId = localStorage.getItem("freelancerId");
      setFreelancerId(storedFreelancerId);
    }
  }, []);
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/byFreelancer/${freelancerId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchProjects();
    }
  }, [freelancerId]);

  // Filter projects based on search term and active tab
  const filteredProjects = projects.filter(project => 
    (project.status.toLowerCase()  === activeTab) &&
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMarkAsDone = async (projectId) => {
    try {
      // You'll need to implement this API endpoint in your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/byFreelancer/${freelancerId}/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state to reflect the change
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === projectId 
              ? { ...project, status: 'done' }
              : project
          )
        );
      } else {
        throw new Error('Failed to mark project as done');
      }
    } catch (err) {
      console.error('Error marking project as done:', err);
      setError('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar/>
        <div className={styles.container}>
          <div className={styles.loading}>Loading projects...</div>
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
        <NavBar/>
        <div className={styles.container}>
          <div className={styles.error}>Error: {error}</div>
        </div>
        <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
      <div className={styles.container}>
        <h1 className={styles.title}>Projects</h1>
        
        <div className={styles.tabsContainer}>
          <div 
            className={`${styles.tab} ${activeTab === 'ongoing' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'done' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('done')}
          >
            Done
          </div>
        </div>
        
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search project"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.projectsList}>
          {filteredProjects.length === 0 ? (
            <div className={styles.noProjects}>
              No projects found for the selected tab.
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <div className={styles.projectInfo}>
                    <Link href={`/Freelancer/projectDetails/${project.id}`}>

                    <h2 className={styles.projectName}>{project.name}</h2>
                    </Link>
                    <div className={styles.projectBudget}>
                      Budget: {project.currency || '$'}{project.minBudget} - {project.maxBudget}
                    </div>
                  </div>
                  {project.status.toLowerCase()  === 'ongoing' && (
                    <button 
                      className={styles.markAsDoneButton}
                      onClick={() => handleMarkAsDone(project.id)}
                    >
                      Mark as done
                    </button>
                  )}
                  {project.status.toLowerCase()  !== 'ongoing' && (
                    <div className={styles.bidCount}>
                      {project.bids.length || 0} bids
                    </div>
                  )}
                </div>
                
                <div className={styles.projectDescription}>
                  <div className={styles.descriptionLabel}>Project description</div>
                  <div className={styles.descriptionText}>
                    {project.description && project.description.length > 150 
                      ? project.description.substring(0, 150) + '...' 
                      : project.description || 'No description available'}
                      <Link href={`/Freelancer/projectDetails/${project.id}`}>
                    <span className={styles.viewMore}>View More</span>
                    </Link>
                  </div>
                </div>
                
                <div className={styles.skills}>
                  {project.skills && project.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                      {index < project.skills.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
        <Footer />
      </div>
    </div>
  );
}