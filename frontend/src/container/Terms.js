import React from 'react';
import { Container } from 'react-bootstrap';
import { FileText } from 'lucide-react';
import '../style/info_pages.css';

const Terms = () => {
  return (
    <div className="text-page terms-text-page">
      <Container className="text-container">
        <div className="text-header">
          {/* <div className="text-icon">
            <FileText size={48} />
          </div> */}
          <h1 className="text-title">Terms of Service</h1>
          <p className="text-subtitle">Last Updated: January 2024</p>
        </div>

        <div className="text-content">
          <section className="text-section">
            <h2 className="section-heading">1. General</h2>
            <p className="text-paragraph">
              Welcome to VocabLearn. By accessing or using our language learning platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
            <p className="text-paragraph">
              These terms constitute a legally binding agreement between you and VocabLearn. Please read them carefully before using our services.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">2. Account Registration</h2>
            <p className="text-paragraph">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="text-paragraph">
              You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this obligation.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">3. Acceptable Use</h2>
            <p className="text-paragraph">
              You agree not to use VocabLearn for any illegal purposes, to harass others, or to violate any intellectual property rights. You may not attempt to gain unauthorized access to our systems or interfere with the operation of our services.
            </p>
            <p className="text-paragraph">
              Prohibited activities include but are not limited to: using automated tools to access the service, reproducing or distributing content without permission, and engaging in any conduct that could disable or impair the service.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">4. Intellectual Property</h2>
            <p className="text-paragraph">
              All content on VocabLearn is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
            </p>
            <p className="text-paragraph">
              The VocabLearn name, logo, and all related graphics, service names, and trademarks are the property of VocabLearn and may not be used without our prior written consent.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">5. Subscription and Payment</h2>
            <p className="text-paragraph">
              VocabLearn offers both free and premium subscription plans. Premium subscriptions are billed on a recurring basis (monthly or annually). You agree to provide accurate payment information and authorize us to charge your chosen payment method.
            </p>
            <p className="text-paragraph">
              You can cancel your subscription at any time through your account settings. Cancellation will take effect at the end of the current billing period. Refunds are not provided for partial billing periods.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">6. Service Availability</h2>
            <p className="text-paragraph">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. We reserve the right to suspend or terminate the service for maintenance, updates, or other operational reasons.
            </p>
            <p className="text-paragraph">
              We are not responsible for any loss or damage resulting from service interruptions or unavailability. We may modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">7. User Content</h2>
            <p className="text-paragraph">
              Any content you submit to VocabLearn, including forum posts, reviews, or learning progress, remains your property. However, you grant us a license to use, display, and distribute such content for the purpose of providing and improving our services.
            </p>
            <p className="text-paragraph">
              You represent and warrant that you own all rights to the content you submit or that you have the necessary permissions to grant the license described above.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">8. Termination</h2>
            <p className="text-paragraph">
              We reserve the right to terminate or suspend your account at our discretion, with or without notice, for violation of these terms or for any other reason. Upon termination, your right to use the service will immediately cease.
            </p>
            <p className="text-paragraph">
              You may also terminate your account at any time by contacting our support team. Upon termination, we will delete or anonymize your personal information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">9. Limitation of Liability</h2>
            <p className="text-paragraph">
              To the maximum extent permitted by law, VocabLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
            <p className="text-paragraph">
              In no event shall our total liability to you for all claims exceed the amount you paid to us in the twelve months preceding the claim.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">10. Privacy Policy</h2>
            <p className="text-paragraph">
              Your use of VocabLearn is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. Please review our Privacy Policy carefully.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">11. Changes to Terms</h2>
            <p className="text-paragraph">
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms. We will notify you of material changes by posting the new terms on our website and updating the "Last Updated" date.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">12. Governing Law</h2>
            <p className="text-paragraph">
              These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the courts of the United States.
            </p>
          </section>

          <section className="text-section">
            <h2 className="section-heading">13. Contact Us</h2>
            <p className="text-paragraph">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="contact-details">
              <p><strong>Email:</strong> legal@vocab.com</p>
              <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default Terms;
