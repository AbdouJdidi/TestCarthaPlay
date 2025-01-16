import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { BookOpen, GraduationCap, Target, Plus, Search } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface GameListProps {
  role: 'teacher' | 'student';
}
interface TokenPayload {
  id: string; 
  email: string;
  role: string;
}


export const GameList: React.FC<GameListProps> = ({ role }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const decoded: TokenPayload = jwtDecode(token);
        const userId = decoded.id;
        setUserId(userId);
  
        const response = await axios.get(`https://testcarthaplay.onrender.com/api/games/${userId}`);
        console.log(response);
        setGames(response.data.data);
      } catch (err) {
        console.error('Error:', err);
      }
    };
  
    fetchGames();
  }, [userId]);
  

  

  const filteredGames = games.filter(game =>
    game.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.lesson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {role === 'teacher' ? 'Bibliothèque des jeux' : 'Jeux disponibles'}
            </span>
          </h1>
          {role === 'teacher' && (
            <button
              onClick={() => navigate('/teacher/create-game')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Créer un jeu</span>
            </button>
          )}
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un jeu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring focus:ring-indigo-200 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedGame?.id === game.id ? 'ring-2 ring-indigo-600' : ''
              }`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty === 'easy' ? 'Facile' :
                   game.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{game.lesson}</h3>
                  <p className="text-sm text-gray-600">{game.subject}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {game.difficulty}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="h-4 w-4 mr-2" />
                  {game.lesson}
                </div>
              </div>

              {selectedGame?.id === game.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(role === 'teacher' 
                      ? `/teacher/games/${game.id}`
                      : `/student/games/${game.id}`
                    );
                  }}
                  className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200"
                >
                  {role === 'teacher' ? 'Modifier le jeu' : 'Commencer à jouer'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};