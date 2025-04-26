import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Lock, Mail } from 'lucide-react';
import axios from 'axios';

interface LoginFormProps {
  role: 'teacher' | 'student';
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {

  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
  
    try {
      const response = await axios.post('https://testcarthaplay.onrender.com/api/login', formData);
      console.log(response);
  
      if (response.data.message === 'Login successful') {
        localStorage.setItem('token', response.data.token);
        const userId = response.data.user.id;
  
        if (response.data.user.role === 'teacher') {
          navigate(`/teacher/dashboard/${userId}`);
        } else {
          navigate(`/student/dashboard/${userId}`);
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading whether success or error
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative w-full max-w-md">
        {/* Floating shapes */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-12 left-12 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-white to-primary rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                {role === 'teacher' ? (
                  <GraduationCap className="w-12 h-12 text-primary" />
                ) : (
                  <BookOpen className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Connexion {role === 'teacher' ? 'Enseignant' : 'Élève'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring focus:ring-indigo-200 transition-all duration-200"
                  placeholder="Adresse email"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring focus:ring-indigo-200 transition-all duration-200"
                  placeholder="Mot de passe"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-secondary to-purple-600 text-white font-medium transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : (
                  "Se connecter"
                )}
              </button>

            </form>

            {error && (
              <div className="mt-4 text-red-600 text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
