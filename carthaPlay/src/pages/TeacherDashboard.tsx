import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Gamepad2, 
  Library, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  console.log(id)

  const options = [
    {
      title: 'Créer un nouveau jeu',
      description: 'Concevez un nouveau jeu éducatif interactif',
      icon: Gamepad2,
      path: '/teacher/create-game',
      gradient: 'from-primary to-secondary',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-primary'
    },
    {
      title: 'Jeux existants',
      description: 'Accédez à la bibliothèque des jeux',
      icon: Library,
      path: '/teacher/games',
      gradient: 'from-primary to-secondary',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-primary'
    },
    // {
    //   title: 'Suivi des classes',
    //   description: 'Visualisez les performances des élèves',
    //   icon: BarChart3,
    //   path: '/teacher/tracking',
    //   gradient: 'from-primary to-secondary',
    //   iconBg: 'bg-indigo-100',
    //   iconColor: 'text-primary'
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Tableau de bord enseignant
          </span>
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {options.map((option) => (
            <button
              key={option.title}
              onClick={() => navigate(option.path)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-left transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className={`w-20 h-20 mb-6 rounded-2xl ${option.iconBg} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                <option.icon className={`h-10 w-10 ${option.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {option.description}
              </p>

              <div className={`flex font-bold items-center text-sm  bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                Commencer
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};