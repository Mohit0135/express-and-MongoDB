const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Connect to MongoDB
const url = 'mongodb+srv://Mydbs:Mohit@auth.kcxabfy.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'mydatabase';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  const db = client.db(dbName);
  console.log('Connected to MongoDB');

  // Signup Route
  app.get('/static/signup.html', (req, res) => {
    res.sendFile(__dirname + '/static/signup.html');
  });

  app.post('/static/signup.html', (req, res) => {
    const { username, password } = req.body;

    // Create a new user document
    const newUser = { username, password };

    // Save the new user to the database
    db.collection('users').insertOne(newUser, (err) => {
      if (err) {
        console.error(err);
        res.send('An error occurred during signup.');
      } else {
        res.redirect('/static/login.html');
      }
    });
  });

  // Login Route
  app.get('/static/login.html', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

  app.post('/static/login.html', (req, res) => {
    const { username, password } = req.body;

    // Find the user with the matching credentials
    db.collection('users').findOne({ username, password }, (err, user) => {
      if (err) {
        console.error(err);
        res.send('An error occurred during login.');
      } else if (user) {
        res.send('Login successful!');
      } else {
        res.send('Login unsuccessful. Please check your credentials.');
      }
    });
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
