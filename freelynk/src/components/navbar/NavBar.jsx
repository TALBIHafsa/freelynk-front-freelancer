"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
    // State to track if navbar should be transparent or solid
    const [scrolled, setScrolled] = useState(false);
    // State to track if mobile menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Handle scroll event to change navbar style
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Clean up
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);
    
    // Function to handle smooth scrolling to sections
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu after clicking a link
            setIsMenuOpen(false);
        }
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                <Link href="/">
                    <img src="/images/logo.png" alt="Logo" />
                </Link>
            </div>
      
            <ul className={styles.navLinks}>
                <li>
                    <a 
                        href="#about" 
                        onClick={(e) => scrollToSection(e, 'about')}
                    >
                        About
                    </a>
                </li>
                <li>
                    <a 
                        href="#categories" 
                        onClick={(e) => scrollToSection(e, 'categories')}
                    >
                        Categories
                    </a>
                </li>
                <li>
                    <a 
                        href="#contact" 
                        onClick={(e) => scrollToSection(e, 'contact')}
                    >
                        Contact
                    </a>
                </li>
            </ul>
            
            {/* Mobile menu toggle button */}
            <div className={styles.menuToggle}>
                <input 
                    type="checkbox" 
                    checked={isMenuOpen}
                    onChange={toggleMenu}
                />
                <span></span>
                <span></span>
                <span></span>
                
                {/* Mobile menu - only rendered when isMenuOpen is true */}
                {isMenuOpen && (
                    <ul className={styles.mobileMenu}>
                        <li>
                            <a 
                                href="#about" 
                                onClick={(e) => scrollToSection(e, 'about')}
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#categories" 
                                onClick={(e) => scrollToSection(e, 'categories')}
                            >
                                Categories
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                onClick={(e) => scrollToSection(e, 'contact')}
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}