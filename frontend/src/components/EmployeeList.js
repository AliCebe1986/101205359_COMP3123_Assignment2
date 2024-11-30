import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // URL'deki query parametresini almak için

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search') || '';
    fetchEmployees(searchQuery);
  }, [location]);

  const fetchEmployees = async (searchQuery = '') => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/employees/search?name=${searchQuery}`
      );
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching employees.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while deleting the employee.');
    }
  };

  return (
    <Container>
      <h2>Employee List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" className="mb-3" onClick={() => navigate('/employees/add')}>
        Add Employee
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>
                <Button variant="info" onClick={() => navigate(`/employees/${employee._id}`)}>
                  View
                </Button>{' '}
                <Button variant="warning" onClick={() => navigate(`/employees/edit/${employee._id}`)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(employee._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EmployeeList;
