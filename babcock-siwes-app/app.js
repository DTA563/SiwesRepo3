const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { render } = require('ejs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer');

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'Dav1D@2105',
    database: 'babcockdb'
  }
);

db.connect();

const app = express();

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true
}));

const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.mimetype;
    let folder = 'uploads/others/';

    if (fileType.startsWith('image/')) {
      folder = 'uploads/images/';
    } else if (fileType === 'application/pdf' || fileType === 'application/msword') {
      folder = 'uploads/documents/';
    }

    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'public/views'));

app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.get('/home', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.render('home');
});

app.get('/', (req,res) =>{
  res.render('login-page');
})

app.get('/signup', (req,res) =>{
  res.render('signUp-page');
})

app.get('/details', (req, res) => {
  const sql = 'SELECT * FROM schools';

  db.query(sql, (err, results) => {
    res.render('details', { schools: results });
  });
});

app.get('/details-saved', (req,res) =>{
  res.render('details-saved');
})

app.get('/search-results', (req,res) =>{
  res.render('search-results');
})

app.get('/login-failed', (req,res) =>{
  res.render('login-failed');
})

app.get('/signUp-success', (req,res) =>{
  res.render('signUp-success');
})

app.get('/signUp-failed', (req,res) =>{
  res.render('signUp-failed');
})

app.post('/sign-up', upload.single('myFile'), (req, res) => {
  const {
    firstName,
    lastName,
    age,
    matricNo,
    level,
    password
  } = req.body;

  const uploadedFile = req.file;
  const filePath = uploadedFile ? uploadedFile.path : null;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded');
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword'
  ];

  if (!allowedTypes.includes(uploadedFile.mimetype)) {
    return res.status(400).send('Unsupported file type');
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Hashing failed:', err);
      return res.redirect('/signUp-failed');
    }

    const sql = `INSERT INTO students
      (first_name, last_name, age, matric_no, level, password, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [firstName, lastName, age, matricNo, level, hash, filePath];

    db.query(sql, values, (err, results) => {
      if (err || !firstName || !lastName || !password || !matricNo) {
        console.error('Insert failed:', err);
        return res.redirect('/signUp-failed');
      }
      console.log('Data inserted successfully');
      res.redirect('/signUp-success');
    });
  });
});


app.post('/login', (req, res) => {
  const { matricNo, password } = req.body;

  const sql = `SELECT * FROM students WHERE matric_no = ?`;

  db.query(sql, [matricNo], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.redirect('/login-failed');
    } else if (results.length === 0) {
      console.log('No user found');
      return res.redirect('/login-failed');
    }

    const user = results[0];
    const storedHash = user.password;

    bcrypt.compare(password, storedHash, (err, isMatch) => {
      if (err) {
        console.error('bcrypt error:', err);
        return res.redirect('/login-failed');
      } else if (!isMatch) {
        console.log('Incorrect password');
        return res.redirect('/login-failed');
      } else if(isMatch){
        req.session.userId = user.id;
        res.redirect('/home');
      }
    });
  });

  if (!matricNo || !password) {
    return res.redirect('/login-failed');
  }
});

app.post('/submit-form', (req, res) => {
  const studentId = req.session.userId;

  if (!studentId) {
    return res.redirect('/');
  }

  const {
    schoolid,
    departmentid,
    companyName,
    companyAddress,
    dateStarted,
    dateEnded
  } = req.body;

  const sql = `INSERT INTO siwes
    (student_id, school_id, department_id, company_name, company_location, date_started, date_ended) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [studentId, schoolid, departmentid, companyName, companyAddress, dateStarted, dateEnded];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.log('Insert failed:', err);
      return res.render('failed');
    } else {
      console.log('SIWES data inserted for student:', studentId);
      res.redirect('/details-saved');
    }
  });
});

app.get('/departments', (req, res) => {
  const schoolId = req.query.schoolid;
  const sql = 'SELECT * FROM department WHERE school_id = ?';

  db.query(sql, [schoolId], (err, results) => {
    if (err) {
      return console.log(err);
    }
    res.json(results);
  });
});

app.get('/search', (req, res) => {
  if(!req.session.userId){
    return res.redirect('/')
  }
  const searchTerm = req.query.search;
  const nameFilter = `%${searchTerm}%`;

  const sql = `
    SELECT siwes.*, schools.name AS school_name, department.name AS department_name, students.*
    FROM siwes
    JOIN schools ON schools.id = siwes.school_id
    JOIN department ON department.id = siwes.department_id
    JOIN students ON students.id = siwes.student_id
    WHERE students.matric_no = ?
    OR LOWER(students.first_name) LIKE LOWER(?)
    OR LOWER(students.last_name) LIKE LOWER(?)
  `;

  db.query(sql, [searchTerm, nameFilter, nameFilter], (err, searchFind) => {
    if (err || searchFind.length === 0) {
      console.error('Search failed:', err);
      return res.render('failed-search');
    } else{
      console.log('Search results:', searchFind);
      res.render('search-results', { searchFind });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});