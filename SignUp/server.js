const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'Neelansh123',
  database: 'WP'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.post('/signUp', (req, res) => {
  const { userName, fname, lname, contactNum, email, age, pass, confirmPass } = req.body;

  // Insert user information into the user_info table
  const userInfoData = [userName, fname, lname, contactNum, email, age, pass, confirmPass];
  const userInfoSql = `INSERT INTO spotify (userName, fname, lname, contactNum, email, age, pass, confirmPass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(userInfoSql, userInfoData, (err, result) => {
    if (err) {
      console.error('Error inserting user info:', err);
      return res.status(500).send('Error inserting user info.');
    }

    // Redirect to login page
    res.redirect("/login.html");
  });
});

// Route for login
app.post('/login', (req, res) => {
  const { userName, pass } = req.body;
  
  // Query database to verify login credentials
  const sql = 'SELECT * FROM spotify WHERE userName = ? AND pass = ?';
  connection.query(sql, [userName, pass], (err) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.redirect("/index.html");
  });
});
// Server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
