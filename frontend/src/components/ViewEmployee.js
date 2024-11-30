import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert, Button } from 'react-bootstrap';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${id}`);
        setEmployee(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching employee data.');
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/employees')}>
          Back to Employee List
        </Button>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Employee Details</h2>
      <p>
        <strong>Name:</strong> {employee.name}
      </p>
      <p>
        <strong>Department:</strong> {employee.department}
      </p>
      <p>
        <strong>Position:</strong> {employee.position}
      </p>
      <p>
        <strong>Salary:</strong> {employee.salary}
      </p>
      <p>
        <strong>Date of Hire:</strong> {new Date(employee.dateOfHire).toLocaleDateString()}
      </p>
      <Button variant="secondary" onClick={() => navigate('/employees')}>
        Back to Employee List
      </Button>
    </Container>
  );
};

export default ViewEmployee;
