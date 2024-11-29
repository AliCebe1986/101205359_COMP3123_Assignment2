import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [dateOfHire, setDateOfHire] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/employees', {
        name,
        department,
        position,
        salary,
        dateOfHire,
      });
      setSuccess(true);
      setTimeout(() => navigate('/employees'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Container>
      <h2>Add Employee</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Employee added successfully! Redirecting...</Alert>}
      <Form onSubmit={handleAddEmployee}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="position">
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="salary">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="dateOfHire">
          <Form.Label>Date of Hire</Form.Label>
          <Form.Control
            type="date"
            value={dateOfHire}
            onChange={(e) => setDateOfHire(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Add Employee
        </Button>
      </Form>
    </Container>
  );
};

export default AddEmployee;
