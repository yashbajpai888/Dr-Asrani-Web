import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorSignup from './pages/DoctorSignup';
import { UserContext } from './contexts/UserContext';
const App = () => {
  const { user } = useContext(UserContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<DoctorSignup />} />
        <Route
          path="/admin"
          element={
            user && user.role === 'Admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/patient"
          element={
            user && user.role === 'Patient' ? (
              <PatientDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
