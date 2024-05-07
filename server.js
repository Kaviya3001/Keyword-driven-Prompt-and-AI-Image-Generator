const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware
const app = express();
const axios = require('axios');
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});
app.use(cors());

// Check if the database connection is successful
pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

app.use(bodyParser.json());
// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    // Insert user into the database
    try {
      const result = await pool.query(
        'INSERT INTO public.signup (user_id, username, email, password_hash) VALUES (nextval(\'signup_user_id_seq\'::regclass), $1, $2, $3) RETURNING user_id',
        [username, email, passwordHash]
      );
  
      const userId = result.rows[0].user_id;
      res.status(201).json({ userId, message: 'User successfully registered' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Login endpoint
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Retrieve user from the database
    try {
      const result = await pool.query(
        'SELECT user_id, password_hash FROM public.signup WHERE email = $1',
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ userId: user.user_id, message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.post('/generate_image_prompt', async (req, res) => {
    try {
      const { keyword } = req.body;
  
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required in the request body' });
      }
  
      const apiUrl = 'http://127.0.0.1:5000/generate_image_prompt';
  
      const response = await axios.post(apiUrl, { keyword });
  
      const imagePrompt = response.data.image_prompt;
  
      res.json({ imagePrompt });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
