import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const doc = {
  name: 'Dr. Asrani',
  email: 'yashbjp888@gmail.com',
  profilePic: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400',
  role: 'Dentist'
};

const PatDash = () => {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
  const usr = JSON.parse(localStorage.getItem('sessionUser'));
  const pats = JSON.parse(localStorage.getItem('patients')) || [];
  const pat = pats.find(p => p.id === usr?.patientId);
  const apps = JSON.parse(localStorage.getItem('appointments')) || [];
  const inc = apps.filter(a => a.patientId === pat?.id);

  const out = () => {
    localStorage.removeItem('sessionUser');
    setUser(null);
    nav('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-0 px-0 font-sans">
      <header className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={doc.profilePic} alt="Doc" className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-0.5">Welcome, {pat ? pat.name.split(' ')[0] : 'Patient'}</div>
            <div className="text-sm text-gray-500">Patient Dashboard</div>
          </div>
        </div>
        <button onClick={out} className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </header>

      <main className="w-full max-w-7xl flex flex-col gap-6 mt-6 px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">Your Profile</h2>
              </div>
              <div className="p-6">
                {pat ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Full Name</span>
                      <span className="font-medium text-gray-800">{pat.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Date of Birth</span>
                      <span className="font-medium text-gray-800">{new Date(pat.dob).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Contact</span>
                      <span className="font-medium text-gray-800">{pat.contact}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Health Information</span>
                      <span className="font-medium text-gray-800">{pat.healthInfo}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500 p-4 bg-red-50 rounded-lg">Patient details not found.</div>
                )}
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">Your Appointments</h2>
              </div>
              <div className="p-6">
                {inc.length > 0 ? (
                  <div className="space-y-4">
                    {inc.map((a, i) => (
                      <div key={i} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{a.title}</p>
                          <p className="text-sm text-gray-500">{new Date(a.appointmentDate).toLocaleDateString()} - {new Date(a.appointmentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${a.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">No appointments scheduled.</div>
                )}
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">Doctor Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={doc.profilePic} alt="Doc" className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.role}</p>
                    <p className="text-sm text-gray-500 mt-1">{doc.email}</p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Book New Appointment</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>View Medical Records</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5H21M3 12H21M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Treatment History</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-4 sm:py-6 mt-auto text-gray-500 bg-white border-t border-gray-100 text-xs sm:text-sm">
        © {new Date().getFullYear()} Dr. Asrani Dental Clinic. All rights reserved.
      </footer>
    </div>
  );
};

export default PatDash;
