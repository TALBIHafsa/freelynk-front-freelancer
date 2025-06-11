"use client";

import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar_freelancer/Navbar";
import styles from "./BrowseProjects.module.css";
import ProjectsFiltered from "../ProjectsFiltered/ProjectsFiltered";

export default function Home_Freelancer() {
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
  const email = localStorage.getItem("email");
    if (email) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/email/${email}`)  // <-- your backend URL and endpoint
        .then((res) => {
          if (!res.ok) {
            throw new Error("Freelancer not found");
          }
          return res.json();
        })
        .then((data) => setFreelancer(data))
        .catch((error) => {
          console.error("Error fetching freelancer data:", error);
        });
    }
  }, []);

  return (
    <div>
      <NavBar />
      <HeaderSection freelancer={freelancer} />
      <div className={styles.container2}>
        <h2 style={{ padding: "6px 6px" }}>Recommended Projects</h2>
        <ProjectsFiltered />
      </div>
    </div>
  );
}

const HeaderSection = ({ freelancer }) => (
  <div
    style={{
      backgroundColor: "#2f3c7e",
      color: "white",
      padding: "60px 20px",
      marginTop: "70px",
    }}
  >
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", textShadow: "1px 1px 1px white" }}>
        WELCOME, {freelancer ? freelancer.lastName.toUpperCase() : "MR. X"}!
      </h1>
      <p style={{ fontSize: "16px", marginTop: "10px" }}>
        Ready to turn your skills into success? Let’s connect you with clients who
        need your talent.
      </p>
    </div>
  </div>
);
