const STORAGE_KEY = 'patients';

export function getPatients() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function savePatients(patients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function addPatient(newPatient) {
  // Save to database first
  fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(newPatient)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Patient saved to database:', data);
    // Update local storage with the database ID
    const patients = getPatients();
    const savedPatient = data.patient || { ...newPatient, id: `p${Date.now()}` };
    patients.push(savedPatient);
    savePatients(patients);
  })
  .catch(error => {
    console.error('Error saving patient to database:', error);
    // Fallback to local storage only
    const patients = getPatients();
    newPatient.id = `p${Date.now()}`;
    patients.push(newPatient);
    savePatients(patients);
  });
}

export function updatePatient(updatedPatient) {
  // Update in database first
  fetch(`/api/patients/${updatedPatient.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(updatedPatient)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Patient updated in database:', data);
    // Update local storage
    const patients = getPatients().map((p) =>
      p.id === updatedPatient.id ? updatedPatient : p
    );
    savePatients(patients);
  })
  .catch(error => {
    console.error('Error updating patient in database:', error);
    // Fallback to local storage only
    const patients = getPatients().map((p) =>
      p.id === updatedPatient.id ? updatedPatient : p
    );
    savePatients(patients);
  });
}

export function deletePatient(patientId) {
  // Delete from database first
  fetch(`/api/patients/${patientId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Patient deleted from database:', data);
    // Update local storage
    const patients = getPatients().filter((p) => p.id !== patientId);
    savePatients(patients);
  })
  .catch(error => {
    console.error('Error deleting patient from database:', error);
    // Fallback to local storage only
    const patients = getPatients().filter((p) => p.id !== patientId);
    savePatients(patients);
  });
}
