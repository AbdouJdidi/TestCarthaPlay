import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const API_URL = 'http://votre-backend-url/api/questions'; // Remplacez par l'URL de votre backend

function GamesDetails() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', ''],
    correctAnswer: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les questions depuis l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setQuestions(response.data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // const handleDelete = async (id: number) => {
  //   try {
  //     await axios.delete(${API_URL}/${id});
  //     setQuestions(questions.filter((q) => q.id !== id));
  //   } catch (err) {
  //     console.error('Erreur lors de la suppression de la question:', err);
  //   }
  // };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  // const handleUpdate = async (id: number, updatedQuestion: Partial<Question>) => {
  //   try {
  //     const existingQuestion = questions.find((q) => q.id === id);
  //     if (!existingQuestion) return;

  //     const updated = { ...existingQuestion, ...updatedQuestion };
  //     await axios.put(${API_URL}/${id}, updated);

  //     setQuestions(questions.map((q) => (q.id === id ? updated : q)));
  //     setEditingId(null);
  //   } catch (err) {
  //     console.error('Erreur lors de la mise à jour de la question:', err);
  //   }
  // };

  const handleAdd = async () => {
    if (newQuestion.text && newQuestion.options.every((opt) => opt)) {
      try {
        const response = await axios.post(API_URL, newQuestion);
        setQuestions([...questions, response.data]);
        setNewQuestion({ text: '', options: ['', '', ''], correctAnswer: 0 });
      } catch (err) {
        console.error('Erreur lors de l’ajout de la question:', err);
      }
    }
  };

  if (loading) return <p>Chargement des questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gestionnaire de Questions
        </h1>

        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
            {editingId === question.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={question.text}
                  // onChange={(e) => handleUpdate(question.id, { text: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[idx] = e.target.value;
                        // handleUpdate(question.id, { options: newOptions });
                      }}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="radio"
                      checked={question.correctAnswer === idx}
                      // onChange={() => handleUpdate(question.id, { correctAnswer: idx })}
                      className="mt-3"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Sauvegarder
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
                <div className="space-y-2 mb-4">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded ${
                        idx === question.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(question.id)}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
                  >
                    <Pencil size={16} /> Modifier
                  </button>
                  <button
                    // onClick={() => handleDelete(question.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle question</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Entrez votre question"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {newQuestion.options.map((option, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[idx] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="radio"
                  checked={newQuestion.correctAnswer === idx}
                  onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                  className="mt-3"
                />
              </div>
            ))}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              <Plus size={20} /> Ajouter la question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesDetails;