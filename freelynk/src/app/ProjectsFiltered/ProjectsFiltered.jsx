"use client"
import { useState, useEffect } from 'react';
import styles from './ProjectsFiltered.module.css';
import { BookmarkIcon, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsFiltered() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectTypeFilters, setProjectTypeFilters] = useState({
    hourlyRate: false,
    fixedPrice: false
  });
  const [fixedPriceMin, setFixedPriceMin] = useState('');
  const [fixedPriceMax, setFixedPriceMax] = useState('');
  const [hourlyRateMin, setHourlyRateMin] = useState('');
  const [projects, setProjects] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState({});
  const [loading, setLoading] = useState(false);
  const [freelancerEmail, setFreelancerEmail] = useState(null);
  const currency = "USD";

  // Get freelancer email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email');
    setFreelancerEmail(email);
  }, []);

  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch saved projects status when both projects and freelancerEmail are available
  useEffect(() => {
    if (projects.length > 0 && freelancerEmail) {
      fetchSavedProjectsStatus(projects);
    }
  }, [projects, freelancerEmail]);

  // Fetch saved projects status
  const fetchSavedProjectsStatus = async (projectsList) => {
    if (!freelancerEmail) return;
    
    try {
      const savedStatus = {};
      for (const project of projectsList) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${freelancerEmail}/is-project-saved/${project.id}`
        );
        if (response.ok) {
          const data = await response.json();
          savedStatus[project.id] = data.isSaved;
        } else {
          // If the request fails, default to false
          savedStatus[project.id] = false;
        }
      }
      setBookmarkedProjects(savedStatus);
    } catch (error) {
      console.error('Error fetching saved projects status:', error);
    }
  };

  // Clear filters function
  const clearProjectTypeFilters = () => {
    setProjectTypeFilters({
      hourlyRate: false,
      fixedPrice: false
    });
  };

  const clearFixedPriceFilters = () => {
    setFixedPriceMin('');
    setFixedPriceMax('');
  };

  const clearHourlyRateFilters = () => {
    setHourlyRateMin('');
  };

  // Toggle bookmark for a specific project
  const toggleBookmark = async (projectId) => {
    if (!freelancerEmail) {
      console.error('Freelancer email not available');
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
          setBookmarkedProjects(prev => ({
            ...prev,
            [projectId]: data.isSaved
          }));
          
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

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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

      <div className={styles.contentWrapper}>
        <div className={styles.projectsContainer}>
          {filteredProjects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.projectInfo}>
                  <Link href={`/projectDetailsFreelancer/${project.id}`}>
                    <h2 className={styles.projectName}>{project.name}</h2>
                  </Link>
                  <div className={styles.projectBudget}>
                    Budget: {project.minBudget} - {project.maxBudget} {currency}
                  </div>
                </div>
                <div className={styles.bidCount}>
                  {project.bids.length} bids
                </div>
              </div>

              <div className={styles.projectDescription}>
                <div className={styles.descriptionLabel}>Project description</div>
                <div className={styles.descriptionText}>
                  {project.description.length > 150
                    ? project.description.substring(0, 150) + '...'
                    : project.description}
                  <Link href={`/projectDetailsFreelancer/${project.id}`}>
                    <span className={styles.viewMore}>View More</span>
                  </Link>
                </div>
              </div>

              <div className={styles.skills}>
                {(Array.isArray(project.requiredSkills) 
  ? project.requiredSkills 
  : JSON.parse(project.requiredSkills || "[]")
).map((skill, index, arr) => (
  <span key={index} className={styles.skillTag}>
    {skill}
    {index < arr.length - 1 && ' • '}
  </span>
))}

              </div>

              <div className={styles.bookmarkContainer}>
                <button
                  className={`${styles.bookmarkButton} ${bookmarkedProjects[project.id] ? styles.bookmarked : ''}`}
                  onClick={() => toggleBookmark(project.id)}
                  disabled={loading || !freelancerEmail}
                >
                  <BookmarkIcon
                    className={`${styles.icon} ${bookmarkedProjects[project.id] ? styles.bookmarkedIcon : ''}`}
                    fill={bookmarkedProjects[project.id] ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}