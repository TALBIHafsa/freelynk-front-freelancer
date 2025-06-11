"use client"
import Footer from "../../../components/Footer/Footer";

import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar_freelancer/Navbar";
import Link from 'next/link';


export default function FreelancerProfile() {
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gig, setgig] = useState();

useEffect(() => {
  setLoading(true);
  const freelancerId = localStorage.getItem("freelancerId");
    if (freelancerId) {

  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/freelancers/${freelancerId}`)
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



   const [reviewStats, setReviewStats] = useState({
    total: 0,
    breakdown: [
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 }
    ],
    averageRating: 0
});

const [reviews, setReviews] = useState([]);

// Fetch review statistics
const fetchReviewStats = async (freelancerId) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/freelancer/${freelancerId}/stats`
        );
       
        if (response.ok) {
            const stats = await response.json();
            setReviewStats({
                total: stats.totalReviews,
                breakdown: [
                    { stars: 5, count: stats.starBreakdown[0] },
                    { stars: 4, count: stats.starBreakdown[1] },
                    { stars: 3, count: stats.starBreakdown[2] },
                    { stars: 2, count: stats.starBreakdown[3] },
                    { stars: 1, count: stats.starBreakdown[4] }
                ],
                averageRating: stats.averageRating
            });
        } else {
            console.error("Failed to fetch stats:", response.status);
        }
    } catch (error) {
        console.error("Error fetching review stats:", error);
    }
};

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
    // Helper function to render stars
const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
        <span 
            key={index} 
            style={{ 
                color: index < rating ? '#ffd700' : '#e2e8f0',
                fontSize: '16px'
            }}
        >
            ★
        </span>
    ));
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
                                ({reviewStats.averageRating.toFixed(1)}) <span style={{ color: "#f0c420" }}>{renderStars(reviewStats.averageRating.toFixed(1))}</span>
                            </div>
                            <br />
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                <Link href="/Freelancer/Projects">
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
                            }}>Email:<span style={{
                                color: "black",
                                fontWeight: "400",
                                marginLeft: "10px"
                            }}>{freelancer.email}</span></p>
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
        <Link href="/Freelancer/AddGig">
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

                       <div>
<div style={{ display: 'flex', alignItems: 'center' }}>
  <p>{reviewStats.total} Reviews</p>
</div>    <br></br>
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

<div style={{ marginTop: "16px" }}>
    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
        Average Rating: {reviewStats.averageRating.toFixed(1)} / 5.0
    </span>
</div>

    {/* Individual Reviews */}
    <div style={{ marginTop: '30px' }}>
        <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#2d3748'
        }}>
            Client Reviews
        </h3>
        
        {reviews.length > 0 ? (
            <div>
                {reviews.map((review) => (
                    <div key={review.id} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        backgroundColor: '#f7fafc'
                    }}>
                        {/* Review Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: '#2d3748',
                                    marginRight: '12px'
                                }}>
                                    {review.clientName}
                                </span>
                                <div style={{ marginRight: '12px' }}>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '12px',
                                color: '#718096'
                            }}>
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                        
                        {/* Review Comment */}
                        {review.comment && (
        <p style={{
                                color: '#4a5568',
                                lineHeight: '1.5',
                                margin: 0,
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                maxWidth: '100%'
                            }}>
                                "{review.comment}"
                            </p>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p style={{ 
                color: '#718096',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '20px'
            }}>
                No reviews yet.
            </p>
        )}
    </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
            </div>
        </div>
    );
}

const GigCard = ({ gig }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const maxLength = 100; // number of characters to show before "View More"
  const isLong = gig.description.length > maxLength;
  const shortDescription = gig.description.slice(0, maxLength);

  return (
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
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>
          {showFullDescription || !isLong ? gig.description : shortDescription + "... "}
          {isLong && (
            <span
              style={{ color: "#007bff", cursor: "pointer", fontWeight: "500" }}
            >
              {showFullDescription ? "View Less" : "View More"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
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
        <Link key={gig.gig_id} href={`/Freelancer/GigDetails/${gig.gig_id}`}>
          <div style={{ width: "300px", flexShrink: 0 }}>
            <GigCard gig={gig} />
          </div>
        </Link>
      ))}
    </div>
  </div>
);
