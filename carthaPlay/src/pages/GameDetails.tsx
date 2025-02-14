import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import type { DropResult } from 'react-beautiful-dnd';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const API_URL = 'https://testcarthaplay.onrender.com';

function GamesDetails() {
  const newGroupedLevels: Record<number, { questions: Question[]; informations: Information[] }> = {};

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
  const fetchItems = async()=>{
    try {
      const res = await axios.get(`${API_URL}/games-with-questions/${numericGameId}`);
      setItems(res.data.content)
      console.log(res.data.content)
      console.log(items);

      res.data.content.forEach((item:Items) => {
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

      console.log(groupedLevels)
      const levels = Object.entries(groupedLevels)
      console.log("Levels Extracted:", levels);
      


    } catch (error) {
      console.error('Error fetching questions:', error);

      
    }
  }
  useEffect(()=>{
    
    fetchItems();
  },[numericGameId])

  const handleUpdateOption = async (level : number ,questionId: number, optionId: number, newText: string) => {
    try {
      console.log(questionId);
      const response = await axios.put(`${API_URL}/options/${optionId}`, { text: newText });
      const updatedOption = response.data;
  
      setGroupedLevels((prevGroupedLevels) => {
        const updatedGroupedLevels = { ...prevGroupedLevels };
        if (updatedGroupedLevels[level]) {
          updatedGroupedLevels[level].questions = updatedGroupedLevels[level].questions.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  options: question.options.map((opt) =>
                    opt.id === optionId ? { ...opt, text: updatedOption.text } : opt
                  ),
                }
              : question
          );
        }
  
        return updatedGroupedLevels; 
      });
  
  
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

      setGroupedLevels((prev) => {
        const newGroupedLevels = { ...prev }; 
    
        if (newGroupedLevels[level]) {
          const updatedQuestions = newGroupedLevels[level].questions.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          );
    
          const updatedInformations = newGroupedLevels[level].informations.map((item) =>
            +item.id === id ? { ...item, ...updated } : item
          );
    
          newGroupedLevels[level] = {
            questions: updatedQuestions,
            informations: updatedInformations,
          };
        }
    
        return newGroupedLevels;
      });

      
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

      setGroupedLevels((prev) => {
        const newGroupedLevels = { ...prev }; 
    
        if (newGroupedLevels[level]) {
          const updatedQuestions = newGroupedLevels[level].questions.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          );
    
          const updatedInformations = newGroupedLevels[level].informations.map((item) =>
            +item.id === id ? { ...item, ...updated } : item
          );
    
          newGroupedLevels[level] = {
            questions: updatedQuestions,
            informations: updatedInformations,
          };
        }
    
        return newGroupedLevels;
      });

      
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
  if (!result.destination) return;

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            <span className="gradient-text">Game Details</span>
          </h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
              {groupedLevels&&Object.entries(groupedLevels).map(([level, levelData]) => (

        
          
          <div key={+level}>
            <h3 className="text-xl font-bold mb-2 px-2 py-4 gradient-text mt-16">Level {+level } :</h3>

            
            {levelData.questions.length > 0 ? (
              levelData.questions.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-50 rounded-xl p-4 mb-4"
                    >

                      
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
                        onClick={() => handleUpdate(item.id, item.level ,  { question: updatedText })}
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
                        ): (<div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="mb-4">
                            <div className="flex justify-between mb-4 ">
                              <div className='font-semibold'>Question </div>
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
                              handleUpdateOption(item.level ,item.id, option.id, updatedOptionText)
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
                                    onClick={() => handleSetCorrectAnswer(item.level,item.id, option.id)}
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
                              )}
                                  
                              </>
                              
                            ))}
                          </ul>
                        </div>) 
                        
                        }
                      
                      
                      
                      
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p className="text-gray-500">No questions for this level.</p>
            )}

          {levelData.informations.length > 0 ? (
            
              
              levelData.informations.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-50 rounded-xl p-4 mb-4"
                    >
                    
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
                                }} className="p-1 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
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

                    
                      
                      
                    </div>
                  )}
                </Draggable>
              ))
            
            ) : (
            <p>There are no informations for this level</p>
          )}



            {provided.placeholder}
          </div>
        ))}
      </div>
    )}
            
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
      
  

    
  );
  
  
  
}

export default GamesDetails;
