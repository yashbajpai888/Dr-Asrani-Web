const DOCTORS_STORAGE_KEY = 'doctors';

// Get all doctors from localStorage
export function getDoctors() {
  return JSON.parse(localStorage.getItem(DOCTORS_STORAGE_KEY) || '[]');
}

// Save doctors to localStorage
export function saveDoctors(doctors) {
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(doctors));
}

// Add a new doctor
export function addDoctor(newDoctor) {
  const doctors = getDoctors();
  
  // Check if doctor with this email already exists
  const existingDoctor = doctors.find(doctor => 
    doctor.email.toLowerCase() === newDoctor.email.toLowerCase()
  );
  
  if (existingDoctor) {
    throw new Error('Doctor with this email already exists');
  }
  
  // Add new doctor with unique ID
  newDoctor.id = `d${Date.now()}`;
  newDoctor.role = 'Admin';
  newDoctor.createdAt = new Date().toISOString();
  
  doctors.push(newDoctor);
  saveDoctors(doctors);
  
  return newDoctor;
}

// Authenticate doctor by email and password
export function authenticateDoctor(email, password) {
  const doctors = getDoctors();
  return doctors.find(doctor => 
    doctor.email.toLowerCase() === email.toLowerCase() && 
    doctor.password === password
  );
}

// Get doctor by ID
export function getDoctorById(doctorId) {
  const doctors = getDoctors();
  return doctors.find(doctor => doctor.id === doctorId);
}