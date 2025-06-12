"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./MyProjects.module.css";
import { Search } from "lucide-react";
import NavBar from "@/components/navbar_client/Navbar";
import Footer from "@/components/Footer/Footer";

export default function MyProjects() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProject, setExpandedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidCounts, setBidCounts] = useState({});

  // FIXED: Navigate to ProjectDetails with encoded ID
  const navigateToProject = (projectId) => {
    const encodedId = btoa(projectId.toString())
    router.push(`/client/ProjectDetails?project=${encodedId}`) // UPDATED PATH
  }

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/myProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);

        const bidCountsMap = {};
        for (const project of data) {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/project/${project.id}/bidCount`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const count = await res.json();
              bidCountsMap[project.id] = count;
            }
          } catch (err) {
            console.error(`Failed to fetch bid count for project ${project.id}`, err);
            bidCountsMap[project.id] = 0;
          }
        }
        setBidCounts(bidCountsMap);
      } catch (err) {
        console.error(err);
        ("Failed to load your projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // REMOVED: goToDetails function - using navigateToProject instead

  const toggleDescription = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>
          <div className={styles.loadingMessage}>Loading your projects...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Projects</h1>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.projectsList}>
          {filteredProjects.length === 0 ? (
            <div className={styles.noProjects}>
              {searchTerm ? "No projects match your search." : "You haven't created any projects yet."}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <div className={styles.projectInfo}>
                    <h3
                      className={styles.projectName}
                      onClick={() => navigateToProject(project.id)}
                      style={{ cursor: "pointer", color: "#f2a469" }}
                    >
                      {project.name}
                    </h3>
                    <p className={styles.projectBudget}>
                      Budget: {project.currency}
                      {project.minBudget}-{project.maxBudget} MAD
                    </p>
                  </div>
                  <div className={styles.bidsCount}>
                    {project.bidNumber??0} bids
                  </div>
                </div>

                <div className={styles.projectBody}>
                  <div className={styles.descriptionSection}>
                    <p className={styles.sectionTitle} style={{ marginBottom: "10px" }}>Project description:</p>
                    <p className={styles.description}>
                      {expandedProject === project.id
                        ? project.description
                        : `${project.description?.substring(0, 150)}${project.description?.length > 150 ? "..." : ""}`}
                      {project.description?.length > 150 && (
                        <span
                          className={styles.toggleButton}
                          onClick={() => toggleDescription(project.id)}
                        >
                          {expandedProject === project.id ? " View Less" : " View More"}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className={styles.skillsSection}>
                    {project.skills?.map((skill, index) => (
                      <span key={index} className={styles.skill}>
                        {skill}
                        {index < project.skills.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
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