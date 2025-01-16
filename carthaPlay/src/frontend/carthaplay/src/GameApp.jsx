import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import GameCharacter from './GameCharacter';
import QuestionBox from './QuestionBox';
import background from './assets/Background.png';
import healthbar15 from './assets/Healthbar/Health bar15_[full].png';
import healthbar13 from './assets/Healthbar/Health bar13.png';
import healthbar11 from './assets/Healthbar/Health bar11.png';
import healthbar9 from './assets/Healthbar/Health bar9.png';
import healthbar7 from './assets/Healthbar/Health bar7.png';
import healthbar5 from './assets/Healthbar/Health bar5.png';
import healthbar3 from './assets/Healthbar/Health bar3.png';
import healthbar1 from './assets/Healthbar/Health bar1.png';
import healthbar0 from './assets/Healthbar/Health bar0_[empty].png';
import { SpriteAnimator } from 'react-sprite-animator';
import './App.css';
import lightningSprite from './assets/Light.png';

const GameApp = () => {
  const [position, setPosition] = useState({ x: 50 });
  const [characterState, setCharacterState] = useState('idle');
  const [direction, setDirection] = useState('right');
  const [health, setHealth] = useState(8);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const positions = [25, 50, 75];

  const healthBarFrames = [
    healthbar0, healthbar1, healthbar3, healthbar5, healthbar7, healthbar9, healthbar11, healthbar13, healthbar15
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://testcarthaplay.onrender.com/api/question/questions'); 
        console.log(response.data.data)
        setQuestions(response.data.data);

        console.log(questions)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const smoothMoveCharacter = (targetPosition) => {
    const animationDuration = 1000;
    const frames = 60;
    const step = (targetPosition - position.x) / frames;
    let frame = 0;

    const animate = () => {
      if (frame < frames) {
        setPosition((prevPosition) => ({
          x: prevPosition.x + step,
        }));
        frame += 1;
        requestAnimationFrame(animate);
      } else {
        setPosition({ x: targetPosition });
        setCharacterState('idle');
      }
    };
    animate();
  };

  const moveCharacter = (dir) => {
    setCharacterState('running');
    setDirection(dir);

    const currentIndex = positions.indexOf(position.x);
    if (dir === 'left' && currentIndex > 0) {
      smoothMoveCharacter(positions[currentIndex - 1]);
    } else if (dir === 'right' && currentIndex < positions.length - 1) {
      smoothMoveCharacter(positions[currentIndex + 1]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      moveCharacter('left');
    } else if (e.key === 'ArrowRight') {
      moveCharacter('right');
    }
  };

  const handleKeyUp = () => {
    setCharacterState('idle');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, idx) =>
          idx === currentQuestionIndex ? { ...q, y: q.y + 15 } : q
        )
      );
    }, 200);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [position, currentQuestionIndex]);

  useEffect(() => {
    const checkAnswer = () => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.y >= 450) {
        if (currentQuestion.correctAnswer === position.x) {
          setWrongAnswer(false);
          setScore((prevScore) => prevScore + 1);
          setCharacterState('jump');
          setTimeout(() => setCharacterState('idle'), 500);
        } else {
          setWrongAnswer(true);
          setCharacterState('got-hit');
          setHealth((prevHealth) => Math.max(prevHealth - 1, 0));
          setTimeout(() => {
            setCharacterState('idle');
            setWrongAnswer(false);
          }, 500);
        }
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    };

    const interval = setInterval(checkAnswer, 100);
    return () => clearInterval(interval);
  }, [questions, position, currentQuestionIndex]);

  useEffect(() => {
    if (health <= 0) {
      setTimeout(() => {
        alert('Game Over!');
        window.location.reload();
      }, 500);
    } else {
      if (currentQuestionIndex === questions.length - 1) {
        setTimeout(() => {
          alert(`Good Job, your score is: ${score}`);
          window.location.reload();
        }, 6000);
      }
    }
  }, [health]);


  return (
    <div
      className="relative w-full h-screen"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="">
        <div className="absolute top-0 left-0 p-4 text-white font-bold text-xl py-8 ">Score: {score}</div>

        <div className="absolute top-16 left-4 health-bar-wrapper">
          <SpriteAnimator
            sprite={healthBarFrames[health]}
            width={408}
            height={122}
            frameCount={9}
            startFrame={health}
            fps={0}
          />
        </div>

        <GameCharacter
          position={position}
          characterState={characterState}
          direction={direction}
        />

        {wrongAnswer &&
          <div
            className="absolute"
            style={{
              left: `${position.x - 5}%`,
              top: '56%',
            }}
          >
            <SpriteAnimator
              sprite={lightningSprite}
              width={250}
              height={2832 / 11}
              frameCount={11}
              startFrame={0}
              fps={20}
            />
          </div>
        }

        {questions[currentQuestionIndex] && (
          <QuestionBox
            key={questions[currentQuestionIndex].id}
            question={questions[currentQuestionIndex].question}
            answers={questions[currentQuestionIndex].answers}
            y={questions[currentQuestionIndex].y}
          />
        )}
      </div>
    </div>
  );
};

export default GameApp;
