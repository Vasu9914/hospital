import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken, getRole } from '../utils/auth';
import { AuthAPI } from '../api/authApi';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await AuthAPI.login({ email, password });

      const token = res.data.token;
      saveToken(token);

      const role = getRole();

      if (role === 'PATIENT') navigate('/patient/dashboard');
      else if (role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/unauthorized');

    } catch (err) {
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-8">

        {/* 🏥 Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Hospital 
          </h1>
          <p className="text-gray-500 text-sm">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p className="cursor-pointer hover:text-blue-600">
            Forgot password?
          </p>
        </div>

      </div>

    </div>
  );
}