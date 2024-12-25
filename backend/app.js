
const express = require('express');
require('dotenv').config();
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
app.use('/api/auth', authRoutes);
app.use('/api/question', QuestionRoutes);
app.use('/api/game', gameRoutes);
app.post('/api/signup', async (req, res) => {
  const { username, email, password, role } = req.body;  // Get data from the request body

  // Ensure that email, password, and role are provided
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    // Step 1: Insert the user into the "users" table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password,  // Insert the plain password (not hashed)
          role,
        },
      ])
      .select();  // Get the inserted user data

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    const user = userData[0]; // Get the user from the returned data

    // Step 2: Depending on the role, insert into the "teachers" or "students" table
    if (role === 'teacher') {
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .insert([
          {
            user_id: user.id,  // Link the teacher's user_id with the user's id from the "users" table
          },
        ])
        .select();

      if (teacherError) {
        return res.status(400).json({ error: teacherError.message });
      }

      // Send back success response for teacher
      return res.status(201).json({
        message: 'Teacher created successfully',
        user: user,
        teacher: teacherData[0],  // Include the inserted teacher data
      });
    } else if (role === 'student') {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([
          {
            user_id: user.id,  // Link the student's user_id with the user's id from the "users" table
          },
        ]);

      if (studentError) {
        return res.status(400).json({ error: studentError.message });
      }

      // Send back success response for student
      return res.status(201).json({
        message: 'Student created successfully',
        user: user,
        student: studentData[0],  // Include the inserted student data
      });
    } else {
      // If role is not recognized
      return res.status(400).json({ error: 'Invalid role provided' });
    }
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;  // Get data from the request body

  // Ensure that email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Step 1: Check if the user exists in the "users" table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)  // Find user by email
      .single();  // Get a single row (user)

    if (userError || !userData) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Step 2: Verify the password (plain text comparison - in production, hash comparison is recommended)
    if (userData.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Step 3: Fetch the user's role from the "users" table (it's already in userData)
    const role = userData.role;

    // Step 4: Generate a JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: role },
      process.env.JWT_SECRET, // Secret key for signing the token, store this securely
      { expiresIn: '1h' } // Set token expiration time
    );

    // Step 5: Send back the user data, role, and the token
    res.status(200).json({
      message: 'Login successful',
      token: token, // Send the token
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: role,  // Send the role
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
    const { userId, subject, lesson, difficulty, questions } = req.body;
  
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
  
      // Step 2: Add Questions and Answers
      const insertedQuestions = [];
      for (const questionData of questions) {
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert([
            {
              question: questionData.question,
              correct_answer: questionData.correctAnswer,
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
          const { error: answerError } = await supabase
            .from('answers')
            .insert([
              {
                text: option ,
                question_id: question.id,
              },
            ]);
  
          if (answerError) {
            console.error('Error inserting answer:', answerError);
          }
        }
      }
  
      res.status(201).json({
        message: 'Game and questions created successfully',
        game: gameData,
        questions: insertedQuestions,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  
  
  
  



module.exports = app;
