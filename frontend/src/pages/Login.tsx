import React, { useContext, useState } from 'react';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap'; import { Context } from '../context/Context';
import { redirect } from 'react-router-dom';

export function Login() {
  const { user, login } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Login error response:", errorData);
        setError(errorData.message || 'Failed to login');
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      console.log('Login successful:', data);

      login(data.username, data.email, data.userType);

      redirect('/products');

      setEmail('');
      setPassword('');
      setIsSubmitting(false);
      setError('');

    } catch (e: any) {
      console.error("Login exception:", e);
      setError('An error occurred: ' + e.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid="md" className="d-flex justify-content-center align-items-center min-vh-1000">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="text-center mb-4">
            <h2>Login</h2>
            <p className="text-muted">Please enter your credentials to log in</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
