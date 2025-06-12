"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './ProjectDetails.module.css';
import { BookmarkIcon, User, Mail } from 'lucide-react';
import NavBar from '@/components/navbar_client/Navbar';
import Footer from '@/components/Footer/Footer';
import Swal from 'sweetalert2';

export default function ProjectDetails() {
  const searchParams = useSearchParams();
  const encodedProject = searchParams.get('project');
  const actualId = encodedProject ? atob(encodedProject) : null;

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalsError, setProposalsError] = useState(null);

const handleAccept = async (bidId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/${bidId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to accept bid');

Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Signup successful!',
});
    // REFRESH project and proposals data here:
    if (actualId) {
      // Fetch updated project
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${actualId}?id=${actualId}`)
        .then(res => res.json())
        .then(data => setProjectData(data))
        .catch(console.error);

      // Fetch updated proposals
      setProposalsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/project/${actualId}/bids`)
        .then(res => res.json())
        .then(data => setProposals(data))
        .catch(console.error)
        .finally(() => setProposalsLoading(false));
    }

  } catch (error) {
    console.error(error);
    alert("An error occurred while accepting the bid.");
  }
};



  useEffect(() => {
    if (actualId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${actualId}?id=${actualId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch project');
          return res.json();
        })
        .then((data) => {
          setProjectData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching project:', err);
          setLoading(false);
        });
    }
  }, [actualId]);



  useEffect(() => {
    if (!actualId) return;

    const fetchProposals = async () => {
      setProposalsLoading(true);
      setProposalsError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bids/project/${actualId}/bids`);
        if (!res.ok) throw new Error('Failed to fetch proposals');
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setProposalsError('Failed to load proposals. Please try again.');
      } finally {
        setProposalsLoading(false);
      }
    };

    fetchProposals();
  }, [actualId]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>Loading project details...</div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>Project not found or invalid ID.</div>
      </div>
    );
  }

  const { name, minBudget, maxBudget, bindingDeadline, description, client, requiredSkills, bidNumber } = projectData;

  const deadline = new Date(bindingDeadline);
  const now = new Date();
  const diff = Math.max(0, deadline.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return (
    <div className={styles.containermain}>
      <NavBar />
      <div className={styles.mainContent}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.projectName}>{name}</h1>
          <div className={styles.actions}>
            <div className={styles.bids}>
              <span>{bidNumber ?? 0}&nbsp;Bids</span>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'proposals' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            Proposals
          </button>
        </div>
        <div className={styles.content}>
          {activeTab === 'details' ? (
            <div className={styles.detailsContainer}>
              <div className={styles.mainDetails}>
                <div className={styles.projectDetailsSection}>
                  <h2 className={styles.sectionTitle}>Project Details</h2>
                  <div className={styles.budgetAndDeadline}>
                    <div className={styles.budget}>
                      {minBudget.toFixed(2)} - {maxBudget.toFixed(2)} MAD
                    </div>
                    <div className={styles.deadline}>
                      ⏱ BIDDING ENDS IN {days} DAYS {hours} HOURS
                    </div>
                  </div>
                  <p className={styles.description}>{description}</p>
                  <div className={styles.skillsRequired}>
                    <h3>Skills Required</h3>
                    <div className={styles.skillTags}>
                      {requiredSkills?.map((skill, i) => (
                        <span key={i} className={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.clientInfo}>
                <h2 className={styles.clientTitle}>About the client</h2>
                <div className={styles.clientLocation}>
                  <User className={styles.infoIcon} size={16} />
                  <span>{client?.firstName}</span>
                </div>
                <div className={styles.clientCountry}>
                  <Mail className={styles.flagIcon} size={16} />
                  <span>{client?.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.proposalsContainer}>
              {proposalsLoading ? (
                <div className={styles.loadingMessage}>Loading proposals...</div>
              ) : proposalsError ? (
                <div className={styles.errorMessage}>{proposalsError}</div>
              ) : proposals.length === 0 ? (
                <div className={styles.noProposals}>No proposals submitted yet.</div>
              ) : (
                proposals.map((proposal, index) => (
                  <div key={proposal.id || index} className={styles.proposalCard}>
                    <div className={styles.freelancerInfo}>
                      <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                        </div>
                      </div>
                      <div className={styles.freelancerDetails}>
                        <h3 className={styles.freelancerName}>
                          {proposal.freelancer?.firstName} {proposal.freelancer?.lastName}
                        </h3>
                        {proposal.freelancer?.email && (
                          <p className={styles.freelancerEmail}>{proposal.freelancer.email}</p>
                        )}
                      </div>
                      <div className={styles.proposalPrice}>
                        <div className={styles.price}>
                          {proposal.bidAmount?.toFixed(2) || '0.00'} MAD
                        </div>
                        <div className={styles.deliveryTime}>
                          in {proposal.deliveryDays || 'N/A'} days
                        </div>
                   <button
  className={`${styles.acceptButton} ${
    proposal.status === 'ACCEPTED'
      ? styles.accepted
      : proposal.status === 'REJECTED'
      ? styles.rejected
      : ''
  }`}
  disabled={proposal.status === 'ACCEPTED' || proposal.status === 'REJECTED'}
  onClick={() => handleAccept(proposal.id)}
>
  {proposal.status === 'ACCEPTED'
    ? 'Accepted'
    : proposal.status === 'REJECTED'
    ? 'Rejected'
    : 'Accept'}
</button>

                      </div>
                    </div>
                    <div className={styles.proposalDescription}>
                      {proposal.motivation || 'No description provided.'}

                    </div>
                    {proposal.submittedAt && (
                      <div className={styles.proposalMeta}>
                        <small>Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}</small>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      </div>
      <div className={styles.footerWrapper}>
        <Footer />
      </div>
    </div>
  );
}
