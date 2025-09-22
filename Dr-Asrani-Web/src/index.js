import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './contexts/UserContext';
// --- this data is took from given assignment and updated here---
const initialMockData = {
  users: [
    { id: "1", role: "Admin", email: "admin@drasrani.in", password: "admin123" },
    { id: "2", role: "Patient", email: "john@drasrani.in", password: "patient123", patientId: "p1" },
  ],
  doctors: [
    // This array will be populated when doctors sign up
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No allergies",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-07-01T10:00:00",
      cost: 80,
      status: "Completed",
      files: [
        { name: "invoice.pdf", url: "base64string-or-blob-url" },
        { name: "xray.png", url: "base64string-or-blob-url" },
      ],
    },
  ],
};
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(initialMockData.users));
}
if (!localStorage.getItem('patients')) {
  localStorage.setItem('patients', JSON.stringify(initialMockData.patients));
}
if (!localStorage.getItem('doctors')) {
  localStorage.setItem('doctors', JSON.stringify(initialMockData.doctors));
}
if (!localStorage.getItem('appointments')) {
  localStorage.setItem('appointments', JSON.stringify(initialMockData.incidents));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
reportWebVitals();
