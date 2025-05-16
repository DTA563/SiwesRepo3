const express = require('express');
const path = require('path')

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

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
