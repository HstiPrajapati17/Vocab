import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Signup = ({ navigate, onSignupDone }) => {
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
    // Pass partial user to language select — registration happens after language is picked
    try {
      setLoading(false);
      onSignupDone({ name: form.name, email: form.email, password: form.password });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h_auth_page d-flex align-items-center justify-content-center min-vh-100 py-4 py-md-5">
      <Container className="px-3 px-md-4">
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={8} lg={6} xl={5} xxl={4}>
            <div className="h_auth_back mb-3 mb-md-4 d-inline-flex align-items-center" onClick={() => navigate('home')} style={{cursor: 'pointer'}}>
              <ArrowLeft className="me-2" size={18} /> Back to Home
            </div>

            <Card className="h_auth_card border-0">
              <Card.Body className="p-4 p-sm-5 p-md-5">
                <div className="text-center mb-4 mb-md-5">
                  <div className="h_auth_owl mb-3">🦉</div>
                  <h2 className="h_auth_title mb-2">Create account</h2>
                  <p className="text-muted mb-0" style={{fontSize: '0.95rem'}}>Join millions of learners worldwide</p>
                </div>

                {error && <Alert variant="danger" className="py-2 py-md-3 small mb-4">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="h_form_group mb-3 mb-md-4">
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
                        style={{paddingLeft: '3.5rem !important'}}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="h_form_group mb-3 mb-md-4">
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
                        style={{paddingLeft: '3.5rem !important'}}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="h_form_group mb-4 mb-md-5">
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
                        style={{paddingLeft: '3.5rem !important', paddingRight: '3.5rem !important'}}
                      />
                      <span className="h_input_eye" onClick={() => setShowPass(!showPass)} style={{right: '1rem'}}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="h_btn_auth w-100 py-3 py-md-3"
                    disabled={loading}
                    style={{fontSize: '1rem', fontWeight: '700'}}
                  >
                    {loading ? 'PLEASE WAIT...' : 'CONTINUE'}
                  </Button>
                </Form>

                <div className="d-flex align-items-center my-4 my-md-5">
                  <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}></div>
                  <span className="px-3 text-muted" style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>or</span>
                  <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}></div>
                </div>
                
                <p className="text-center text-muted mb-0" style={{fontSize: '0.95rem'}}>
                  Already have an account?{' '}
                  <span className="h_auth_switch fw-bold" onClick={() => navigate('login')} style={{cursor: 'pointer'}}>
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
