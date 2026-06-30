import React from 'react';
import { Container } from 'react-bootstrap';
import { Shield } from 'lucide-react';
import '../style/info_pages.css';

const Privacy = () => {
  return (
    <div className="text-page privacy-text-page">
      <Container className="text-container">
        <div className="text-header">
          <div className='text-icon'>
            <Shield  fontSize={'20px'} color="#667eea" />
          </div>          
          <h1 className="text-title">Privacy Policy</h1>
          <p className="text-subtitle">Last Updated: January 2024</p>
        </div>

        <div className="text-content">
          <section className="text-section">
            <h2 className="section-heading">1. General</h2>
            <p className="text-paragraph">
              Welcome to VocabLearn. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            <p className="text-paragraph">
              This privacy policy applies to this website and should be read together with our terms and conditions, which also set out how our site is to be used. Please read this privacy policy carefully.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">2. Information We Collect</h2>
            <h3 className="subsection-heading">2.1 Personal Information</h3>
            <p className="text-paragraph">
              We collect information you provide directly to us when you create an account, such as your name, email address, and profile picture. We also collect information you provide when you contact us for support or participate in surveys.
            </p>
            
            <h3 className="subsection-heading">2.2 Learning Data</h3>
            <p className="text-paragraph">
              We collect data about your learning progress, including completed lessons, quiz scores, practice time, and language preferences. This data helps us personalize your learning experience and track your progress.
            </p>
            
            <h3 className="subsection-heading">2.3 Usage Information</h3>
            <p className="text-paragraph">
              We automatically collect information about how you use our service, including pages visited, features used, time spent, and device information. This helps us understand user behavior and improve our services.
            </p>
            
            <h3 className="subsection-heading">2.4 Cookies and Tracking</h3>
            <p className="text-paragraph">
              We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">3. How We Use Your Information</h2>
            <p className="text-paragraph">
              We use your information to provide, maintain, and improve our language learning services. This includes personalizing lessons, tracking progress, and delivering content tailored to your learning level and preferences.
            </p>
            <p className="text-paragraph">
              We may use your contact information to send you important updates about your account, service changes, learning tips, and promotional materials. You can opt out of marketing communications at any time.
            </p>
            <p className="text-paragraph">
              We analyze usage data to understand how users interact with our platform, identify popular features, and areas for improvement. This helps us enhance the overall user experience and develop new features.
            </p>
            <p className="text-paragraph">
              We use your information to detect and prevent fraudulent activity, protect against unauthorized access, and ensure the security of our platform and all users.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">4. Data Protection</h2>
            <h3 className="subsection-heading">4.1 Security Measures</h3>
            <p className="text-paragraph">
              We implement industry-standard security measures to protect your information, including encryption, secure servers, regular security audits, and access controls. We use AES-256 encryption for data in transit and at rest.
            </p>
            
            <h3 className="subsection-heading">4.2 Your Rights</h3>
            <p className="text-paragraph">
              You have the right to access, correct, or delete your personal information. You can also object to processing of your data and request data portability. These rights are subject to applicable laws and regulations.
            </p>
            
            <h3 className="subsection-heading">4.3 Data Retention</h3>
            <p className="text-paragraph">
              We retain your information only as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">5. Third-Party Services</h2>
            <p className="text-paragraph">
              We use third-party services to operate our platform, including cloud hosting for secure data storage and processing, analytics for usage tracking and insights, payment processing services for secure transactions, and email services for communication delivery.
            </p>
            <p className="text-paragraph">
              These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">6. International Data Transfers</h2>
            <p className="text-paragraph">
              Your information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where data protection laws may differ from those of your jurisdiction.
            </p>
            <p className="text-paragraph">
              If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">7. Changes to This Privacy Policy</h2>
            <p className="text-paragraph">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-paragraph">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">8. Contact Us</h2>
            <p className="text-paragraph">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-details">
              <p><strong>Email:</strong> privacy@vocab.com</p>
              <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default Privacy;
