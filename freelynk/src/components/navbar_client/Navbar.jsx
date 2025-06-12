"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BsBookmarkFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import useNotificationSocket from "../../hooks/useNotificationSocket";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [clientId, setClientId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const router = useRouter();

  const notifRef = useRef();
  const profileRef = useRef();
  const mobileMenuRef = useRef();
   const handleLogout = () => {
    localStorage.clear(); 
    router.push("/home");
  };

  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 Nouvelle notification reçue:', notification);
    setNotifications((prev) => [notification, ...prev]);

    if (Notification.permission === 'granted') {
      new Notification('Nouvelle notification', {
        body: notification.message,
        icon: '/assets/FreeLynk.png'
      });
    }
  }, []);

  // Utiliser le hook WebSocket
  const { reconnect } = useNotificationSocket(clientId, handleNewNotification);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains(styles.hamburger)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Demander permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch clientId and notifications
  useEffect(() => {
    const clientEmail = localStorage.getItem("clientEmail");
    if (!clientEmail) {
      setLoadingNotifs(false);
      return;
    }

    async function fetchClientAndNotifications() {
      try {
        const clientRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clients/email/${clientEmail}`);
        if (!clientRes.ok) {
          setLoadingNotifs(false);
          return;
        }
        const clientData = await clientRes.json();
        setClientId(clientData.id);

        const notifRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${clientData.id}`);
        if (!notifRes.ok) {
          setLoadingNotifs(false);
          return;
        }
        const notifData = await notifRes.json();
        setNotifications(notifData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifs(false);
      }
    }

    fetchClientAndNotifications();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      style={{ backgroundColor: "#e4e5e7" }}
    >
      <div className={styles.logo}>
        <Link href="/client/home_client">
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

      <ul
        className={`${styles.iconNav} ${mobileMenuOpen ? styles.mobileActive : ""}`}
        ref={mobileMenuRef}
      >
        <li>
          <Link href="/client/home_client" onClick={() => setMobileMenuOpen(false)}>
            <div className={styles.navItem}>
              <AiOutlineHome size={24} />
              <span className={styles.navLabel}>Home</span>
            </div>
          </Link>
        </li>

        <li style={{ position: "relative" }} ref={notifRef}>
          <button
            onClick={() => setShowNotificationDropdown((prev) => !prev)}
            className={styles.iconButton}
            aria-label="Toggle notifications"
          >
            <div className={styles.navItem} style={{ position: "relative" }}>
              <IoMdNotificationsOutline size={24} style={{ color: "#535354" }} />
              {!loadingNotifs && notifications.some((n) => !n.read) && (
                <span className={styles.notificationDot}></span>
              )}
              <span className={styles.navLabel}>Notifications</span>
            </div>
          </button>

          {showNotificationDropdown && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownContent}>
                {loadingNotifs && <p style={{ color: "grey" }}>Loading...</p>}
                {!loadingNotifs && notifications.length === 0 && (
                  <p style={{ color: "grey" }}>No notifications</p>
                )}
                {!loadingNotifs &&
                  [...notifications]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: notif.read ? "white" : "#eef6ff",
                          fontWeight: notif.read ? "normal" : "600",
                        }}
                      >
                        <p>{notif.message}</p>
                        <small style={{ color: "#888" }}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </small>
                      </div>
                    ))}
                {!loadingNotifs && notifications.length > 5 && (
                  <div style={{ padding: "8px", textAlign: "center" }}>
                  </div>
                )}
              </div>
            </div>
          )}
        </li>

        <li>
          <Link href="/client/SavedFreelancers" onClick={() => setMobileMenuOpen(false)}>
            <div className={styles.navItem}>
              <BsBookmarkFill size={20} />
              <span className={styles.navLabel}>Saved</span>
            </div>
          </Link>
        </li>

        <li style={{ position: "relative" }} ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className={styles.iconButton}
            aria-label="Toggle profile menu"
          >
            <div className={styles.navItem} onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogOut size={20} color="#535354" />
              <span className={styles.navLabel}>Logout</span>
            </div>

          </button>

        </li>
      </ul>
    </nav>
  );
}