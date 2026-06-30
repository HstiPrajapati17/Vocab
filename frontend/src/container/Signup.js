import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../App';

const Signup = () => {
  const navigate = useNavigate();
  const { handleSignupComplete } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      handleSignupComplete({ name: form.name, email: form.email, password: form.password });
      navigate('/language-select');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h_auth_page d-flex align-items-center justify-content-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <div className="h_auth_back mb-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <ArrowLeft className="me-2" size={16} /> Back to Home
            </div>

            <Card className="h_auth_card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="h_auth_logo">V</div>
                  <h2 className="h_auth_title">Create Account</h2>
                  <p className="text-muted small">Join millions of learners worldwide</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="h_form_group mb-3">
                    <Form.Label className="h_form_label">Your Name</Form.Label>
                    <div className="h_input_wrap">
                      <User className="h_input_icon" size={18} />
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        className="h_form_input ps-5"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="h_form_group mb-3">
                    <Form.Label className="h_form_label">Email</Form.Label>
                    <div className="h_input_wrap">
                      <Mail className="h_input_icon" size={18} />
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="h_form_input ps-5"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="h_form_group mb-4">
                    <Form.Label className="h_form_label">Password</Form.Label>
                    <div className="h_input_wrap">
                      <Lock className="h_input_icon" size={18} />
                      <Form.Control
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        className="h_form_input ps-5 pe-5"
                      />
                      <span className="h_input_eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="h_btn_auth w-100 fw-bold py-2"
                    disabled={loading}
                  >
                    
                    {loading ? 'Please wait...' : 'Continue'}
                  </Button>
                </Form>

                <hr className="my-4" />
                <p className="text-center text-muted small mb-0">
                  Already have an account?{' '}
                  <span className="h_auth_switch" onClick={() => navigate('/log')}>
                    Log in
                  </span>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
