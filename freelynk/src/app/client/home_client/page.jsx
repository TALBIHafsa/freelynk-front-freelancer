"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/navbar_client/Navbar";
import Footer from "@/components/Footer/Footer";
import { FiPlus, FiFolder, FiGlobe } from "react-icons/fi";
import { useRouter } from 'next/navigation'
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import RecommendedFreelancers from "../Recommanded_Freelancers/page";


export default function Home_client() {
    const [clientName, setClientName] = useState("Client");
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState(null);


    useEffect(() => {
        const storedName = localStorage.getItem("clientName");
        if (storedName) {
            setClientName(storedName);
        }
    }, []);

    useEffect(() => {
        const getClientId = async () => {
            try {
                const clientEmail = localStorage.getItem('clientEmail');
                if (clientEmail) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clients/email/${clientEmail}`);
                    if (response.ok) {
                        const client = await response.json();
                        setClientId(client.id);
                    }
                }
            } catch (error) {
                console.error('Error getting client ID:', error);
            }
        };

        getClientId();
    }, []);


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
            <HeaderSection clientName={clientName} />
            <div className="container" style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
                <ActionButtons />
    <RecommendedFreelancers clientId={clientId} />

                <CategorySection categories={categories} />
            </div>
            <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
            </div>
        </div>
    );
}

const HeaderSection = ({ clientName }) => {
    console.log("HeaderSection received clientName:", JSON.stringify(clientName));

    return (
        <div style={{ backgroundColor: "#2f3c7e", color: "white", padding: "60px 20px", marginTop: "70px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "bold", textShadow: "1px 1px 1px white" }}>
                    WELCOME, {clientName}!
                </h1>
                <br></br>
                <p>Ready to find the perfect freelancer for your next big idea? Let's make it happen.</p>
            </div>
        </div>
    );
};

const ActionButtons = () => {
    const router = useRouter();
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const buttons = [
        { icon: <FiPlus />, label: "Add a new project", path: "/client/AddProject" },
        { icon: <FiGlobe />, label: "My Projects", path: "/client/MyProjects" }
    ];

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
    const router = useRouter();

    // Map category titles to URL-friendly slugs
    const getCategorySlug = (title) => {
        const categoryMap = {
            "Web and App development": "web-development",
            "Graphic & UI/UX design": "graphic-design",
            "Writing and translation": "writing-translation",
            "Digital Marketing": "digital-marketing",
            "Video & Animation Services": "video-animation",
            "Business & Virtual Assistance": "business-assistance"
        };

        return categoryMap[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    const handleCategoryClick = () => {
        const categorySlug = getCategorySlug(title);
        router.push(`/client/Freelancer_category/${categorySlug}`);
    };

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
            onClick={handleCategoryClick}
        >
            {image && <img src={image} alt={title} style={{ width: "60px", height: "60px", marginBottom: "16px" }} />}
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{title}</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{description}</p>
        </div>
    );
};