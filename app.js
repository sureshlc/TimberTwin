const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myappuser',
    password: 'mypassword',
    database: 'myappdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.render('login'); // Render the login page on the root route
});

app.get('/view', (req, res) => {
    res.render('view');
  });
  
app.get('/scan', (req, res) => {
    res.send('Scan page');
  });
  

app.post('/login', (req, res) => {
  // Example credentials
  const username = 'user';
  const password = 'pass';

  // Check credentials
  if (req.body.username === username && req.body.password === password) {
    res.render('dashboard');    
  } else {
    res.send('Login failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//db query to get tree list
app.get('/api/trees', (req, res) => {
    // Adjust your SQL query to convert POINT to text
    const selectQuery = `
        SELECT 
            id,
            familyname, 
            speciesname, 
            quantity, 
            ST_X(geolocation) AS latitude, 
            ST_Y(geolocation) AS longitude 
        FROM tree;
    `;
    db.query(selectQuery, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data from the database');
            return;
        }
        res.json(results); // Send all tree data as JSON, with geolocation converted
    });
});

app.get('/scan', (req, res) => {
    res.render('scan');
});

app.post('/api/addBarcode', (req, res) => {
    const barcodeData = req.body.code; // The barcode data sent from the client
    // Now, insert this data into your database...
    const insertQuery = 'INSERT INTO your_table (barcode_column) VALUES (?);';
    db.query(insertQuery, [barcodeData], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
            return;
        }
        res.json({ success: 'Data added to the database', id: result.insertId });
    });
});




