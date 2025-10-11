import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Auth() {
  const loc = useLocation();
  const [adm, setAdm] = useState(loc.state && loc.state.showPatient ? false : true);
  const [loading, setLoading] = useState(false);
  const [aE, setAE] = useState('');
  const [aP, setAP] = useState('');
  const [pE, setPE] = useState('');
  const [pP, setPP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const { login } = useContext(AuthContext);
  
  const toggle = () => setAdm(!adm);
  const nav = useNavigate();
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!forgotEmail) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    try {
      // Send OTP to email using backend API
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(`OTP has been sent to ${forgotEmail}. Please check your email.`);
        
        // For demo purposes, show the OTP in a success message (remove in production)
        if (data.demo_otp) {
          setSuccess(`OTP has been sent to ${forgotEmail}. For demo purposes, your OTP is: ${data.demo_otp}`);
          
          // Store OTP in localStorage for demo purposes
          localStorage.setItem('resetOTP', data.demo_otp);
        }
        
        localStorage.setItem('resetEmail', forgotEmail);
        
        // Redirect to reset password page with email
        setTimeout(() => {
          nav(`/reset-password?email=${encodeURIComponent(forgotEmail)}`);
        }, 2000);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      
      // Fallback for demo/development - simulate OTP generation
      const hardcodedUsers = [
        { id: '1', role: 'Admin', email: 'admin@drasrani.in', password: 'admin123' },
        { id: '2', role: 'Patient', email: 'john@drasrani.in', password: 'patient123', patientId: 'p1' },
        { id: '3', name: 'Dr. Smith', email: 'doctor@drasrani.in', password: 'doctor123', role: 'doctor' },
        { id: '4', name: 'Diksha Kore', email: 'korediksha30@gmail.com', password: 'diksha123', role: 'doctor' },
      ];
      
      const userExists = hardcodedUsers.find(user => user.email.toLowerCase() === forgotEmail.toLowerCase());
      
      if (userExists) {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in localStorage (in a real app, this would be stored securely on the server)
        localStorage.setItem('resetOTP', otp);
        localStorage.setItem('resetEmail', forgotEmail);
        
        setSuccess(`OTP has been sent to ${forgotEmail}. For demo purposes, your OTP is: ${otp}`);
        
        // Redirect to reset password page with email
        setTimeout(() => {
          nav(`/reset-password?email=${encodeURIComponent(forgotEmail)}`);
        }, 2000);
      } else {
        setError('Email not found. Please check your email address.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const sub = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const email = adm ? aE : pE;
    const password = adm ? aP : pP;
    
    try {
      // Use the login function from AuthContext
      console.log('Attempting login with:', email);
      const userData = await login(email, password);
      console.log('Login successful, user data:', userData);
      
      // Navigate based on role with a slight delay to ensure state is updated
      if (userData.role === 'admin') {
        console.log('Navigating to admin dashboard');
        setTimeout(() => nav('/admin'), 100);
      } else if (userData.role === 'doctor') {
        console.log('Navigating to doctor dashboard');
        setTimeout(() => nav('/doctor'), 100);
      } else if (userData.role === 'patient') {
        console.log('Navigating to patient dashboard');
        setTimeout(() => nav('/patient'), 100);
      } else {
        console.log('Unknown role:', userData.role);
        setError('Login successful but role is not recognized');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dental-light">
        <div className="flex flex-col items-center">
          <div className="dental-loader mb-4"></div>
          <div className="text-xl font-bold text-dental-primary animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-['Poppins'] bg-gradient-to-br from-blue-50 to-purple-50">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="forgotEmail">
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl my-8">
        {/* Left Panel - Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/70 to-purple-700/80"></div>
            {adm ? (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60">
                <source src="dentist-video.mp4" type="video/mp4" />
              </video>
            ) : (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60">
                <source src="patient-video.mp4" type="video/mp4" />
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
              <h1 className="text-2xl md:text-3xl font-bold text-white">Dr. Asrani Dental</h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-white">
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
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Login'}
              </button>
              
              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotEmail(aE);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="text-center mt-6 space-y-3">
                <button 
                  type="button" 
                  onClick={() => nav('/signup')}
                  className="w-full p-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Don't have an account? Sign up here
                </button>
                <p className="text-xs text-gray-500">Demo credentials: admin@drasrani.in / admin123</p>
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
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
              
              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotEmail(pE);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>Demo credentials: john@drasrani.in / patient123</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;