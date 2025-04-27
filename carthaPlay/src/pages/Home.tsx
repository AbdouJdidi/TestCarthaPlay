import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Brain,
  Target,
  BookOpenCheck,
} from 'lucide-react';
import { Background } from '../components/Background';
import { RoleCard } from '../components/RoleCard';
import logo from '../../assets/logo.png'

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Apprentissage Ludique',
      description: 'Des jeux éducatifs conçus pour rendre l\'apprentissage amusant et efficace',
      color: 'bg-blue-100',
      iconColor: 'text-primary',
    },
    {
      icon: Target,
      title: 'Suivi Personnalisé',
      description: 'Tableau de bord détaillé pour suivre la progression de chaque élève',
      color: 'bg-purple-100',
      iconColor: 'text-primary',
    },
    {
      icon: BookOpenCheck,
      title: 'Multi-matières',
      description: 'Des jeux adaptés à toutes les matières et niveaux scolaires',
      color: 'bg-blue-100',
      iconColor: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <Background />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="relative animate-float">
                {/* <BookOpen className="h-8 w-8 text-indigo-600" /> */}
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div> */}
              </div>
              <img src = {logo} className='w-12 h-12' />

              <span className="text-3xl font-bold bg-primary  bg-clip-text text-transparent">
                CarthaPlay
              </span>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Bienvenue sur{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
              CarthaPlay
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez une nouvelle façon d'apprendre et d'enseigner à travers
            des jeux éducatifs interactifs
          </p>
          <div className="flex items-center justify-center space-x-4 mb-12">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-lg text-gray-700">
              Contenu conforme au curriculum éducatif
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-lg text-gray-700">
              Créé par des enseignants, pour les enseignants
            </span>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <RoleCard
            icon={GraduationCap}
            title="Enseignant"
            description="Créez des jeux éducatifs et suivez les progrès de vos élèves"
            gradient="bg-gradient-to-r from-indigo-600 to-purple-600"
            iconBg="bg-indigo-100"
            iconColor="text-primary"
            onClick={() => navigate('/signup/teacher')}
          />

          <RoleCard
            icon={BookOpen}
            title="Élève"
            description="Accédez aux jeux et suivez votre progression d'apprentissage"
            gradient="bg-gradient-to-r from-purple-600 to-pink-600"
            iconBg="bg-indigo-100"
            iconColor="text-primary"
            onClick={() => navigate('/login/student')}
          />
        </div>

        {/* Why Choose CarthaPlay Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir CarthaPlay ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contactez-nous
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-indigo-600" />
                Téléphones
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>+216 93 629 921</p>
                <p>+216 53 158 628</p>
                <p>+216 23 032 610</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                Emails
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>roudayna.kouka@carthaplay.tn</p>
                <p>nader.benSaleh@carthaplay.tn</p>
                <p>abderahmen.jdidi@carthaplay.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 CarthaPlay. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};