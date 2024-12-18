import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { redirect } from 'react-router-dom';
import { Context } from '../context/Context';

export function Logout() {
    const { logout } = useContext(Context);

    logout();
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 60000);

        return () => clearTimeout(timer);
    }, [history]);

    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1>Logged Out</h1>
                    <p>You have been logged out successfully.</p>
                    <p>Returning to products page in 1 minute...</p>
                    <Button variant="primary" onClick={() => window.location.href = '/'}>
                        Return to Products
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
