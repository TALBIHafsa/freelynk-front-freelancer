
import Head from 'next/head';
import NavBar from '../../components/navbar_freelancer/Navbar';
import Footer from '../../components/Footer/Footer';

export default function TC() {
    return (
        <>
            <NavBar></NavBar>
            <div>
                <Head>
                    <title >Terms and Conditions - FreeLynk</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                <div style={{
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: 1.6,
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: '#f6f6f6'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h1 style={{
                            marginTop: "100px",
                            color: '#222',
                            fontSize: '24px'
                        }}>Terms and Conditions</h1>

                        <div style={{
                            marginBottom: '20px',
                            fontWeight: 'bold'
                        }}>Effective Date: 19/04/2025</div>

                        <div style={{ marginBottom: '25px' }}>
                            Welcome to FreeLynk.com. These Terms and Conditions ("Terms") govern your use of our website and services.
                            <p style={{ marginTop: '10px' }}>By accessing or using our platform, you agree to these Terms. If you do not agree, please do not use our services.</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>1. Definitions</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>"Platform" refers to our website and services provided under FreeLynk.</li>
                                <li style={{ marginBottom: '10px' }}>"Client" refers to any user who posts projects and hires freelancers.</li>
                                <li style={{ marginBottom: '10px' }}>"User" refers to both Clients and Freelancers.</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>2. Eligibility</div>
                            <p style={{ marginTop: '10px' }}>You must be at least 18 years old and legally capable of entering into binding contracts. You agree to provide accurate information during registration and keep it updated.</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>3. User Accounts</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>You are responsible for maintaining the confidentiality of your account.</li>
                                <li style={{ marginBottom: '10px' }}>You agree not to share your account or allow unauthorized access.</li>
                                <li style={{ marginBottom: '10px' }}>We reserve the right to suspend or terminate accounts that violate our terms or policies.</li>
                            </ul>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>4. Freelancer and Client Responsibilities</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <p style={{ marginBottom: '20px' }}>Clients:</p>
                                <li style={{ marginBottom: '10px' }}>Must provide clear, lawful project descriptions.</li>
                                <li style={{ marginBottom: '10px' }}>Agree to pay freelancers on agreed terms.</li>
                                <p style={{ marginBottom: '20px' }}>Freelancers:</p>
                                <li style={{ marginBottom: '10px' }}>Must provide honest profiles and deliver work professionally.
                                </li>
                                <li style={{ marginBottom: '10px' }}>Agree not to engage in plagiarism or fraud.
                                </li>
                            </ul>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>5. Prohibited Activities</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <p style={{ marginBottom: '20px' }}>Users may not : </p>
                                <li style={{ marginBottom: '10px' }}>Violate any applicable laws</li>
                                <li style={{ marginBottom: '10px' }}>Post misleading, offensive, or false content</li>
                                <li style={{ marginBottom: '10px' }}>Discriminate, harass, or spam others</li>
                                <li style={{ marginBottom: '10px' }}>Circumvent platform policies</li>
                            </ul>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>6. Platform Changes</div>
                            <p>We may update or modify features, suspend access, or discontinue the service at any time without prior notice.</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>7. Limitation of Liability</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>Disputes between users</li>
                                <li style={{ marginBottom: '10px' }}>Loss of data, profits, or reputations</li>
                                <li style={{ marginBottom: '10px' }}>Third-party service failures</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>8. Termination</div>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>Violates these Terms</li>
                                <li style={{ marginBottom: '10px' }}>Engages in harmful behavior</li>
                                <li style={{ marginBottom: '10px' }}>Misuses the platform in any way</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>9. Governing Law</div>
                            <p>These Terms are governed by the laws of Morocco. Any disputes shall be resolved under the jurisdiction of the courts of Morocco.</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>10. Contact Us</div>
                            <p>Email: support@freelynk.com<br />Address: INPT</p>
                        </div>

                    </div>
                    <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
                <Footer />
            </div>
                </div>
            </div>
        </>
    );
}
