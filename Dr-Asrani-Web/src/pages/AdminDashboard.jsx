import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Kpi from '../components/kpis/KpiDashboard';
import PList from '../components/patients/PatientList';
import AList from '../components/appointments/AppointmentList';
import Cal from '../components/calendar/CalendarView';
import { FiGrid, FiUsers, FiCalendar, FiClipboard, FiLogOut } from 'react-icons/fi';

const getDoc = () => {
  return JSON.parse(localStorage.getItem('doctor')) || {
    name: 'Dr. Asrani',
    email: 'yashbjp888@gmail.com',
    role: 'Dentist',
    profilePic: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400'
  };
};
const greet = (h, n) => {
  const f = n.split(' ')[0];
  if (h >= 5 && h < 12) return `Good Morning, Dr. ${f}`;
  if (h >= 12 && h < 16) return `Good Afternoon, Dr. ${f}`;
  if (h >= 16 && h < 20) return `Good Evening, Dr. ${f}`;
  return `Good Night, Dr. ${f}`;
};
const getToday = () => {
  const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
  const t = new Date();
  return apps.filter(e => {
    if (!e.appointmentDate) return false;
    const d = new Date(e.appointmentDate);
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  });
};
const SidebarBtn = ({ icon, text, act, click }) => {
  const cMap = { Dashboard: 'text-gray-900', Patients: 'text-blue-900', Appointments: 'text-purple-900', Calendar: 'text-green-900' };
  const hMap = { Dashboard: 'hover:bg-yellow-200', Patients: 'hover:bg-yellow-200', Appointments: 'hover:bg-yellow-200', Calendar: 'hover:bg-yellow-200' };
  const cCls = cMap[text] || 'text-gray-900';
  const hCls = hMap[text] || 'hover:bg-gray-200';

  return (
    <button onClick={click} className={`flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 ${act ? 'bg-white/30 shadow-inner backdrop-blur' : hCls}`}>
      <span className={`text-xl ${cCls}`}>{icon}</span>
      <span className={`text-lg ${cCls}`}>{text}</span>
    </button>
  );
};

const AdminDash = () => {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [now, setNow] = useState(new Date());
  const [today, setToday] = useState(getToday());
  const doc = getDoc();

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (tab === 'dashboard') setToday(getToday());
  }, [tab]);

  const logout = () => {
    localStorage.removeItem('sessionUser');
    setUser(null);
    nav('/');
  };

  const dStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const isDay = h >= 6 && h < 18;
  const sAng = s * 6, mAng = m * 6 + s * 0.1, hAng = ((h % 12) + m / 60) * 30;
  const gr = greet(h, doc.name);

  return (
    <div className="min-h-screen relative font-['Poppins']">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-700 opacity-10 z-0"></div>
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-72 bg-white shadow-xl flex flex-col p-6 space-y-4">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img src={doc.profilePic} alt="Doc" className="w-20 h-20 rounded-full shadow-lg mb-2 object-cover ring-4 ring-blue-100" />
              <div className="absolute bottom-2 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-xl font-bold text-gray-800">{doc.name}</div>
            <div className="text-sm font-medium text-gray-600">{doc.role}</div>
            <div className="text-xs text-gray-500">{doc.email}</div>
          </div>
          <div className="space-y-1">
            <SidebarBtn icon={<FiGrid />} text="Dashboard" act={tab === 'dashboard'} click={() => setTab('dashboard')} />
            <SidebarBtn icon={<FiUsers />} text="Patients" act={tab === 'patients'} click={() => setTab('patients')} />
            <SidebarBtn icon={<FiClipboard />} text="Appointments" act={tab === 'appointments'} click={() => setTab('appointments')} />
            <SidebarBtn icon={<FiCalendar />} text="Calendar" act={tab === 'calendar'} click={() => setTab('calendar')} />
          </div>
          <button onClick={logout} className="flex items-center justify-center gap-3 mt-auto p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition transform hover:scale-105 shadow">
            <FiLogOut className="text-xl" /> Logout
          </button>
        </aside>
        <main className="flex-1 p-8 md:p-12 relative overflow-y-auto text-gray-900 bg-gray-50">
          <div className="relative z-10 max-w-7xl mx-auto">
            {tab === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, {doc.name.split(' ')[1] || doc.name}</h1>
                    <p className="text-gray-500 mt-1">{dStr}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
                    {isDay ? (
                      <span className="text-yellow-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
                          <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </span>
                    ) : (
                      <span className="text-indigo-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                        </svg>
                      </span>
                    )}
                    <span className="font-medium">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                          <p className="text-2xl font-bold text-gray-800">{JSON.parse(localStorage.getItem('patients') || '[]').length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
                          <p className="text-2xl font-bold text-gray-800">{today.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Completed Appointments</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {JSON.parse(localStorage.getItem('appointments') || '[]').filter(a => a.status === 'Completed').length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {today.length > 0 ? today.map((appt, i) => {
                          const patient = JSON.parse(localStorage.getItem('patients') || '[]').find(p => p.id === appt.patientId);
                          return (
                            <div key={i} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{patient?.name || 'Unknown Patient'}</p>
                                <p className="text-sm text-gray-500">{appt.title} - {new Date(appt.appointmentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              <span className={`ml-auto px-2 py-1 text-xs rounded-full ${appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {appt.status}
                              </span>
                            </div>
                          );
                        }) : (
                          <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === 'patients' && <PList />}
            {tab === 'appointments' && <AList />}
            {tab === 'calendar' && <Cal />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDash;
