"use client"
import Footer from "../../components/Footer/Footer";

import { useState, useEffect } from "react";
import NavBar from "../../components/navbar2/Navbar";
import Link from 'next/link';


export default function FreelancerProfile() {
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gig, setgig] = useState();

useEffect(() => {
  setLoading(true);
  const token = localStorage.getItem("token");
    if (token) {

  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/myGigs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("gigs not found");
      }
      return res.json();
    })
    .then((data) => {
          console.log('Response data:', data);

      if (Array.isArray(data)) {
        setgig(data);
      } else {
        console.error('Invalid response:', data);
        setError('Invalid response from server');
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching freelancer gigs:", error);
      setError(error.message);
      setLoading(false);
    });}
    else {
    setError("No token found in localStorage");
    setLoading(false);}
}, []);


   useEffect(() => {
  const email = localStorage.getItem("email");
  if (email) {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancers/email/${email}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Freelancer not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log('Freelancer data:', data); // Log the response data
        setFreelancer(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching freelancer data:", error);
        setError(error.message);
        setLoading(false);
      });
  } else {
    setError("No email found in localStorage");
    setLoading(false);
  }
}, []);

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Mock data for gigs - you can replace this with actual gigs data from your API
    const freelancerGigs = gig;



    // Generate review stats based on freelancer data
    const reviewStats = {
        total: freelancer?.reviews?.length || 0,
        breakdown: [
            { stars: 5, count: Math.floor((freelancer?.reviews?.length || 0) * 0.8) },
            { stars: 4, count: Math.floor((freelancer?.reviews?.length || 0) * 0.15) },
            { stars: 3, count: Math.floor((freelancer?.reviews?.length || 0) * 0.03) },
            { stars: 2, count: Math.floor((freelancer?.reviews?.length || 0) * 0.01) },
            { stars: 1, count: Math.floor((freelancer?.reviews?.length || 0) * 0.01) }
        ],
        ratings: [
            { category: "Communication level", score: freelancer?.rating || 4.9 },
            { category: "Quality of delivery", score: freelancer?.rating || 4.9 },
            { category: "Value of delivery", score: freelancer?.rating || 4.9 }
        ]
    };

    const reviews = freelancer?.reviews || [];

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }
        if (hasHalfStar) {
            stars.push('☆');
        }
        while (stars.length < 5) {
            stars.push('☆');
        }
        
        return stars.join('');
    };

    if (loading) {
        return (
            <div>
                <NavBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    Loading freelancer profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '18px',
                    color: '#ff6b6b'
                }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!freelancer) {
        return (
            <div>
                <NavBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    No freelancer data found
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            
            <div style={{
                width: "100%",
                maxWidth: "1400px",
                margin: isMobile ? "100px auto 0" : "140px auto 0",
                padding: isMobile ? "20px 15px" : isTablet ? "30px 20px" : "37px 30px",
                backgroundColor: "rgb(230, 230, 230)",
                borderRadius: "10px",
                boxSizing: "border-box"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    flexWrap: isTablet ? "wrap" : "nowrap",
                    gap: isMobile ? "20px" : "0",
                    backgroundColor: "rgb(243, 244, 243)",
                    padding: "20px",
                    borderRadius: "8px"
                }}>
                    {/* Left side - Profile info */}
                    <div style={{
                        display: "flex",
                        width: isMobile ? "100%" : isTablet ? "100%" : "45%",
                        marginBottom: isMobile || isTablet ? "20px" : "0"
                    }}>
                        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px'
  }}
>
  <div
    style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      border: '2px solid #e0e0e0'
    }}
  >
    {freelancer?.profileImage ? (
      <img
        src={freelancer.profileImage}
        alt="Profile"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: '50%'
        }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '30px',
          textTransform: 'uppercase'
        }}
      >
        {freelancer
          ? `${freelancer.firstName?.[0] || ''}${freelancer.lastName?.[0] || ''}`
          : '?'}
      </div>
    )}
  </div>
