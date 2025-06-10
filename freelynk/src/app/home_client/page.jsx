"use client";
import { useState , useEffect } from "react";
import NavBar from "../../components/navbar2/Navbar";
import Footer from "../../components/Footer/Footer";
import { FiPlus, FiFolder, FiGlobe } from "react-icons/fi";
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function Home_client() {
    const freelancers = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: "Freelancer Name",
        rating: 5.0,
        reviews: 209,
        description: "Brief description about the freelancer",
        price: 35,
        category: "WEBSITE"
    }));

    const categories = [
        {
            image: "/assets/web-development.png",
            title: "Web and App development",
            description: "Build custom websites, web apps, and mobile solutions tailored to your needs.",
        },
        {
            image: "/assets/design.png",
            title: "Graphic & UI/UX design",
            description: "Create eye-catching visuals and user-friendly designs that elevate your brand.",
        },
        {
            image: "/assets/translation.png",
            title: "Writing and translation",
            description: "Get professional content, from blog posts to accurate translations and edits.",
        },
        {
            image: "/assets/digital-marketing.png",
            title: "Digital Marketing",
            description: "Boost your online presence with targeted strategies and optimized campaigns.",
        },
        {
            image: "/assets/video-editing.png",
            title: "Video & Animation Services",
            description: "Engage your audience with creative videos, animations, and editing services.",
        },
        {
            image: "/assets/digital-assistant.png",
            title: "Business & Virtual Assistance",
            description: "Streamline your operations with expert support in admin, research, and more.",
        },
    ];

    return (
        <div className="font-inter" style={{ backgroundColor: "#e6e6e6", minHeight: "100vh" }}>
            <NavBar />
            <HeaderSection />
            <div className="container" style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
                <ActionButtons />
                <Section title="Recommended for you" freelancers={freelancers} />
                <CategorySection categories={categories} />
            </div>
            <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
            </div>
        </div>
    );
}

const HeaderSection = () => (
    <div style={{ backgroundColor: "#2f3c7e", color: "white", padding: "60px 20px", marginTop: "70px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", textShadow: "1px 1px 1px white" }}>WELCOME, MR. X!</h1>
            <p style={{ fontSize: "16px", marginTop: "10px" }}>
                Ready to find the perfect freelancer for your next big idea? Let's make it happen.
            </p>
        </div>
    </div>
);

const ActionButtons = () => {
    const router = useRouter();
    const [windowWidth, setWindowWidth] = useState(0);

    // Initialize window width on client side
    useEffect(() => {
        setWindowWidth(window.innerWidth);
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const buttons = [
        { icon: <FiPlus />, label: "Add a new project", path: "/AddProject" },
        { icon: <FiGlobe />, label: "My Projects", path: "/MyProjects" }
    ];

    // Determine layout based on window width
    const isSmallScreen = windowWidth < 640;

    return (
        <div style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: "16px",
            marginTop: "20px",
            padding: "0 16px",
            width: "100%"
        }}>
            {buttons.map((btn, index) => (
                <button
                    key={index}
                    onClick={() => router.push(btn.path)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        backgroundColor: "#f2a469",
                        color: "white",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        width: isSmallScreen ? "100%" : "auto",
                        flex: isSmallScreen ? "none" : "1"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e89355"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f2a469"}
                >
                    <span style={{ display: "flex", alignItems: "center" }}>{btn.icon}</span>
                    <span>{btn.label}</span>
                </button>
            ))}
        </div>
    );
};
const Section = ({ title, freelancers }) => (
    <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px", color: "#4a4a4a" }}>{title}</h2>
        <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            paddingBottom: "10px",
            scrollBehavior: "smooth",
            msOverflowStyle: "none", // IE
            scrollbarWidth: "none"
        }}>
            {freelancers.map(freelancer => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
        </div>
    </div>
);

const FreelancerCard = ({ freelancer }) => (
    <div style={{
        minWidth: "240px",
        backgroundColor: "#e6e6e6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
        <div style={{ height: "140px", position: "relative" }}>
            <img src="/assets/Client.jpg" alt="freelancer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button style={{
                position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none"
            }}>
                <img src="/assets/bookmark.png" style={{ width: "20px" }} />
            </button>
        </div>
        <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <img src="/assets/profile_image.jpg" alt="avatar" style={{
                    width: "24px", height: "24px", borderRadius: "50%", marginRight: "8px"
                }} />
                <span style={{ fontWeight: "500" }}>{freelancer.name}</span>
                <span style={{ marginLeft: "auto", fontSize: "14px", color: "#777" }}>
                &#x2605; {freelancer.rating} ({freelancer.reviews})
                </span>
            </div>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>{freelancer.description}</p>
            <p style={{ fontSize: "14px", color: "#444" }}>From ${freelancer.price}</p>
        </div>
    </div>
);

const CategorySection = ({ categories }) => (
    <div style={{ marginTop: "50px" }}>
        <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "#4a4a4a" }}>Choose a category</h2>
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px"
        }}>
            {categories.map((cat, idx) => (
                <CategoryCard key={idx} {...cat} />
            ))}
        </div>
    </div>
);

const CategoryCard = ({ image, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                backgroundColor: isHovered ? "#2f3c7e" : "#d4d4d4",
                color: isHovered ? "white" : "#535354",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {image && <img src={image} alt={title} style={{ width: "60px", height: "60px", marginBottom: "16px" }} />}
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{title}</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{description}</p>
        </div>
    );
};
