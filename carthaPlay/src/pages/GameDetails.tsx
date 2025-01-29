import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: { id: number; text: string ; isCorrect : boolean }[];
  correct_answer: string;
}

const API_URL = 'https://testcarthaplay.onrender.com/api';

function GamesDetails() {
  const { gameId } = useParams<{ gameId: string }>();
  const numericGameId = Number(gameId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedText, setUpdatedText] = useState<string>('');
  const [editingOption, setEditingOption] = useState<{ questionId: number; optionId: number } | null>(null);
  const [updatedOptionText, setUpdatedOptionText] = useState<string>('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/questions/${numericGameId}`);
      console.log(response)
      setQuestions(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Impossible de charger les questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOption = async (questionId: number, optionId: number, newText: string) => {
    try {
      const response = await axios.put(`${API_URL}/options/${optionId}`, { text: newText });
      const updatedOption = response.data;

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((opt) =>
                  opt.id === optionId ? { ...opt, text: updatedOption.text } : opt
                ),
              }
            : q
        )
      );

      setEditingOption(null);
    } catch (err) {
      console.error('Error updating option:', err);
    }
  };

  const handleUpdate = async (id: number, updatedQuestion: Partial<Question>) => {
    try {
      const response = await axios.put(`${API_URL}/questions/${id}`, updatedQuestion);
      console.log(response)
      const updated = response.data;
      console.log(updated)

      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
      );
      setEditingId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la question:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  console.log("Questions:", questions);

  const handleSetCorrectAnswer = async (questionId: number, optionId: number) => {
    try {
      console.log("called");
      console.log(questionId, optionId);
  
      // Find the selected option
      const selectedOption = questions
        .find((q) => q.id === questionId)
        ?.options.find((opt) => opt.id === optionId);
  
      if (!selectedOption) {
        console.error("Selected option not found.");
        return; // Exit early if undefined
      }
      console.log("Selected Option:", selectedOption);
  
      // Update the correct answer in the backend
      const response = await axios.put(`${API_URL}/questions/${questionId}/correct`, {
        correct_answer: selectedOption.text,
      });
      console.log(response);
  
      const updatedQuestion = response.data;
      console.log("Updated question:", updatedQuestion);
  
      // Update the state with the updated question
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, correct_answer: updatedQuestion.correct_answer } : q
        )
      );
  
      // Fetch the updated questions list
      await fetchQuestions();
    } catch (err) {
      console.error("Error setting correct answer:", err);
    }
  };
  

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            <span className="gradient-text">Game Questions</span>
          </h2>
  
          {questions.length === 0 ? (
            <p>No questions available for this game.</p>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-4 mb-4">
                {editingId === question.id ? (
                  <>
                    <input
                      type="text"
                      value={updatedText}
                      onChange={(e) => setUpdatedText(e.target.value)}
                      className="form-input w-full mb-2"
                      placeholder="Update question text"
                    />
                    <button
                      onClick={() => handleUpdate(question.id, { question: updatedText })}
                      className="text-sm text-white bg-indigo-600 px-3 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-white bg-gray-400 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="mb-4">
                    <div className="flex flex-col mb-4 font-semibold">
                      Question N°{index + 1}
                    </div>
                    <div className="flex">
                      <h4 className="font-medium text-gray-900 pr-4">{question.question}</h4>
                      <button
                        onClick={() => {
                          setEditingId(question.id);
                          setUpdatedText(question.question);
                        }}
                        className="p-1 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 11l7.536-7.536a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828L12 15l-3 1 1-3z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <ul className="space-y-4">
                  {question.options.map((option) => {
  
                    return editingOption?.optionId === option.id &&
                      editingOption?.questionId === question.id ? (
                      <li key={option.id}>
                        <input
                          type="text"
                          value={updatedOptionText}
                          onChange={(e) => setUpdatedOptionText(e.target.value)}
                          className="form-input mb-2"
                          placeholder="Update option text"
                        />
                        <button
                          onClick={() =>
                            handleUpdateOption(question.id, option.id, updatedOptionText)
                          }
                          className="text-sm text-white bg-indigo-600 px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOption(null)}
                          className="text-sm text-white bg-gray-400 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </li>
                    ) : (
                      <li
                        key={option.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          option.isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span>{option.text}</span>
                        {option.isCorrect && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-700"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {!(option.isCorrect) && (
            <button
              onClick={() => handleSetCorrectAnswer(question.id, option.id)}
              className="p-1 text-transparent bg-gradient-to-r from-gray-500 to-gray-700 rounded-full mr-2"
              title="Set as Correct Answer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
                        <button
                          onClick={() => {
                            setEditingOption({ questionId: question.id, optionId: option.id });
                            setUpdatedOptionText(option.text);
                          }}
                          className="p-1 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 11l7.536-7.536a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828L12 15l-3 1 1-3z"
                            />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
  
  
}

export default GamesDetails;
