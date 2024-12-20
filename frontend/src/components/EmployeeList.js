import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({ department: '', position: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const department = query.get('department') || '';
    const position = query.get('position') || '';
    fetchEmployees({ department, position });
  }, [location]);

  const fetchEmployees = async ({ department, position }) => {
    try {
      const query = [];
      if (department) query.push(`department=${department}`);
      if (position) query.push(`position=${position}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/search${queryString}`);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching employees.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = [];
    if (searchParams.department) query.push(`department=${searchParams.department}`);
    if (searchParams.position) query.push(`position=${searchParams.position}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    navigate(`/employees${queryString}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

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
      <Form className="mb-4" onSubmit={handleSearch}>
        <Form.Group controlId="department" className="mb-3">
          <Form.Label>Search by Department</Form.Label>
          <Form.Control
            type="text"
            name="department"
            value={searchParams.department}
            onChange={handleInputChange}
            placeholder="Enter department"
          />
        </Form.Group>
        <Form.Group controlId="position" className="mb-3">
          <Form.Label>Search by Position</Form.Label>
          <Form.Control
            type="text"
            name="position"
            value={searchParams.position}
            onChange={handleInputChange}
            placeholder="Enter position"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
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
