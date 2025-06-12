"use client"
import React, { useState, useEffect } from 'react';
import { BsBookmarkFill } from 'react-icons/bs';
import { FiBookmark } from 'react-icons/fi';
import Link from 'next/link';
import './RecommendedFreelancers.css';

const Section = ({ title, freelancers }) => (
    <div className="section">
        <h2 className="section-title">{title}</h2>
        <div className="freelancers-container">
            {freelancers.map(freelancer => (
                <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                />
            ))}
        </div>
    </div>
);

const FreelancerCard = ({ freelancer }) => {
    const [isBookmarked, setIsBookmarked] = useState(freelancer.isBookmarked || false);
    const [isLoading, setIsLoading] = useState(false);


    const handleBookmarkClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);

        try {
            if (isBookmarked) {
                // Remove bookmark using existing endpoint
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savedFreelancers/remove?clientId=${freelancer.clientId}&freelancerId=${freelancer.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.ok) {
                    setIsBookmarked(false);
                } else {
                    console.error('Failed to remove bookmark');
                }
            } else {
                // Save bookmark using existing endpoint
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savedFreelancers/save?clientId=${freelancer.clientId}&freelancerId=${freelancer.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.ok) {
                    setIsBookmarked(true);
                } else {
                    const errorText = await response.text();
                    console.error('Failed to save bookmark:', errorText);
                }
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="freelancer-card">
            <div className="card-image-container">
                <img
                    src={freelancer.firstGigUrl || "/assets/images.png"}
                    alt="freelancer"
                    className="card-image"
                />
                <button
                    onClick={handleBookmarkClick}
                    disabled={isLoading}
                    className={`bookmark-button ${isLoading ? 'loading' : ''}`}
                >
                    {isBookmarked ? (
                        <BsBookmarkFill className="bookmark-icon bookmarked" />
                    ) : (
                        <FiBookmark className="bookmark-icon" />
                    )}
                </button>
            </div>
            <div className="card-content">
                <div className="freelancer-info">
                    <img
                        src={freelancer.avatarUrl || "/assets/profile_image.jpg"}
                        alt="avatar"
                        className="avatar"
                    />
                    <Link href={`/client/Freelancer_profile/${freelancer.id}`} passHref>
                        <div className="freelancer-name">
                            {freelancer.firstName} {freelancer.lastName}
                        </div>
                    </Link>
                </div>

                <div className="freelancer-occupation">
                    {freelancer.occupation}
                </div>

                <div className="rating-container">
                    <span className="rating">
                        ★ {freelancer.rating}
                    </span>
                </div>

                <p className="freelancer-description">
                    {freelancer.description}
                </p>
            </div>
        </div>
    );
};


const RecommendedFreelancers = ({ clientId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFirstGigUrlForFreelancer = async (freelancerId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gigs/freelancers/${freelancerId}`
            );

            if (response.ok) {
                const gigs = await response.json();
                if (gigs && gigs.length > 0 && gigs[0].gigUrls && gigs[0].gigUrls.length > 0) {
                    return gigs[0].gigUrls[0];
                }
            }
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
        return null;
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!clientId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch recommendations
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommendations/freelancers?clientId=${clientId}&limit=6`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }

                const data = await response.json();

                // Fetch saved freelancer IDs using existing endpoint
                const savedResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/savedFreelancers/check?clientId=${clientId}`
                );

                let savedFreelancerIds = [];
                if (savedResponse.ok) {
                    savedFreelancerIds = await savedResponse.json();
                }

                // Normalize the freelancer data and fetch first gig URL for each
                const normalizedData = await Promise.all(
                    data.map(async (rec) => {
                        const firstGigUrl = await fetchFirstGigUrlForFreelancer(rec.freelancer.id);
                        return {
                            ...rec.freelancer,
                            description: rec.reason,
                            clientId: clientId,
                            isBookmarked: savedFreelancerIds.includes(rec.freelancer.id),
                            firstGigUrl: firstGigUrl
                        };
                    })
                );

                setRecommendations(normalizedData);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [clientId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (recommendations.length === 0) return <div className="no-recommendations">No recommendations available.</div>;

    return (
        <Section
            title="Recommended Freelancers"
            freelancers={recommendations}
        />
    );
};
export default RecommendedFreelancers;