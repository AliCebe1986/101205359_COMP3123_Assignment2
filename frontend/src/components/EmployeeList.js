import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmployees(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${id}`);
      setSelectedEmployee(response.data);
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleCloseModal = () => setShowModal(false);

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
                <Button variant="info" onClick={() => handleView(employee._id)}>
                  View
                </Button>{' '}
                <Button variant="warning" onClick={() => handleEdit(employee._id)}>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <div>
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Position:</strong> {selectedEmployee.position}</p>
              <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
              <p><strong>Date of Hire:</strong> {new Date(selectedEmployee.dateOfHire).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeList;
