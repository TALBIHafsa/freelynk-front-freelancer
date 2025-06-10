"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { IoMdVolumeMute, IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BsChatDots, BsBookmarkFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotificationDropdown(false);
            }
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

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} style={{backgroundColor:"#e4e5e7"}}>
            <div className={styles.logo}>
                <Link href="/">
                    <img src="/assets/FreeLynk.png" alt="Logo" />
                </Link>
            </div>

            <div className={styles.searchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="What service are you looking for today ?"
                    className={styles.searchInput}
                />
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
                    <Link href="/home_client" onClick={() => setMobileMenuOpen(false)}>
                        <div className={styles.navItem}>
                            <AiOutlineHome size={24} />
                            <span className={styles.navLabel}>Home</span>
                        </div>
                    </Link>
                </li>

                <li style={{ position: 'relative' }} ref={notifRef}>
                    <button 
                        onClick={() => setShowNotificationDropdown(prev => !prev)} 
                        className={styles.iconButton}
                    >
                        <div className={styles.navItem}>
                            <IoMdNotificationsOutline size={24} style={{ color: "#535354" }} />
                            <span className={styles.navLabel}>Notifications</span>
                        </div>
                    </button>
                    {showNotificationDropdown && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownContent}>
                                <p style={{ color: "grey" }}>Notifications</p>
                            </div>
                            <div className={styles.dropdownFooter}>
                                <IoMdVolumeMute style={{ marginRight: '8px' }} />
                                <span style={{ color: "grey" }}>Mute notifications</span>
                            </div>
                        </div>
                    )}
                </li>
                
                <li>
                    <Link href="/SavedFreelancers" onClick={() => setMobileMenuOpen(false)}>
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
                                <Link href="/Client_profile" onClick={() => {
                                    setShowProfileDropdown(false);
                                    setMobileMenuOpen(false);
                                }}>
                                    Profile
                                </Link>
                                <User size={20} />
                            </div>
                            <div className={styles.profileItem}>
                                <button onClick={() => {
                                    alert("Logout");
                                    setShowProfileDropdown(false);
                                    setMobileMenuOpen(false);
                                }}>
                                    Logout
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