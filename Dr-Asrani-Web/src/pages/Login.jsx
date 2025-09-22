import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { authenticateDoctor } from '../utils/doctorAuth';

function Auth() {
  const loc = useLocation();
  const [adm, setAdm] = useState(loc.state && loc.state.showPatient ? false : true);
  const [load] = useState(false); // fixed here: removed unused setLoad
  const [aE, setAE] = useState('');
  const [aP, setAP] = useState('');
  const [pE, setPE] = useState('');
  const [pP, setPP] = useState('');
  const { setUser } = useContext(UserContext);
  
  const toggle = () => setAdm(!adm);
  const nav = useNavigate();
  const sub = (e) => {
    e.preventDefault();

    const u = [
      { id: '1', role: 'Admin', email: 'admin@drasrani.in', password: 'admin123' },
      { id: '2', role: 'Patient', email: 'john@drasrani.in', password: 'patient123', patientId: 'p1' },
    ];
    const pw = adm ? aP : pP;
    const em = adm ? aE : pE;
    const login = () => {
      if (adm) {
        // For admin login, first check hardcoded users, then check registered doctors
        const hardcodedUser = u.find(
          z => z.email.toLowerCase() === em.toLowerCase() && z.password === pw && z.role === "Admin"
        );
        
        if (hardcodedUser) {
          localStorage.setItem("sessionUser", JSON.stringify(hardcodedUser));
          setUser(hardcodedUser);
          nav("/admin");
          return;
        }
        
        // Check registered doctors
        const registeredDoctor = authenticateDoctor(em, pw);
        if (registeredDoctor) {
          // Store doctor info in localStorage for use in dashboard
          localStorage.setItem("doctor", JSON.stringify(registeredDoctor));
          localStorage.setItem("sessionUser", JSON.stringify(registeredDoctor));
          setUser(registeredDoctor);
          nav("/admin");
          return;
        }
      } else {
        // For patient login, check hardcoded users
        const patientUser = u.find(
          z => z.email.toLowerCase() === em.toLowerCase() && z.password === pw && z.role === "Patient"
        );
        
        if (patientUser) {
          localStorage.setItem("sessionUser", JSON.stringify(patientUser));
          setUser(patientUser);
          nav("/patient");
          return;
        }
      }
      
      alert("Invalid credentials");
    };

    login();
  };

  if (load) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="loader mb-4"></div>
          <div className="text-xl font-bold text-indigo-600 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-['Poppins'] bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl my-8">
        {/* Left Panel - Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/70 to-purple-700/80"></div>
            {adm ? (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60">
                <source src="/dentist-video.mp4" type="video/mp4" />
              </video>
            ) : (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60">
                <source src="/patient-video.mp4" type="video/mp4" />
              </video>
            )}
          </div>
          
          <div className="relative z-10 text-white text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-8">
              <img 
                src="https://img.icons8.com/?size=96&id=OLeuR4KeEuOj&format=png" 
                alt="Dr. Asrani Dental Clinic" 
                className="w-16 h-16 mr-4"
              />
              <h1 className="text-2xl md:text-3xl font-bold">Dr. Asrani Dental</h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
              {adm ? 'Dental Management Portal' : 'Patient Care Portal'}
            </h2>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md mx-auto md:mx-0">
              {adm 
                ? 'Access your dental practice management system to schedule appointments and manage patient records.' 
                : 'View your appointments, treatment plans, and dental records in one secure place.'}
            </p>
            
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-8">
              <span className={`font-medium ${adm ? 'text-white' : 'text-white/60'}`}>Admin</span>
              <button 
                onClick={toggle} 
                className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ backgroundColor: adm ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${adm ? 'translate-x-1' : 'translate-x-6'}`}
                />
              </button>
              <span className={`font-medium ${!adm ? 'text-white' : 'text-white/60'}`}>Patient</span>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex items-center justify-center">
          {adm ? (
            <form onSubmit={sub} className="w-full max-w-md space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                <p className="text-gray-500 mt-2">Enter your credentials to access the dashboard</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="admin@drasrani.in"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={aE}
                    onChange={(e) => setAE(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={aP}
                    onChange={(e) => setAP(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              
              <div className="text-center mt-6 space-y-3">
                <button 
                  type="button" 
                  onClick={() => nav('/signup')}
                  className="w-full p-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Don't have an account? Sign up here
                </button>
                <p className="text-xs text-gray-500">Demo credentials: admin@entnt.in / admin123</p>
              </div>
            </form>
          ) : (
            <form onSubmit={sub} className="w-full max-w-md space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Patient Login</h2>
                <p className="text-gray-500 mt-2">Access your dental records and appointments</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@drasrani.in"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={pE}
                    onChange={(e) => setPE(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={pP}
                    onChange={(e) => setPP(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
              
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>Demo credentials: john@entnt.in / patient123</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
