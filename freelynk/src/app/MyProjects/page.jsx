"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MyProjects.module.css";
import { Search } from "lucide-react";
import NavBar from "../../components/navbar2/Navbar";
import Footer from "../../components/Footer/Footer";

export default function MyProjects() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProject, setExpandedProject] = useState(null);

  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Project Name 1",
      budget: 100,
      currency: "$",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniamincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniamincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniamincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      skills: ["Graphic Design", "Photoshop", "Photo Editing", "Photoshop Design"],
      bids: 3,
    },
    {
      id: 2,
      name: "Project Name 2",
      budget: 100,
      currency: "$",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
      skills: ["Figma", "UI/UX", "Wireframing"],
      bids: 5,
    },
  ];

  // Filter projects
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDescription = (id) => {
    setExpandedProject((prev) => (prev === id ? null : id));
  };

  const goToDetails = (id) => {
    router.push(`/MyProjects/${id}`);
  };

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>My Projects</h1>

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
          {filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.projectInfo}>
                  <h2
                    className={styles.projectName}
                    onClick={() => goToDetails(project.id)}
                    style={{ cursor: "pointer", color: "#2f3c7e" }}
                  >
                    {project.name}
                  </h2>
                  <div className={styles.projectBudget}>
                    Budget: {project.currency}
                    {project.budget}
                  </div>
                </div>
                <div className={styles.bidCount}>{project.bids} bids</div>
              </div>

              <div className={styles.projectDescription}>
                <div className={styles.descriptionLabel}>Project description</div>
                <div className={styles.descriptionText}>
                  {expandedProject === project.id
                    ? project.description
                    : project.description.substring(0, 150) + "..."}
                  <span
                    className={styles.viewMore}
                    onClick={() => toggleDescription(project.id)}
                  >
                    {expandedProject === project.id ? " View Less" : " View More"}
                  </span>
                </div>
              </div>

              <div className={styles.skills}>
                {project.skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                    {index < project.skills.length - 1 && " • "}
                  </span>
                ))}
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
