const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// Add a new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: 'Employee added successfully', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search for employees
router.get('/search', async (req, res) => {
  const { department, position } = req.query;
  try {
    const query = {};
    if (department) query.department = { $regex: department, $options: 'i' }; 
    if (position) query.position = { $regex: position, $options: 'i' }; 

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee)
      return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee updated successfully', updatedEmployee });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee)
      return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
