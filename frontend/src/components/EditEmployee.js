import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    department: '',
    position: '',
    salary: '',
    dateOfHire: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching employee data.');
      }
    };
    fetchEmployee();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/employees/${id}`, employee);
      setSuccess(true);
      setTimeout(() => navigate('/employees'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while updating employee.');
    }
  };

  return (
    <Container>
      <h2>Edit Employee</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Employee updated successfully! Redirecting...</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={employee.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            name="department"
            value={employee.department}
            onChange={handleInputChange}
            placeholder="Enter department"
            required
          />
        </Form.Group>
        <Form.Group controlId="position">
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="text"
            name="position"
            value={employee.position}
            onChange={handleInputChange}
            placeholder="Enter position"
            required
          />
        </Form.Group>
        <Form.Group controlId="salary">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            name="salary"
            value={employee.salary}
            onChange={handleInputChange}
            placeholder="Enter salary"
            required
          />
        </Form.Group>
        <Form.Group controlId="dateOfHire">
          <Form.Label>Date of Hire</Form.Label>
          <Form.Control
            type="date"
            name="dateOfHire"
            value={employee.dateOfHire.split('T')[0]} // Tarih formatını düzenliyoruz
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update Employee
        </Button>
      </Form>
    </Container>
  );
};

export default EditEmployee;
