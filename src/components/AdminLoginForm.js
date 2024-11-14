import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "./constants";

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    fetch("/admin/login?username=" + username + "&password=" + password).then(
      (response) => {
        if (!response.ok) setMessage("Invalid Details!!");
        return response.json();
      }
    );
    if (!(message === "Invalid Details!!")) navigate("/form");
  };
  const [message, setMessage] = useState();

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">Admin Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                name="username"
                required
              />
            </Form.Group>
            <p />
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                required
              />
            </Form.Group>

            <p />
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            <br />
            <h2>{message}</h2>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLoginForm;
