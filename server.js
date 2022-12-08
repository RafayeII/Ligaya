require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');

const app = express();

//CONNECTS TO THE LIGAYA.SQL DATABASE USING WORKBENCH
const db = mysql.createConnection({
  connectionLimit : 1000,
  connectTimeout  : 60 * 60 * 1000,
  acquireTimeout  : 60 * 60 * 1000,
  timeout         : 60 * 60 * 1000,
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

//CREATES SESSION IN DATABASE
const sessionStore = new MySQLStore({
  expiration: 10800000,
  createDatabaseTable: true,
  schema: {
    tableName: 'session',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, db);

//CONFIRMS CONNECTION OR THROWS ERROR
db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    db.release()
    return;
  }
  else
    console.log('connected as ID' + db.threadId);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(session ({
  key   : process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store : sessionStore,
  resave: false,
  saveUninitialized: false
}))

app.post('/register', async (req, res) => {
  try {
    //PASSWORD HASHING
    const salt = await bcrypt.genSalt(1)
    const hashedPassword = await bcrypt.hash(req.body.Password, salt)

    //STORE INPUTS INTO DATA
    let data = {
      name: req.body.FirstName + ' ' + req.body.LastName,
      email: req.body.Email,
      username: req.body.Username,
      password: hashedPassword //SENDS THE HASH PASSOWRD TO DATABASE
    };
  
    //CHECK IF THE TWO PASSWORD INPUTS MATCH
    if(req.body.Password == req.body.ConfirmPassword){
      let sql = 'INSERT INTO users SET ?';
      //REGISTER NEW USER TO DATABASE
      db.query(sql,data,(err) => {
        if(err) throw err
      });
      //ADDS A BLANK PROFILE FOR THE NEW USER
      db.query('INSERT INTO profile (username) VALUES (?)', data.username, (err) => {
        if(err) throw err;
      });
      res.redirect('/login');
    }
    else
      res.send('Passwords did not Match!');
  } catch {
    res.status(500).send()
  }
});

app.post('/login', (req, res) => {
  let username = req.body.Username;
	let password = req.body.Password;
  
  //CHECKS FOR USERNAME AND PASSWORD INPUTS
  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, userGate) => {
      if(err) throw err;
      //CHECKS IF THE USER EXITS IN THE DATABASE
      else if (userGate.length > 0) {
        //GETS PASSWORD FROM DATABASE AND STORES IT INTO PASSGATE
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, passGate) => {
          if(err) throw err;
          //STORES RESULT OF COMPARE TO MATCHED
          bcrypt.compare(password, passGate[0].password, (err, matched) => {
            if(err) throw err;
            //COMPARES PASSWORD INPUT WITH HASHED PASSWORD FROMD DATABASE
            else if(matched) {
              req.session.userinfo = username; //IDENTIFIES THE USER WITHIN THE SESSION
              res.redirect('/index');
            }
            else
              res.send('Username or Password is Incorrect!');
          });
        });
      }
      else  
        res.send('Username or Password is Incorrect!');
    });
  }
});

app.post("/search", (req, res) => {
  let user = req.body.search

  db.query('SELECT * FROM profile WHERE username = ?',[user],(err,result) => {
    if(err) throw err
    //CHECKS IF USER EXISTS IN DATABASE
    else if (result.length > 0) {
      res.render('users', {
        //RETURNS USER'S PROFILE TO DISPLAY ON PAGE
        username: user,
        bio: result[0].biography,
        hobby: result[0].hobbies,
        contact: result[0].contacts,
        link: result[0].links
      });
    }
    else 
      res.render('users', {
        //RETURNS BLANK PAGE
        username: 'User does not Exist!',
        bio: 'No Data',
        hobby: 'No Data',
        contact: 'No Data',
        link: 'No Data'
      });
  });
});

app.get("/logout", (req, res) => {
  //DESTROYS THE SESSION ENTRY IN THE DATABASE
  req.session.destroy(function(err){
    if (err) throw err;
    else
      res.redirect("/");
  });
});

app.post('/save', (req, res) => {
  //EDITS PROFILE INFORMATION USING USER'S INPUTS
  db.query('UPDATE profile SET biography = ?, hobbies = ?, contacts = ?, links = ? WHERE username = ?', [req.body.Bio, req.body.Hobby, req.body.Contact,req.body.Link, req.session.userinfo], (err) => {
    if(err) throw err
    else
      res.redirect('profile');
  });
});

app.post('/savePass', async (req, res) => {
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;
  let confirm = req.body.confirmNewPass;

  //APPLY HASH ON NEW PASSWORD
  const salt =  await bcrypt.genSalt(1)
  const newHashedPassword = await bcrypt.hash(newPass, salt)

  //CONFIRMS THE NEW PASSWORD INPUT
  if(newPass == confirm) {
    //STORES THE USER INFO TO RESULT
    db.query('SELECT * FROM users WHERE username = ?', [req.session.userinfo], (err, result) => {
      if(err) throw err;
      //COMPARES OLD PASSWORD AND PASSWORD FROM RESULT
      bcrypt.compare(oldPass, result[0].password, (err, matched) => {
        if(err) throw err;
        else if(matched) {
          //UPDATES OLD PASSWORD WITH NEW HASH PASSWORD
          db.query('UPDATE users SET password = ? WHERE username = ?', [newHashedPassword, req.session.userinfo], (err) => {
            if(err) throw err
            else
              res.redirect('profile');
          });
        }
        else
          res.send('Old Password is Incorrect!');
      });
    });
  }
  else
    res.send('Passwords did not Match!');
});

app.get('/profile', (req, res) => {
  //CHECKS IF THERE IS A ONGOING SESSION
  if(req.session.userinfo) { 
    //MYSQL STATEMENT TO GET THAT USER'S PROFILE AS THE ONLY VALUE IN THE ARRAY
    db.query('SELECT * FROM profile WHERE username = ?',[req.session.userinfo],(err,result) => {
      if(err) throw err
      else
        res.render('profile', {
          //RETURNS USER'S PROFILE TO DISPLAY ON PAGE
          username: req.session.userinfo,
          bio: result[0].biography,
          hobby: result[0].hobbies,
          contact: result[0].contacts,
          link: result[0].links
        });
    });
  }
  else
    res.redirect('login');
});

app.post('/funrunpost', (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //JANUARY IS 0
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  let data = {
    title: req.body.title,
    description: req.body.description,
    username: req.session.userinfo,
    date: today 
  };

  db.query('INSERT INTO funruns SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('funrun');
  });
});

app.get('/funrun', (req, res) => {
  if(req.session.userinfo) { 
    db.query('SELECT * FROM funruns', (err, result) => {
      if(err) throw err;
      else
        res.render('funrun', {
          funruns: result
        });
    });
  }
  else
    res.redirect('login');
});

app.post('/festivalpost', (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  let data = {
    title: req.body.title,
    description: req.body.description,
    username: req.session.userinfo,
    date: today 
  };

  db.query('INSERT INTO festivals SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('festival');
  });
});

app.get('/festival', (req, res) => {
  if(req.session.userinfo) {
    db.query('SELECT * FROM festivals', (err, result) => {
      if(err) throw err;
      else
        res.render('festival', {
          festivals: result
        });
    });
  }
  else
    res.redirect('login');
});

app.post('/tournamentpost', (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  let data = {
    title: req.body.title,
    description: req.body.description,
    username: req.session.userinfo,
    date: today 
  };

  db.query('INSERT INTO tournaments SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('tournament');
  });
});

app.get('/tournament', (req, res) => {
  if(req.session.userinfo) {
    db.query('SELECT * FROM tournaments', (err, result) => {
      if(err) throw err;
      else 
        res.render('tournament', {
          tournaments: result
        });
    });
  }
  else
    res.redirect('login');
});

//ROUTES TO THE INDIVIDUAL VIEW PAGES//
app.get('/', (req, res) => {
  res.render('landing', );
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});

//VIEW PAGES THAT NEEDS LOGIN
app.get('/index', (req, res) => {
  if(req.session.userinfo) 
    res.render('index');
  else
    res.redirect('login');
});
app.get('/edit', (req, res) => {
  if(req.session.userinfo)
  res.render('edit', {username: req.session.userinfo})//DISPLAYS THE PROFILE FOR THAT USER IN SESSION
  else
    res.redirect('login');
});
app.get('/password', (req, res) => {
  if(req.session.userinfo) 
    res.render('password', {username: req.session.userinfo});
  else
    res.redirect('login');
});
app.get('/manila', (req, res) => {
  if(req.session.userinfo)
    res.render('manila');
  else
    res.redirect('login');
});
app.get('/taguig', (req, res) => {
  if(req.session.userinfo)
    res.render('taguig');
  else
    res.send('login');
});
app.get('/makati', (req, res) => {
  if(req.session.userinfo)
    res.render('makati');
  else
    res.redirect('login');
});
app.get('/quezon', (req, res) => {
  if(req.session.userinfo)
    res.render('quezon');
  else
    res.send('login');
});
app.get('/pasay', (req, res) => {
  if(req.session.userinfo)
    res.render('pasay');
  else
    res.redirect('login');
});
app.get('/tagaytay', (req, res) => {
  if(req.session.userinfo)
    res.render('tagaytay');
  else
    res.redirect('login');
});

app.listen(3000, () => console.log('listening on port 3000!'));
