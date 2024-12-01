import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import ViewEmployee from './components/ViewEmployee';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [searchInput, setSearchInput] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); 
    window.location.href = '/';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/employees?search=${searchInput}`;
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
                  <Nav.Item>
                    <Form className="d-flex" onSubmit={(e) => handleSearchSubmit(e)}>
                      <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <Button variant="outline-success" type="submit">
                        Search
                      </Button>
                    </Form>
                  </Nav.Item>
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
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/employees" /> : <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/employees"
            element={isAuthenticated ? <EmployeeList /> : <Navigate to="/" />}
          />
          <Route
            path="/employees/add"
            element={isAuthenticated ? <AddEmployee /> : <Navigate to="/" />}
          />
          <Route
            path="/employees/edit/:id"
            element={isAuthenticated ? <EditEmployee /> : <Navigate to="/" />}
          />
          <Route
            path="/employees/:id"
            element={isAuthenticated ? <ViewEmployee /> : <Navigate to="/" />}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
