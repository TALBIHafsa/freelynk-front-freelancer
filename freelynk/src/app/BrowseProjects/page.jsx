"use client"
import { useState } from 'react';
import styles from './BrowseProjects.module.css';
import { BookmarkIcon,Search, Filter } from 'lucide-react';
import NavBar from "../../components/navbar2/Navbar";
import Footer from '../../components/Footer/Footer';
import ProjectsFiltered from '../ProjectsFiltered/ProjectsFiltered';

export default function BrowseProjects() {

  return (
    <div>
      <NavBar/>
    <div className={styles.container}>
      <h1 className={styles.title}>Browse Projects</h1>
      <ProjectsFiltered/>
    </div>
    <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
     <Footer />
      </div>
    </div>

  );
}