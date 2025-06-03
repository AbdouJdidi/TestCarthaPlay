import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginForm } from './components/LoginForm';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherTracking } from './pages/TeacherTracking';
import { CreateGameForm } from './components/CreateGameForm';
import { GameList } from './components/GameList';
import SignupForm from './components/SignupForm';
import GamesDetails from './pages/GameDetails';
import LandingPage from './landing/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Home />} />
        <Route path="/login/teacher" element={<LoginForm role="teacher" />} />
        <Route path="/login/student" element={<LoginForm role="student" />} />
        <Route path="/signup/teacher" element={<SignupForm role="teacher" />} />
        <Route path="/signup/student" element={<SignupForm role="student" />} /> 
        <Route path="/teacher/dashboard/:id" element={<ProtectedRoute> <TeacherDashboard /> </ProtectedRoute>} />
        <Route path="/teacher/create-game" element={<CreateGameForm />} />
        <Route path="/teacher/games" element={<GameList role="teacher" />} />
        <Route path="/teacher/games/:gameId" element={<GamesDetails/>} />
        <Route path="/teacher/tracking" element={<TeacherTracking />} />
        <Route path="/student/dashboard/:id" element={<StudentDashboard />} />
        <Route path="/student/games" element={<GameList role="student" />} />
        <Route path="/" element={<LandingPage/>} />

        {/* <Route path="/game" element={<GameApp />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
