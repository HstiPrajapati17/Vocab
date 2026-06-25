import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../App';
import { loginUser } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const userData = await loginUser(form.email, form.password);
      handleLogin(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
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
                  <h2 className="h_auth_title">Welcome Back!</h2>
                  <p className="text-muted small">Log in to continue your learning journey</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
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

                  <Form.Group className="h_form_group mb-3">
                    <Form.Label className="h_form_label">Password</Form.Label>
                    <div className="h_input_wrap">
                      <Lock className="h_input_icon" size={18} />
                      <Form.Control
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        className="h_form_input ps-5 pe-5"
                      />
                      <span className="h_input_eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </Form.Group>

                  <div className="text-end mb-4">
                    <span className="h_forgot_link" onClick={() => alert('Reset link sent to your email!')}>
                      Forgot password?
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="h_btn_auth w-100 fw-bold py-2"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </Form>

                <div className="h_demo_hint mt-3 p-3 rounded text-center">
                  <small className="text-muted">
                    Demo account: <strong>demo@demo.com</strong> / <strong>demo123</strong>
                  </small>
                </div>

                <hr className="my-4" />

                <p className="text-center text-muted small mb-0">
                  Don't have an account?{' '}
                  <span className="h_auth_switch" onClick={() => navigate('/signup')}>
                    Sign up for free
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

export default Login;