</div>


                        <div style={{
                            textAlign: "left",
                            flex: 1,
                            marginTop: "5px"
                        }}>
                            <h2 style={{
                                margin: "2px 0",
                                color: "#666769",
                                fontSize: isMobile ? "18px" : "20px"
                            }}>{freelancer.firstName} {freelancer.lastName}</h2>
                            <p style={{
                                marginRight: "8px",
                                color: "#878990",
                                fontSize: "12px",
                                display: "inline-block"
                            }}>{freelancer.occupation}</p>
                            <div style={{
                                fontWeight: "bold",
                                color: "#666769",
                                marginBottom: "12px",
                                display: "inline-block"
                            }}>
                                ({freelancer.rating}) <span style={{ color: "#f0c420" }}>{renderStars(freelancer.rating)}</span>
                            </div>
                            <br />
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                <Link href="/Projects">
                                <button style={{
                                    backgroundColor: "rgb(47, 60, 126, 0.83)",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    width: isMobile ? "100%" : "110px"
                                }}>
                                    Projects
                                </button></Link>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Line - Hidden on mobile */}
                    {!isMobile && (
                        <div style={{
                            width: "1px",
                            backgroundColor: "#ccc",
                            height: isMobile ? "1px" : isTablet ? "2px" : "110px",
                            marginRight: isTablet ? "0" : "30px",
                            display: isMobile ? "none" : isTablet ? "none" : "block"
                        }}></div>
                    )}

                    {/* Horizontal Line - Only on mobile and tablet */}
                    {(isMobile || isTablet) && (
                        <div style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: "#ccc",
                            margin: "10px 0"
                        }}></div>
                    )}

                    {/* Right side - Additional info */}
                    <div style={{
                        marginTop: isMobile ? "0" : isTablet ? "0" : "20px",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "20px" : isTablet ? "50px" : "150px",
                        width: isMobile ? "100%" : isTablet ? "100%" : "auto",
                        flex: isMobile ? "1" : isTablet ? "1" : "1"
                    }}>
                        <div>
                            <p style={{
                                color: "#f2a469",
                                fontWeight: "600"
                            }}>Location:<span style={{
                                color: "black",
                                fontWeight: "400",
                                marginLeft: "10px"
                            }}>{freelancer.location}</span></p>
                            <p style={{
                                color: "#f2a469",
                                fontWeight: "600",
                                marginTop: isMobile ? "15px" : "30px"
                            }}>Experience:<span style={{
                                color: "black",
                                fontWeight: "400",
                                marginLeft: "10px"
                            }}>{freelancer.yearsOfExp} years</span></p>
                        </div>
                        <div>
                            <p style={{
                                color: "#f2a469",
                                fontWeight: "600",
                                marginBottom: isMobile ? "15px" : "30px"
                            }}>Languages:<span style={{
                                color: "black",
                                fontWeight: "400",
                                marginLeft: "10px"
                            }}>{freelancer.languages}</span></p>
                            <p style={{
                                color: "#f2a469",
                                fontWeight: "600"
                            }}>Phone:<span style={{
                                color: "black",
                                fontWeight: "400",
                                marginLeft: "10px"
                            }}>{freelancer.phone}</span></p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    display: "flex",
                    backgroundColor: "#e6e6e6",
                    fontFamily: "Arial, sans-serif",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginTop: "30px",
                    width: "100%",
                    maxWidth: "1400px"
                }}>
                    {/* Main Content Area */}
                    <div style={{
                        backgroundColor: "#f3f4f3",
                        borderRadius: "8px",
                        padding: "25px",
                        flex: "1",
                        minWidth: "300px",
                        maxWidth: "1400px",
                    }}>
                        {/* About Me Section */}
                        <div style={{ marginBottom: "30px" }}>
                            <h2 style={{
                                color: "#3c4396",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginBottom: "15px"
                            }}>About me</h2>

                            <p style={{
                                color: "#333",
                                lineHeight: "1.6",
                                fontSize: "15px",
                                textAlign: "justify"
                            }}>
                                {freelancer.description}
                            </p>
                        </div>

                        <hr style={{
                            border: "none",
                            height: "1px",
                            backgroundColor: "#e0e0e0",
                            margin: "20px 0"
                        }} />

                        {/* Skills Section */}
                        <div>
                            <h2 style={{
                                color: "#3c4396",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginBottom: "20px"
                            }}>Skills</h2>

                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px"
                            }}>
                                {freelancer.skills.map((skill, index) => (
                                    <div key={index} style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "20px",
                                        padding: "8px 20px",
                                        color: "#444",
                                        fontSize: "14px",
                                        backgroundColor: "white"
                                    }}>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <hr style={{
                            border: "none",
                            height: "1px",
                            backgroundColor: "#e0e0e0",
                            margin: "20px 0"
                        }} />
                        
                        <div>
    <h2 style={{
        color: "#3c4396",
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "15px",
        justifyContent: "space-between",
        alignItems: "center"
    }}>
        My Gigs
        <Link href="/AddGig">
            <button 
                style={{
                    backgroundColor: "rgb(47, 60, 126, 0.83)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                            marginLeft: "20px",
                    fontSize: "14px"
                }}
            >
                Add a Gig
            </button>
        </Link>
    </h2>
    {gig && <Section gigs={gig} />}

</div>
                        
                        <hr style={{
                            border: "none",
                            height: "1px",
                            backgroundColor: "#e0e0e0",
                            margin: "20px 0"
                        }} />

                        <h2 style={{
                            fontSize: "22px",
                            fontWeight: "bold",
                            color: "#3c4396",
                            marginBottom: "4px",
                        }}>Reviews</h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#718096",
                            marginBottom: "16px"
                        }}>{reviewStats.total} Reviews</p>
                        
                        {/* Rating Breakdown */}
                        <div style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: "40px",
                            marginBottom: "32px",
                        }}>
                            <div style={{
                                width: window.innerWidth < 768 ? "100%" : "50%", 
                                height: "150px"
                            }}>
                                {reviewStats.breakdown.map((item) => (
                                    <div key={item.stars} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px"
                                    }}>
                                        <span style={{
                                            width: "64px",
                                            fontSize: "14px",
                                            color: "#4a5568"
                                        }}>{item.stars} Stars</span>

                                        <div style={{
                                            flex: 1,
                                            marginLeft: "8px",
                                            marginRight: "8px"
                                        }}>
                                            <div style={{
                                                backgroundColor: "#e2e8f0",
                                                height: "8px",
                                                borderRadius: "4px",
                                                width: "100%",
                                                position: "relative"
                                            }}>
                                                <div style={{
                                                    backgroundColor: "#4a5568",
                                                    height: "8px",
                                                    borderRadius: "4px",
                                                    width: `${reviewStats.total > 0 ? (item.count / reviewStats.total) * 100 : 0}%`
                                                }}></div>
                                            </div>
                                        </div>

                                        <span style={{
                                            fontSize: "14px",
                                            color: "#718096",
                                            width: "40px"
                                        }}>({item.count})</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                width: window.innerWidth < 768 ? "100%" : "50%",
                                marginTop: window.innerWidth < 768 ? "24px" : "0"
                            }}>
                               

                                
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        {reviews.length > 0 ? (
                            <div style={{
                                backgroundColor: "#f3f4f3",
                                padding: "24px",
                                borderRadius: "8px",
                                maxWidth: "800px",
                                fontFamily: "Arial, sans-serif"
                            }}>
                                {reviews.map((review, index) => (
                                    <div key={index} style={{
                                        marginBottom: "32px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "flex-start"
                                        }}>
                                            <div style={{
                                                backgroundColor: "#d1d5db",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                marginRight: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    style={{ color: "#4a5568" }}
                                                >
                                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <div style={{
                                                    fontWeight: "500",
                                                    color: "#2d3748"
                                                }}>Client Review</div>

                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginTop: "4px"
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        color: "black"
                                                    }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p style={{
                                            fontSize: "14px",
                                            color: "#4a5568",
                                            marginTop: "12px",
                                            marginBottom: "30px"
                                        }}>{review.content || "Great work and professional service!"}</p>

                                        <div style={{
                                            borderTop: "1px solid #e2e8f0",
                                            margin: "24px 0"
                                        }}></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#718096",
                                fontSize: "16px"
                            }}>
                                No reviews yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
            </div>
        </div>
    );
}

const GigCard = ({ gig }) => (
  <div style={{
    minWidth: "260px",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }}>
    <div style={{ height: "150px", position: "relative" }}>
      <img src={gig.gigUrls[0]} alt="Gig photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ padding: "16px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
        {gig.title}
      </h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>{gig.description}</p>
    </div>
  </div>
);
const Section = ({ gigs }) => (
  <div style={{ marginTop: "20px" }}>
    <div style={{
      display: "flex",
      gap: "30px",
      paddingBottom: "10px",
      overflowX: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none"
    }}>
      {gigs?.map(gig => (
        <div key={gig.gig_id} style={{ width: "300px", flexShrink: 0 }}>
          <GigCard key={gig.gig_id} gig={gig} />
        </div>
      ))}
    </div>
  </div>
);
