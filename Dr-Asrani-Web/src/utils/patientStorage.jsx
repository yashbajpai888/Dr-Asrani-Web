const STORAGE_KEY = 'patients';
export function getPatients() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
export function savePatients(patients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}
export function addPatient(newPatient) {
  const patients = getPatients();
  newPatient.id = `p${Date.now()}`;
  patients.push(newPatient);
  savePatients(patients);
}
export function updatePatient(updatedPatient) {
  const patients = getPatients().map((p) =>
    p.id === updatedPatient.id ? updatedPatient : p
  );
  savePatients(patients);
}
export function deletePatient(patientId) {
  const patients = getPatients().filter((p) => p.id !== patientId);
  savePatients(patients);
}
