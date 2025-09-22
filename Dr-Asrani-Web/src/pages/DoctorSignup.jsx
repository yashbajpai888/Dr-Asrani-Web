import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoctor } from '../utils/doctorAuth';
import './Login.css'; // Reuse login styles for consistency

function DoctorSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create doctor object
      const newDoctor = {
        name,
        email,
        password,
        profilePic: profilePic || 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400'
      };
      
      // Add doctor to storage
      await addDoctor(newDoctor);
      
      // Show success message and redirect to login
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Background/Illustration */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 flex flex-col justify-between">
            <div className="relative z-10 text-white text-center">
              <div className="flex items-center justify-center mb-8">
                <img 
                  src="https://img.icons8.com/?size=96&id=OLeuR4KeEuOj&format=png" 
                  alt="Dr. Asrani Dental Clinic" 
                  className="w-16 h-16 mr-4" 
                />
                <h1 className="text-2xl font-bold">Dr. Asrani Dental</h1>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">Welcome to Our Portal</h2>
              
              <p className="text-lg opacity-90 mb-8 max-w-md mx-auto">
                Join our network of dental professionals and manage your practice efficiently.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
          
          {/* Right Panel - Signup Form */}
          <div className="p-8 md:p-12 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Doctor Signup</h2>
                <p className="text-gray-500 mt-2">Create your doctor account</p>
              </div>
              
              {error && (
                <div className="w-full p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Dr. John Smith"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="doctor@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>Already have an account? <button type="button" onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">Login here</button></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignup;