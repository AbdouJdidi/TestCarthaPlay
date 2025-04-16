import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import type { DropResult } from 'react-beautiful-dnd';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Save } from 'lucide-react';
import Loading from '../components/Loading';

interface Question {
  id: number;
  question: string;
  level : number ,
  options: { id: number; text: string ; isCorrect : boolean }[];
  correct_answer: string;
}
interface Information {
  id : string ; 
  info: string;
  level : number ,
  order : number ;
}

type Items = Information | Question ; 

const API_URL = 'https://testcarthaplay.onrender.com/api';

function GamesDetails() {
  const navigate= useNavigate()
  const newGroupedLevels: Record<number, { questions: Question[]; informations: Information[] }> = {};
  const levels = 3
  let questionCounter = 1;
  let infoCounter = 1;

  const { gameId } = useParams<{ gameId: string }>();
  const numericGameId = Number(gameId);
  
  const [groupedLevels, setGroupedLevels] = useState<Record<number, { questions: Question[]; informations: Information[] }>>({});

  const [gameData, setGameData] = useState(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [items,setItems] = useState<Items[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedText, setUpdatedText] = useState<string>('');
  const [editingOption, setEditingOption] = useState<{ questionId: number; optionId: number } | null>(null);
  const [updatedOptionText, setUpdatedOptionText] = useState<string>('');

  // const fetchQuestions = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${API_URL}/questions/${numericGameId}`);
  //     setQuestions(response.data || []);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Error fetching questions:', err);
  //     setError('Impossible de charger les questions.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchItems = async () => {
    try {
      setLoading(true); // Start loading before making the request
  
      const res = await axios.get(`${API_URL}/games-with-questions/${numericGameId}`);
      setItems(res.data.content);
      console.log(res.data.content);
      console.log(items);
  
      const newGroupedLevels: Record<number, { questions: Question[]; informations: Information[] }> = {}; // Define type
      res.data.content.forEach((item: Items) => {
        const level = item.level || 1;
  
        if (!newGroupedLevels[level]) {
          newGroupedLevels[level] = { questions: [], informations: [] };
        }
  
        if ("question" in item) {
          newGroupedLevels[level].questions.push(item);
        } else {
          newGroupedLevels[level].informations.push(item);
        }
      });
  
      setGroupedLevels(newGroupedLevels);
  
      console.log(groupedLevels);
      const levels = Object.entries(groupedLevels);
      console.log("Levels Extracted:", levels);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false); // Stop loading after fetching or error
    }
  };
  
  useEffect(()=>{
    
    fetchItems();
  },[numericGameId])

  const handleUpdateOption = async (level : number ,questionId: number, optionId: number, newText: string) => {
    try {
      console.log(questionId);
      const response = await axios.put(`${API_URL}/options/${optionId}`, { text: newText });
      const updatedOption = response.data;
     setItems((prev) =>
        prev.map((item) =>
          'options' in item && item.id === questionId
            ? {
                ...item,
                options: item.options.map((opt) =>
                  opt.id === optionId ? { ...opt, text: updatedOption.text } : opt
                ),
              }
            : item
        )
      );
      console.log
  
      setEditingOption(null);
    } catch (err) {
      console.error('Error updating option:', err);
    }
  };
  

  const handleUpdate = async (id: number, level : number , updatedQuestion: Partial<Question>) => {
    try {
      const response = await axios.put(`${API_URL}/questions/${id}`, updatedQuestion);
      console.log(response)
      const updated = response.data;
      console.log(updated)

      // setGroupedLevels((prev) => {
      //   const newGroupedLevels = { ...prev }; 
    
      //   if (newGroupedLevels[level]) {
      //     const updatedQuestions = newGroupedLevels[level].questions.map((item) =>
      //       item.id === id ? { ...item, ...updated } : item
      //     );
    
      //     const updatedInformations = newGroupedLevels[level].informations.map((item) =>
      //       +item.id === id ? { ...item, ...updated } : item
      //     );
    
      //     newGroupedLevels[level] = {
      //       questions: updatedQuestions,
      //       informations: updatedInformations,
      //     };
      //   }
    
      //   return newGroupedLevels;
      // });

      setItems((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
      );
      
      setEditingId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la question:', err);
    }
  };

  const handleUpdateInfo = async (id: number, level : number , updatedInfo: Partial<Information>) => {
    try {
      const response = await axios.put(`${API_URL}/informations/${id}`, updatedInfo);
      console.log(response)
      const updated = response.data;
      console.log(updatedText),
      console.log(editingId)
      console.log(updated)

      // setGroupedLevels((prev) => {
      //   const newGroupedLevels = { ...prev }; 
    
      //   if (newGroupedLevels[level]) {
      //     const updatedQuestions = newGroupedLevels[level].questions.map((item) =>
      //       item.id === id ? { ...item, ...updated } : item
      //     );
    
      //     const updatedInformations = newGroupedLevels[level].informations.map((item) =>
      //       +item.id === id ? { ...item, ...updated } : item
      //     );
    
      //     newGroupedLevels[level] = {
      //       questions: updatedQuestions,
      //       informations: updatedInformations,
      //     };
      //   }
    
      //   return newGroupedLevels;
      // });

      setItems((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
      );
      
      setEditingId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la question:', err);
    }
  };

  const handleSetCorrectAnswer = async (level : number ,questionId: number, optionId: number) => {
    try {
      console.log("called");
      console.log(questionId, optionId);
  
    const selectedOption = items
    .filter((item) => "options" in item)
    .find((q) => q.id === questionId)
    ?.options?.find((opt) => opt.id === optionId);

  
      if (!selectedOption) {
        console.error("Selected option not found.");
        return;
      }
      console.log("Selected Option:", selectedOption);
  
      const response = await axios.put(`${API_URL}/questions/${questionId}/correct`, {
        correct_answer: selectedOption.text,
      });
      console.log(response);
  
      const updatedQuestion = response.data;
      console.log("Updated question:", updatedQuestion);
  
      setItems((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, correct_answer: updatedQuestion.correct_answer } : q
        )
      );
  
      await fetchItems();
    } catch (err) {
      console.error("Error setting correct answer:", err);
    }
  };
  useEffect(() => {
    console.log(items);
  }, [items]);

  
const handleDragEnd = async (result: DropResult) => {
  console.log("hit1")
  if (!result.destination) return;

  console.log("git2")
  const reorderedItems = [...items];
  const [movedItem] = reorderedItems.splice(result.source.index, 1);
  reorderedItems.splice(result.destination.index, 0, movedItem);

  setItems(reorderedItems);
  const updatedOrder = reorderedItems.map((item, index) => ({
    id: item.id,
    order: index + 1, 
    table: 'question' in item  ? 'questions' : 'informations',  
  
  
  
  }));

  console.log(updatedOrder)
  try {
    const response = await fetch("https://testcarthaplay.onrender.com/api/update-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedOrder }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order");
    }
    console.log("Order updated successfully");
    
  } catch (error) {
    console.error("Error updating order:", error);
  }
};


  if (error) return <p>{error}</p>;
  console.log("Grouped Levels before render:", groupedLevels);


return (

  <>
    {loading? <Loading/> : 
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          <span className="text-primary">Détails du jeu </span>
        </h2>
  
        <div className='flex flex-col justify-center '>
  
          <DragDropContext onDragEnd={handleDragEnd}>
            {[...Array(levels)].map((_, levelIndex) => {
              const currentLevel = levelIndex + 1; //
              const levelItems = items.filter(item => item.level === currentLevel);
  
              return (
                <div key={currentLevel} className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Level {currentLevel}</h3>
                  <Droppable droppableId={`questions-level-${currentLevel}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {levelItems?.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        
                      >
                        {'question' in item ? (
                        <>
                          {editingId == item.id ? (
                            <>
                                <input
                          type="text"
                          value={updatedText}
                          onChange={(e) => setUpdatedText(e.target.value)}
                          className="form-input w-full mb-2"
                          placeholder="Update question text"
                        />
                        <button
                          onClick={() => handleUpdate(item.id, currentLevel , { question: updatedText })}
                          className="text-sm text-white bg-primary px-3 py-1 rounded mr-2"
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
                          ): (<div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <div className="mb-4">
                              <div className="flex justify-between mb-4 ">
                                <div className='font-semibold'>Question N°{questionCounter++}</div>
                                <div
                                  {...provided.dragHandleProps} 
                                  className="p-2 cursor-grab active:cursor-grabbing"
                                  title="Drag"
                                >
                                  ⠿
                              </div>
                              </div>
                              <div className="flex">
                                <h4 className="font-medium text-gray-900 pr-4">{item.question}</h4>
                                
                                <button
                                  onClick={() => {
                                    setEditingId(item.id);
                                    setUpdatedText(item.question);
                                  }}
                                  className="p-1 text-transparent bg-secondary rounded-full"
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
                            <ul className="space-y-4">
                              {item.options.map((option) => (
                                <>
                                  {editingOption?.optionId === option.id &&
                          editingOption?.questionId === item.id ? (<li key={option.id}>
                            <input
                              type="text"
                              value={updatedOptionText}
                              onChange={(e) => setUpdatedOptionText(e.target.value)}
                              className="form-input mb-2"
                              placeholder="Update option text"
                            />
                            <button
                              onClick={() =>
                                handleUpdateOption(currentLevel,item.id, option.id, updatedOptionText)
                              }
                              className="text-sm text-white bg-dark px-3 py-1 rounded mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingOption(null)}
                              className="text-sm text-white bg-gray-400 px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </li>):(<li
                                  key={option.id}
                                  className={`flex items-center justify-between p-3 rounded-lg ${
                                    option.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'
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
                                  {!option.isCorrect && (
                                    <button
                                      onClick={() => handleSetCorrectAnswer(currentLevel ,item.id, option.id)}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                  )}
                                      <button
                                  onClick={() => {
                                    setEditingOption({ questionId: item.id, optionId: option.id });
                                    setUpdatedOptionText(option.text);
                                  }}
                                  className="p-1 text-transparent bg-gradient-to-r from-secondary to-primary rounded-full"
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
                                )}
                                    
                                </>
                                
                              ))}
                            </ul>
                          </div>) 
                          
                          }
                        </>
                          
                        ) : (
                          <>
                              {editingId == +item.id ? (
                            <>
                                <input
                          type="text"
                          value={updatedText}
                          onChange={(e) => setUpdatedText(e.target.value)}
                          className="form-input w-full mb-2"
                          placeholder="Update question text"
                        />
                        <button
                          onClick={() => handleUpdateInfo(+item.id, item.level ,  { info: updatedText })}
                          className="text-sm text-white bg-dark px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm text-white bg-gray-400 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        </>) : (
                          
          
                          <div className="flex flex-col justify-between p-3 rounded-lg bg-gray-100 text-gray-700">
                            <div className="flex justify-between mb-4 font-semibold">
                              Information
                              <div
                                  {...provided.dragHandleProps} 
                                  className="p-2 cursor-grab active:cursor-grabbing"
                                  title="Drag"
                                >
                                  ⠿
                              </div>
                            </div>
                            <div className="flex justify-between rounded-lg">
                              <div>{item.info}</div>
                              <button onClick={() => {
                                    setEditingId(+item.id);
                                    setUpdatedText(item.info);
                                  }} className="p-1 text-transparent bg-gradient-to-r from-secondary to-primary rounded-full">
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
  
                          </>
                        
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
    </Droppable>
                </div>
              );
            })}
          </DragDropContext>
  
          <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                         `/teacher/games/modify/${gameId}`
                        
                      );
                    }}
                    
                    className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-medium transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    
                    
                  >
                    <Save className="mr-2 h-5 w-5" />
                    <span>Modifier le jeu</span>
          </button>
  
        </div>
        
      </div>
    </div>
      </div>
  
    }
  </>
    
      
      
  

    
  );
  
  
  
}

export default GamesDetails;
