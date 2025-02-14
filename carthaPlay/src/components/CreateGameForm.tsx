import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, School, Lightbulb, Plus, X, Save, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Question {
  id: string;
  question: string;
  level: number;
  options: string[];
  correctAnswer: string;
  order : number ; 

}
interface Information {
  id : string ; 
  info: string;
  level:number ,
  order : number ;
}

interface TokenPayload {
  id: string; 
  email: string;
  role: string;
}
type Item = Information | Question ; 
export const CreateGameForm = () => {
  let questionCounter = 1;
  let infoCounter = 1;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: '',
    lesson: '',
    difficulty: '',
    level: '',
  });
  const [item,setItem] = useState<Item[]>([])
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    level : 0,
    options: ['', '', '',],
    correctAnswer: '',
    order : 0 ,
  });
  const [informations, setInformations] = useState<Information[]>([])
  const [currentInformation,setCurrentInformation] = useState<Information>({
    id : '',
    info : '' ,
    level: 0 ,
    order : 0 ,

  })
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [order, setOrder] = useState(1) ;

  const handleClick = () => {
    setIsDisabled(true);
    console.log("Button clicked!");
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setUserId(decoded.id); 
        setRole(decoded.role); 
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      try {
        const response = await fetch('https://testcarthaplay.onrender.com/api/question/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions }),
        });
        console.log(response)

        if (response.ok) {
          alert('Questions added successfully!');
          navigate('/game');
        } else {
          alert('Error adding questions');
        }
      } catch (error) {
        console.error(error);
        alert('Server error!');
      }
    } else {
      setStep(2);
    }
  };
  

  const addQuestion = () => {
    console.log(currentQuestion.level)
    console.log("worked")
    if (currentQuestion.question && currentQuestion.options.every(opt => opt) && currentQuestion.correctAnswer && currentQuestion.level) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        order: order ,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        id: '',
        question: '',
        level : 0,
        options: ['', '', ''],
        correctAnswer: '',
        order : 0 ,
      });
      setOrder((prev)=> prev+1)
      setItem([...item,{...currentQuestion ,  id: Date.now().toString() }])
    }
  };


  const addInformation = () => {
      if (currentInformation.info) {
        const newInfo = {
          ...currentInformation,
          id: Date.now().toString(),
          order: order ,
        };
        setInformations([...informations, newInfo]);
        setCurrentInformation({
          id: '',
          info: '',
          level : 0 , 
          order : 0 ,
        });
        setItem([...item,{...currentInformation ,  id: Date.now().toString() }]);
        setOrder((prev)=>prev + 1)
      }
  };
  
  const handleGameWithQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gameData = {
        ...formData,
        questions,
        informations, 
        userId, 
      };
  
      const response = await axios.post(`https://testcarthaplay.onrender.com/api/games-with-questions`, gameData);
  
      if (response.status === 201) {
        alert('Game and questions submitted successfully!');
        navigate(`/teacher/dashboard/${userId}`)
        console.log(response)
      } else {
        console.error('Unexpected response:', response);
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting the game and questions form:', error);
      alert('Failed to submit the game and questions form. Please try again.');
    }
  };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  console.log(questions)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-300">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progression</span>
            <span className="text-sm font-medium text-indigo-600">{step}/2</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(step/2) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          <span className="gradient-text">
            {step === 1 ? 'Créer un nouveau jeu éducatif' : 'Ajouter des questions'}
          </span>
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <BookOpen className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <label className="form-label">Matière</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-select pl-12"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  <option value="math">Mathématiques</option>
                  <option value="french">Français</option>
                  <option value="science">Sciences</option>
                </select>
              </div>

              <div className="relative group">
                <School className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <label className="form-label">Niveau scolaire</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="form-select pl-12"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="4">4ème année</option>
                  <option value="5">5ème année</option>
                  <option value="6">6ème année</option>
                </select>
              </div>

              <div className="relative group">
                <Lightbulb className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <label className="form-label">Leçon</label>
                <input
                  type="text"
                  value={formData.lesson}
                  onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                  className="form-input pl-12"
                  placeholder="Titre de la leçon"
                  required
                />
              </div>

              <div className="relative group">
                <Target className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <label className="form-label">Niveau de difficulté</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="form-select pl-12"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="easy">Facile</option>
                  <option value="medium">Moyen</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <span>Suivant</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Questions List */}
            <div className="space-y-4">
            
    {item.map((q, index) => {
      

      return (
        <div key={q.id} className="bg-gray-50 rounded-xl p-4 relative group">
          <button
            onClick={() => removeQuestion(q.id)}
            className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Common Header for Both */}
          <h4 className="font-medium text-gray-900 mb-2">
            {q.hasOwnProperty('question') ? `Question ${questionCounter++}` : `Information ${infoCounter++}`}
          </h4>

          {/* Conditionally Render Content */}
          {'question' in q ? (
            <>
              {/* Render Question */}
              <p className="text-gray-600 mb-2">{q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((option, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg text-sm ${
                      option === q.correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Render Information */}
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                {q.info}
              </div>
            </>
          )}
        </div>
      );
    })}
  </div>
            {/* Add New Question Form */}
            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors duration-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Question</label>
                  <input
                    type="text"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    className="form-input"
                    placeholder="Entrez votre question"
                  />
                </div>
                <div className="relative group">
                  <Target className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                  <label className="form-label">Niveau de difficulté</label>
                  <select
                    value={currentQuestion.level ? currentQuestion.level : "select"}
                    onChange={(e) => setCurrentQuestion({...currentQuestion , level : Number(e.target.value)})}
                    className="form-select pl-12"
                    required
                  >
                    <option value="">Sélectionner le niveau d'apparition</option>

                    <option value="1">Niveau 1</option>
                    <option value="2">Niveau 2</option>
                    <option value="3">Niveau 3</option>
                  </select>
              </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <label className="form-label">Option {index + 1}</label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        className="form-input"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="form-label">Réponse correcte</label>
                  <select
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner la réponse correcte</option>
                    {currentQuestion.options.map((option, index) => (
                      option && <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter la question</span>
                </button>
              </div>
            </div>

            {/* Add New Information Form */}
            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors duration-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Information</label>
                  <input
                    type="text"
                    value={currentInformation.info}
                    onChange={(e) => setCurrentInformation({ ...currentInformation, info: e.target.value })}
                    className="form-input"
                    placeholder="Entrez votre question"
                  />
                </div>

                <div className="relative group">
                  <Target className="absolute left-3 top-[2.1rem] transform w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                  <label className="form-label">Niveau de difficulté</label>
                  <select
                    value={currentInformation.level ? currentInformation.level : "select"}
                    onChange={(e) => setCurrentInformation({...currentInformation , level : Number(e.target.value)})}
                    className="form-select pl-12"
                    required
                  >
                    <option value="">Sélectionner le niveau d'apparition</option>

                    <option value="1">Niveau 1</option>
                    <option value="2">Niveau 2</option>
                    <option value="3">Niveau 3</option>
                  </select>
              </div>

                <button
                  type="button"
                  onClick={addInformation}
                  className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter l'information</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={(e)=>{handleClick() ; handleGameWithQuestionsSubmit(e)}}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                disabled={questions.length === 0 || isDisabled}
                 
              >
                <Save className="mr-2 h-5 w-5" />
                <span>Créer le jeu</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};