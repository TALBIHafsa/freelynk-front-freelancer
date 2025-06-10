"use client"

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer/Footer';
import styles from './Home.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm'; // Make sure this path is correct

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [userType, setUserType] = useState(''); // 'client' or 'freelancer'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClientButtonClick = () => {
    setShowLoginModal(true);
  };

  const handleSignUpClientButtonClick = () => {
    setUserType('client');
    setShowSignUpModal(true);
  };

  const handleSignUpFreelancerButtonClick = () => {
    setUserType('freelancer');
    setShowSignUpModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <LoginForm onClose={handleCloseModal} />
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className={styles.modalOverlay}>
          <SignUpForm
            onClose={handleCloseSignUpModal}
            userType={userType}
          />
        </div>
      )}

      <section id="home" className={styles.pageBackground}>
        <NavBar />
        <div className={styles.heroSection}>
          <h1>
            Connect with {isMobile ? '' : <br />}
            top talent {isMobile ? '' : <br />}
            for any job, {isMobile ? '' : <br />}
            instantly online.
          </h1>
          <div className={styles.buttons}>
            <button
              className={styles.clientButton}
              onClick={handleClientButtonClick}
            >
              Sign In
            </button>
            <button
              className={styles.freelancerButton}
              onClick={handleSignUpClientButtonClick}
            >
              Sign Up (client)
            </button>
            <Link href="/signup-freelancer/ProfilePage" passHref>
              <button className={styles.freelancerButton}>
                Sign Up (freelancer)
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className={styles.about}>
        <div className={styles.aboutContent}>
          <h2>Welcome to FreeLynk — Your Go-To Platform for Top Freelance Talent</h2>
          <p>Looking for the perfect freelancer to bring your vision to life? Whether you need a creative designer, skilled developer, savvy marketer, or expert writer, we've got you covered. Our platform connects you with handpicked, highly rated freelancers from around the world — so you can hire with confidence and get the job done right.
          </p>
        </div>
      </section>

      <section id="categories" className={styles.categories}>
        <div className={styles.categoriesContent}>
          <h1>Accomplish tasks across more than <span className={styles.orangeText}>32</span> different categories</h1>
        </div>
        <div className={styles.categoriesGrid}>
          <ul>
            <li>Website Design</li>
            <li>Mobile Apps</li>
            <li>Android Apps</li>
            <li>iPhone Apps</li>
            <li>Software Architecture</li>
            <li>Graphic Design</li>
            <li>Logo Design</li>
            <li>Public Relations</li>
          </ul>

          <ul>
            <li>Research Writing</li>
            <li>Article Writing</li>
            <li>Web Scraping</li>
            <li>HTML</li>
            <li>CSS</li>
            <li>HTML 5</li>
            <li>Javascript</li>
            <li>Data Processing</li>
          </ul>

          <ul>
            <li>Legal</li>
            <li>Linux</li>
            <li>Manufacturing</li>
            <li>Data Entry</li>
            <li>Content Writing</li>
            <li>Marketing</li>
            <li>Excel</li>
            <li>Ghostwriting</li>
          </ul>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <div className={styles.contactContentGrid}>
          <div className={styles.contactColumn}>
            <div className={styles.language}>
              <img src="images/globe.png" alt="Language flag" />
              <span>US (International) / English</span>
            </div>
          </div>

          <div className={styles.contactColumn}>
            <h3>FreeLancer</h3>
            <ul>
              <li>Categories</li>
              <li>Projects</li>
              <li>Freelancers</li>
            </ul>
          </div>

          <div className={styles.contactColumn}>
            <h3>About</h3>
            <ul>
              <li>About us</li>
              <li>How it works</li>
            </ul>
          </div>

          <div className={styles.contactColumn}>
            <h3>Terms</h3>
            <ul>
              <li>Privacy</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
        </div>
      </section>
      <div style={{ backgroundColor: "black" }}>
        <Footer />
      </div>
    </div>
  );
}