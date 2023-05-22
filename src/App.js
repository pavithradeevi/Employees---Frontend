

import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import "./App.css";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


const ENDPOINT = 'http://localhost:3001';

function App() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Fetch employees initially
    fetchEmployees();

    // Listen for socket event to update employees
    socket.on('updateEmployees', fetchEmployees);

    return () => {
      socket.disconnect();
    };
  }, []);

  const addEmployee = async () => {
    try {

      const newEmployee = {
        name: "",
        salary: ""
      };
      const response = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
        
      });
  

  if (response.ok) {
    
    alert('Space added successfully');
    fetchEmployees();
  } else {
    console.error('Error adding employee:', response.status);
  }
} catch (error) {
  console.error('Error adding employee:', error);
}
};

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const updateEmployee = async (id, updatedEmployee) => {
    try {
      await fetch(`http://localhost:3001/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });
  
      // Employee updated successfully, show alert message
      // alert('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleNameChange = (id, e) => {
    const updatedEmployees = employees.map((employee) => {
      if (employee._id === id) {
        return { ...employee, name: e.target.value };
      }
      return employee;
    });
    setEmployees(updatedEmployees);
  };

  const handleSalaryChange = (id, e) => {
    const updatedEmployees = employees.map((employee) => {
      if (employee._id === id) {
        return { ...employee, salary: parseInt(e.target.value) };
      }
      return employee;
    });
    setEmployees(updatedEmployees);
  };

  const handleBlur = (id, updatedEmployee) => {
    updateEmployee(id, updatedEmployee);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/employees/${id}`, {
        method: 'DELETE',
      });
  
      // Employee deleted successfully, show alert message
      alert('Employee deleted successfully');
  
      // Refresh the employee list
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className='App'>
      <h1>Employee Salary Dashboard</h1>
      <button onClick={addEmployee}>Add Employee</button> 
      <table className='table'>
        <thead>
          <tr>
            <th className='th'>Name</th>
            <th className='th'>Salary</th>
          </tr>
        </thead>
        <tbody>
        {employees.map((employee) => (
  <tr key={employee._id}>
    <td className='td'>
      <input
        type="text"
        value={employee.name}
        onChange={(e) => handleNameChange(employee._id, e)}
        onBlur={() => handleBlur(employee._id, { name: employee.name })}
      />
    </td>
    <td className='td'>
      <input
        type="number"
        value={employee.salary}
        onChange={(e) => handleSalaryChange(employee._id, e)}
        onBlur={() => handleBlur(employee._id, { salary: employee.salary })}
      />
    </td>
    <td>
      <button onClick={() => handleDelete(employee._id)}>
        {/* <DeleteIcon /> */}
        <DeleteOutlineIcon/>

      </button>
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
