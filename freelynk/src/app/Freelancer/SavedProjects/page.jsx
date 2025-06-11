"use client"
import { useEffect, useState } from 'react';
import styles from './SavedProjects.module.css';
import { Search, Trash2 } from 'lucide-react';
import NavBar from '../../../components/navbar_freelancer/Navbar';
import Footer from '../../../components/Footer/Footer';
import Link from 'next/link';

export default function SavedProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  
 useEffect(() => {
  const email = localStorage.getItem("email");
  if (email) {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${email}/saved-projects`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Saved Projects not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log('Saved Projects data:', data);
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching saved projects:", error);
        setError(error.message);
        setLoading(false);
      });
  } else {
    setError("No email found in localStorage");
    setLoading(false);
  }
}, []);

const handleDeleteProject = async (projectId) => {
  const email = localStorage.getItem("email");
  if (!email) {
    alert("User email not found");
    return;
  }

  setDeletingProjectId(projectId);
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/${email}/toggle-saved-project/${projectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove project from saved');
    }

    const result = await response.json();
    
    if (result.success) {
      // Remove the project from the local state
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectId)
      );
      alert(result.message || "Project removed from saved successfully");
    } else {
      throw new Error(result.message || 'Failed to remove project');
    }
  } catch (error) {
    console.error('Error removing project:', error);
    alert('Failed to remove project from saved');
  } finally {
    setDeletingProjectId(null);
  }
};
 
  const filteredProjects = projects?.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <NavBar/>
        <div className={styles.container}>
          <div>Loading saved projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar/>
        <div className={styles.container}>
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
    <div className={styles.container}>
      <h1 className={styles.title}>Saved Projects</h1>
      
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
      
      {filteredProjects && filteredProjects.length === 0 ? (
        <div className={styles.noProjects}>No saved projects found.</div>
      ) : (
        <div className={styles.projectsList}>
          {filteredProjects?.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.projectInfo}>
                    <Link href={`/Freelancer/projectDetails/${project.id}`}>
                      <h2 className={styles.projectName}>{project.name}</h2>
                    </Link>
                    <div className={styles.projectBudget}>Budget: {project.minBudget} - {project.maxBudget} MAD</div>
                </div>
                <div className={styles.projectActions}>
                  <div className={styles.bidCount}>
                    {project.bids.length} bids
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deletingProjectId === project.id}
                    title="Remove from saved"
                  >
                    {deletingProjectId === project.id ? (
                      <span className={styles.spinner}>⟳</span>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className={styles.projectDescription}>
                <div className={styles.descriptionLabel}>Project description</div>
                <div className={styles.descriptionText}>
                  {project.description.length > 150 
                    ? project.description.substring(0, 150) + '...' 
                    : project.description}
                    <Link href={`/Freelancer/projectDetails/${project.id}`}>
                      <span className={styles.viewMore}>View More</span>
                    </Link>
                </div>
              </div>
              
              <div className={styles.skills}>
                  {(() => {
                    try {
                      const skills = project.requiredSkills || '[]';
                      return skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                          {index < skills.length - 1 && ' • '}
                        </span>
                      ));
                    } catch (error) {
                      console.error('Error parsing skills:', error);
                      return <span className={styles.skillTag}>No skills listed</span>;
                    }
                  })()}
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