import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'


const SignupForm = ({ role }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function generateGameCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  setError(null);

  // Basic checks
  if (!username || !email || !password || !role) {
    setError('Please fill in all required fields.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  // Clean inputs
  const cleanUsername = username.trim();
  console.log('Email before cleaning:', email);

  const cleanEmail = email.trim().toLowerCase();

  console.log('Cleaned email:', cleanEmail);


  // Simple email format check (optional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    setError('Please enter a valid email address.');
    return;
  }

  setLoading(true);

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (authError) throw new Error(authError.message);

    const authUserId = authData.user.id;

    // 2. Insert into your public.users table
    const { data: userData, error: userInsertError } = await supabase
      .from('users')
      .insert([{
        username: cleanUsername,
        email: cleanEmail,
        role,
        auth_user_id: authUserId,
      }])
      .select();

    if (userInsertError) throw new Error(userInsertError.message);

    const user = userData[0];

    // 3. Role-based logic
    if (role === 'teacher') {
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert([{ user_id: user.id }]);

      if (teacherError) throw new Error(teacherError.message);

      navigate('/login/teacher');
    } else if (role === 'student') {
      let studentCode;
      let isUnique = false;

      while (!isUnique) {
        studentCode = generateGameCode();
        const { data: existing } = await supabase
          .from('students')
          .select('id')
          .eq('student_code', studentCode)
          .maybeSingle();

        if (!existing) isUnique = true;
      }

      const { error: studentError } = await supabase
        .from('students')
        .insert([{ user_id: user.id, student_code: studentCode }]);

      if (studentError) throw new Error(studentError.message);

      navigate('/login/student');
    } else {
      throw new Error('Invalid role provided');
    }
  } catch (err) {
  console.error('Full error object:', err);

  // If it's a Supabase error, it may have a `message` or `details`
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('An unknown error occurred during signup.');
  }
}
  finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
        s'inscrire  comme {role === 'teacher' ? 'enseignant' : 'Student'}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmez le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmer mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : "s'inscrire"}

            </button>
          </div>
        </form>

        {/* Optional: Link to login page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
          Vous avez déjà un compte ? 
          {' '}
            <Link to={`/login/${role === "teacher" ? `teacher` : `student`}`} className="text-indigo-600 hover:text-indigo-800">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
