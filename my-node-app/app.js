const express = require('express');
const path = require('path');
const mysql = require('mysql');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Dav1D@2105',
    database: 'babcockdb'
  }
);

db.connect();

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
})

app.get('/converter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'converter.html'));
})

app.get('/dateFormatter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'dateFormatter.html'));
})

app.get('/numberSorter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'numberSorter.html'));
})

app.get('/Palindrome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'Palindrome.html'));
})

app.get('/romanNumeral', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'romanNumeral.html'));
})

app.get('/spamFilter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'spamFilter.html'));
})

app.get('/statisticCalculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'statisticCalculator.html'));
})

app.get('/ToDoApp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'ToDoApp.html'));
})

// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

app.get('/mySpace', (req, res) => {
    res.send('This is your space.');
});

app.get('/sendMessage', (req, res) =>{
    const message = req.query.message;
    res.send('The response page' + message);
})

app.get('/department', (req, res) => {
  const sql = 'insert into department (name, school_id, created_at) values ?';

  const values = [
    ['computer information system', 1, '2025-05-22 23:30:05'],
    ['computer technology', 1, '2025-05-22 23:30:05'],
    ['accounting', 2, '2025-05-22 23:30:05'],
    ['economics', 3, '2025-05-22 23:30:05']
  ];

  db.query(sql, [values], (error, result) =>{
    if(error){
      console.log(`failed to insert department ${error}`);
    } else {
      console.log('departments inserted successfully.');
    }
    console.log(result);
  })
  
  db.query('select * from department', (error, result) =>{
  res.send(result);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
