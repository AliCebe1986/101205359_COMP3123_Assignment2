import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import ViewEmployee from './components/ViewEmployee';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Employee Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/employees">Employees</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
      <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/employees" /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employees/search" element={<EmployeeList />} /> 
          <Route path="/employees/add" element={isAuthenticated ? <AddEmployee /> : <Navigate to="/" />} />
          <Route path="/employees/edit/:id" element={isAuthenticated ? <EditEmployee /> : <Navigate to="/" />} />
          <Route path="/employees/:id" element={<ViewEmployee />} /> 
      </Routes>
      </Container>
    </Router>
  );
};

export default App;
