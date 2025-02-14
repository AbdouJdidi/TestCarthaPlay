
const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const QuestionRoutes = require('./routes/QuestionRoutes')
const gameRoutes = require('./routes/gameRoutes')
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const supabaseUrl = 'https://atxlibiabsrnubvasudo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGxpYmlhYnNybnVidmFzdWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDk3NzMsImV4cCI6MjA0OTEyNTc3M30.tCc2160i2wwtiGbSjuMSoJ_EAkCy2Uo8pLE89m8_ZJM';
const supabase = createClient(supabaseUrl, supabaseKey);



const app = express();
const cors = require('cors');


connectDB();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/question', QuestionRoutes);
app.use('/api/game', gameRoutes);

app.post('/api/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Username, email, password, and role are required' });
  }

  try {
    // Step 1: Hash the password
    const saltRounds = 10; // Number of salt rounds for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 2: Insert the user into the "users" table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword, // Store the hashed password
          role,
        },
      ])
      .select();

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    const user = userData[0];

    // Step 3: Insert into the "teachers" or "students" table based on role
    if (role === 'teacher') {
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .insert([{ user_id: user.id }])
        .select();

      if (teacherError) {
        return res.status(400).json({ error: teacherError.message });
      }

      return res.status(201).json({
        message: 'Teacher created successfully',
        user,
        teacher: teacherData[0],
      });
    } else if (role === 'student') {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{ user_id: user.id }]);

      if (studentError) {
        return res.status(400).json({ error: studentError.message });
      }

      return res.status(201).json({
        message: 'Student created successfully',
        user,
        student: studentData[0],
      });
    } else {
      return res.status(400).json({ error: 'Invalid role provided' });
    }
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Step 1: Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Step 2: Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Step 3: Generate a JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Step 4: Respond with user details and the token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/questions', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('questions')  
        .select('*'); 
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      console.log('Data fetched:', data);
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/answers', async (req, res) => {
    try {
      const { id } = req.query; 
      if (!id) {
        return res.status(400).json({ error: 'Question ID is required' });
      }
  
      const { data, error } = await supabase
        .from('answers') 
        .select('*') 
        .eq('question_id', id);
  
      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ error: error.message });
      }
  
      console.log('Data fetched:', data); 
      res.status(200).json(data);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/games', async (req, res) => {
    try {
      const { userId ,subject, lesson, difficulty } = req.body; // Extract data from the request body
        if (!subject || !lesson || !difficulty) {
        return res.status(400).json({ error: 'All fields are required' });
      }
        const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();
  
      if (teacherError || !teacherData) {
        return res.status(404).json({ error: 'Teacher not found for the provided user ID' });
      }
  
      const teacher_id = teacherData.id;
  
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([
          {
            subject,
            lesson,
            difficulty,
            teacher_id,
          },
        ])
        .select();
  
      if (gameError) {
        return res.status(400).json({ error: gameError.message });
      }
  
      res.status(201).json({ message: 'Game created successfully', data: gameData });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/games/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();
  
      if (teacherError || !teacherData) {
        return res.status(404).json({ error: 'Teacher not found for the provided user ID' });
      }
  
      const teacher_id = teacherData.id;
  
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('teacher_id', teacher_id);
  
      if (gameError) {
        return res.status(400).json({ error: gameError.message });
      }
  
      if (!gameData || gameData.length === 0) {
        return res.status(404).json({ error: 'No games found for this teacher' });
      }
  
      res.status(200).json({ data: gameData });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  app.post('/api/game/:gameId/questions', async (req, res) => {
    const { gameId } = req.params;
    const { questions } = req.body;
    const gameIdint = parseInt(gameId, 10);
  
    try {
      if (isNaN(gameIdint)) {
        return res.status(400).json({ message: 'Invalid game ID format' });
      }
      const { data: gameExists, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('id', gameIdint)
        .single();
  
      console.log('Game Query Result:', gameExists, 'Error:', gameError);
  
      if (!gameExists || gameError) {
        return res.status(404).json({ message: 'Invalid game ID', error: gameError });
      }
  
      const insertedQuestions = [];
      for (const questionData of questions) {
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert([
            {
              question: questionData.question,
              correct_answer: questionData.correctAnswer,
              game_id: gameIdint,
            },
          ])
          .select()
          .single();
  
        if (questionError) {
          console.error('Error inserting question:', questionError);
          continue;
        }
  
        console.log('Inserted Question:', question);
        insertedQuestions.push(question);
  
        for (const option of questionData.options) {
          const { error: answerError } = await supabase
            .from('answers')
            .insert([
              {
                text: option,
                question_id: question.id,
              },
            ]);
  
          if (answerError) {
            console.error('Error inserting answer:', answerError);
          }
        }
      }
  
      res.status(201).json({
        message: 'Questions and answers saved successfully',
        questions: insertedQuestions,
      });
    } catch (error) {
      console.error('Error saving questions and answers:', error);
      res.status(500).json({ message: 'Error saving questions and answers', error: error.message });
    }
  });
  
  app.post('/api/games-with-questions', async (req, res) => {
    const { userId, subject, lesson, difficulty, questions, informations } = req.body;
  
    try {
      // Step 1: Create Game
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();
  
      if (teacherError || !teacherData) {
        return res.status(404).json({ error: 'Teacher not found for the provided user ID' });
      }
  
      const teacher_id = teacherData.id;
  
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([
          {
            subject,
            lesson,
            difficulty,
            teacher_id,
          },
        ])
        .select()
        .single();
  
      if (gameError) {
        return res.status(400).json({ error: gameError.message });
      }
  
      const gameId = gameData.id;
  
      const insertedQuestions = [];
      const insertedInformations = [];
      
      for (const questionData of questions) {
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert([
            {
              question: questionData.question,
              level: questionData.level,
              correct_answer: questionData.correctAnswer,
              order: questionData.order, 
              game_id: gameId,
              
            },
          ])
          .select()
          .single();
  
        if (questionError) {
          console.error('Error inserting question:', questionError);
          continue;
        }
  
        insertedQuestions.push(question);
  
        for (const option of questionData.options) {
          const isCorrect = option === questionData.correctAnswer;
          const { error: answerError } = await supabase
            .from('answers')
            .insert([
              {
                text: option,
                isCorrect: isCorrect,
                question_id: question.id,
              },
            ]);
  
          if (answerError) {
            console.error('Failed to insert answer:', {
              text: option,
              question_id: question.id,
              isCorrect: isCorrect,
              error: answerError.message,
            });
          }
        }
      }
  
      for (const infoData of informations) {
        const { data: info, error: infoError } = await supabase
          .from('informations')
          .insert([
            {
              info: infoData.info,
              level : infoData.level,
              order: infoData.order,
              game_id: gameId,
              
            },
          ])
          .select()
          .single();
  
        if (infoError) {
          console.error('Error inserting information:', infoError);
          continue;
        }
  
        insertedInformations.push(info);
      }
  
      res.status(201).json({
        message: 'Game, questions, and information created successfully',
        game: gameData,
        questions: insertedQuestions,
        informations: insertedInformations,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.delete('/api/games/:gameId', async (req, res) => {
    const { gameId } = req.params;
  
    try {
      // Step 1: Retrieve all question IDs associated with the game
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('game_id', gameId);
  
      if (questionsError) {
        return res.status(400).json({ error: 'Failed to retrieve questions for the game' });
      }
  
      if (!questions || questions.length === 0) {
        return res.status(404).json({ error: 'No questions found for the provided game ID' });
      }
  
      const questionIds = questions.map((q) => q.id);
  
      // Step 2: Delete all answers associated with the questions
      const { error: answersError } = await supabase
        .from('answers')
        .delete()
        .in('question_id', questionIds);
  
      if (answersError) {
        return res.status(400).json({ error: 'Failed to delete answers for the questions' });
      }
  
      // Step 3: Delete all questions associated with the game
      const { error: deleteQuestionsError } = await supabase
        .from('questions')
        .delete()
        .eq('game_id', gameId);
  
      if (deleteQuestionsError) {
        return res.status(400).json({ error: 'Failed to delete questions for the game' });
      }
  
      // Step 4: Delete the game
      const { error: deleteGameError } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);
  
      if (deleteGameError) {
        return res.status(400).json({ error: 'Failed to delete the game' });
      }
  
      res.status(200).json({ message: 'Game and its related data deleted successfully' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  app.put('/api/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { question } = req.body; 
  
    try {
      const { data : questionData, error } = await supabase
        .from('questions')
        .update({ question }) 
        .eq('id', id)
        .select();
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json(questionData[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.get('/api/questions/:gameId', async (req, res) => {
    const { gameId } = req.params;
    console.log(gameId);
    try {
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question, correct_answer')
        .eq('game_id', gameId);
  
      if (questionsError) {
        return res.status(400).json({ error: questionsError.message });
      }
  
      const questionIds = questions.map((q) => q.id);
      const { data: answers, error: answersError } = await supabase
        .from('answers')
        .select('id, text,isCorrect, question_id')
        .in('question_id', questionIds);
  
      if (answersError) {
        return res.status(400).json({ error: answersError.message });
      }
  
      const questionsWithAnswers = questions.map((question) => ({
        ...question,
        options: answers
          .filter((answer) => answer.question_id === question.id)
          .map((answer) => ({
            id: answer.id,
            text: answer.text,
            isCorrect : answer.isCorrect,
          })),
      }));
  
      res.status(200).json(questionsWithAnswers);
    } catch (err) {
      console.error('Internal server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/api/options/:optionId', async (req, res) => {
    const { optionId } = req.params;
    const { text } = req.body;
  
    try {
      const { data: updatedOption, error } = await supabase
        .from('answers')
        .update({ text })
        .eq('id', optionId)
        .select();
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json(updatedOption[0]);
    } catch (err) {
      console.error('Error updating option:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/api/questions/:questionId/correct', async (req, res) => {
    const questionId = req.params.questionId;
    const { correct_answer } = req.body;
    console.log(`Setting correct answer for question ID: ${questionId}`);
  
    if (!correct_answer) {
      return res.status(400).json({ error: 'Correct answer is required' });
    }
  
    try {
      // Update the correct_answer in the questions table
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .update({ correct_answer })
        .eq('id', questionId)
        .select()
        .single();
  
      if (questionError) {
        throw questionError;
      }
  
      if (!questionData) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      console.log(`Correct answer updated for question ID: ${questionId}`);
  
      // Update the isCorrect field in the answers table
      const { error: answersError } = await supabase
        .from('answers')
        .update({ isCorrect: false }) // Set all answers to false first
        .eq('question_id', questionId);
  
      if (answersError) {
        throw answersError;
      }
  
      const { error: correctAnswerError } = await supabase
        .from('answers')
        .update({ isCorrect: true }) // Set isCorrect to true for the correct answer
        .eq('question_id', questionId)
        .eq('text', correct_answer);
  
      if (correctAnswerError) {
        throw correctAnswerError;
      }
  
      res.status(200).json({
        message: 'Correct answer updated successfully, and answer correctness adjusted',
      });
    } catch (err) {
      console.error('Error updating correct answer:', err.message);
      res.status(500).json({ error: 'Failed to update correct answer and answer correctness' });
    }
  });
  
  app.get('/api/games-with-questions/:gameId', async (req, res) => {
    const { gameId } = req.params;
  
    try {
      // Step 1: Fetch game details
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();
  
      if (gameError || !game) {
        return res.status(404).json({ error: 'Game not found' });
      }
  
      // Step 2: Fetch questions related to the game
      const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('game_id', gameId)
        .order('order', { ascending: true }); // Order questions properly
  
      if (questionError) {
        return res.status(400).json({ error: questionError.message });
      }
  
      // Step 3: Fetch answers for each question
      for (let question of questions) {
        const { data: options, error: answerError } = await supabase
          .from('answers')
          .select('*')
          .eq('question_id', question.id);
  
        if (answerError) {
          console.error('Error fetching answers for question:', answerError);
          question.options = [];
        } else {
          question.options = options;
        }
      }
  
      // Step 4: Fetch informations related to the game
      const { data: informations, error: infoError } = await supabase
        .from('informations')
        .select('*')
        .eq('game_id', gameId)
        .order('order', { ascending: true }); // Order informations properly
  
      if (infoError) {
        return res.status(400).json({ error: infoError.message });
      }
  
      // Step 5: Merge questions and informations into a single ordered array
      const combinedData = [...questions, ...informations].sort((a, b) => a.order - b.order);
  
      // Step 6: Return structured data
      res.status(200).json({
        game,
        content: combinedData, // Ordered list of questions & informations
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/update-order", async (req, res) => {
    const { updatedOrder } = req.body;
    console.log(req.body)
  
    try {
      console.log(updatedOrder)
      const updates = updatedOrder.map((item) =>
        supabase
          .from(item.table)
          .update({ order: item.order })
          .eq("id", item.id)
      );
  
      const results = await Promise.all(updates);
  
      // Check for errors
      if (results.some(({ error }) => error)) {
        return res.status(500).json({ message: "Error updating order", results });
      }
  
      res.json({ message: "Order updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  app.put('/api/informations/:id', async (req, res) => {
    const { id } = req.params;
    const { info } = req.body; 
    console.log(info)
  
    try {
      const { data: infoData, error } = await supabase
        .from('informations')
        .update({ info })
        .eq('id', id)
        .select();
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json(infoData[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

  



module.exports = app;
