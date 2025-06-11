"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './NavBar.module.css';
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { BsChatDots, BsBookmarkFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function NavBar() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const notifRef = useRef();
    const profileRef = useRef();
    const mobileMenuRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        // get role from localStorage when NavBar mounts
        const savedRole = localStorage.getItem("role");
        setRole(savedRole);
    }, []);

    const homeLink = role === "FREELANCER" ? "/Freelancer/home" : "/home_client";
    const profile = role === "FREELANCER" ? "/Freelancer/profile" : "/Client_profile";
    const saved = role === "FREELANCER" ? "/Freelancer/SavedProjects" : "/Freelancer/SavedFreelancers";

    useEffect(() => {
        const handleClickOutside = (event) => {
            
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                !event.target.classList.contains(styles.hamburger)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent multiple clicks
        
        setIsLoggingOut(true);
        
        try {
            // Clear all user data from localStorage
            const keysToRemove = [
                'role',
                'token',
                'email'
               
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Clear sessionStorage as well (if you're using it)
            sessionStorage.clear();
            
            // Close dropdowns
            setShowProfileDropdown(false);
            setMobileMenuOpen(false);
            
            // Reset component state
            setRole(null);
            
            // Redirect to login page
            router.push('/');
            
            // Optional: Show success message
            setTimeout(() => {
                alert('Logged out successfully');
            }, 100);
            
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} style={{backgroundColor:"#e4e5e7"}}>
            <div className={styles.logo}>
                <Link href={homeLink}>
                    <img src="/assets/FreeLynk.png" alt="Logo" />
                </Link>
            </div>

            <button 
                className={styles.hamburger} 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <ul className={`${styles.iconNav} ${mobileMenuOpen ? styles.mobileActive : ''}`} ref={mobileMenuRef}>
                <li>
                    <Link href={homeLink} onClick={() => setMobileMenuOpen(false)}>
                        <div className={styles.navItem}>
                            <AiOutlineHome size={24} />
                            <span className={styles.navLabel}>Home</span>
                        </div>
                    </Link>
                </li>

                
                
                <li>
                    <Link href={saved} onClick={() => setMobileMenuOpen(false)}>
                        <div className={styles.navItem}>
                            <BsBookmarkFill size={20} />
                            <span className={styles.navLabel}>Saved</span>
                        </div>
                    </Link>
                </li>

                <li style={{ position: 'relative' }} ref={profileRef}>
                    <button onClick={() => setShowProfileDropdown(prev => !prev)} className={styles.iconButton}>
                        <div className={styles.navItem}>
                            <FaUser size={20} color='#535354' />
                            <span className={styles.navLabel}>Profile</span>
                        </div>
                    </button>
                    {showProfileDropdown && (
                        <div className={styles.dropdownMenuProfile}>
                            <div className={styles.profileItem}>
                                <Link href={profile} onClick={() => {
                                    setShowProfileDropdown(false);
                                    setMobileMenuOpen(false);
                                }}>
                                    Profile
                                </Link>
                                <User size={20} />
                            </div>
                            <div className={styles.profileItem}>
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    style={{ 
                                        opacity: isLoggingOut ? 0.6 : 1,
                                        cursor: isLoggingOut ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                                <LogOut size={20} />
                            </div>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}