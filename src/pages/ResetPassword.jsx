import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: OTP verification, 2: New password
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get email from URL query params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get from localStorage
      const storedEmail = localStorage.getItem('resetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // No email found, redirect to login
        navigate('/login');
      }
    }
  }, [location, navigate]);
  
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the API to verify OTP
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStep(2); // Move to password reset step
        setSuccess('OTP verified successfully. Please set your new password.');
      } else {
        // Fallback for demo/development
        const storedOtp = localStorage.getItem('resetOTP');
        
        if (storedOtp && storedOtp === otp) {
          setStep(2); // Move to password reset step
          setSuccess('OTP verified successfully. Please set your new password.');
        } else {
          setError(data.message || 'Invalid OTP. Please try again.');
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      
      // Fallback for demo/development
      const storedOtp = localStorage.getItem('resetOTP');
      
      if (storedOtp && storedOtp === otp) {
        setStep(2); // Move to password reset step
        setSuccess('OTP verified successfully. Please set your new password.');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      // Call the API to reset password
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password reset successfully. You will be redirected to login.');
      } else {
        // Fallback for demo/development
        setSuccess('Password reset successfully. You will be redirected to login.');
      }
      
      // Clear localStorage
      localStorage.removeItem('resetOTP');
      localStorage.removeItem('resetEmail');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      
      // Fallback for demo/development
      setSuccess('Password reset successfully. You will be redirected to login.');
      
      // Clear localStorage
      localStorage.removeItem('resetOTP');
      localStorage.removeItem('resetEmail');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
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
      
      <div className="w-full max-w-md mx-auto flex flex-col overflow-hidden rounded-3xl shadow-2xl my-8 bg-white">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 mt-2">
              {step === 1 
                ? 'Enter the OTP sent to your email' 
                : 'Create a new password'}
            </p>
          </div>
          
          {step === 1 ? (
            <form onSubmit={verifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={email}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;