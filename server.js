require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const {createPool} = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');

const app = express();

//CONNECTS TO THE LIGAYA.SQL DATABASE USING WORKBENCH
const db = new createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,//CHANGE ACCORDING TO YOUR WORKBENCH PASSWORD
  database : process.env.DB_NAME,
  queryTimeout : 300000,
  connectionLimit : 20
});

//CREATES SESSION IN DATABASE
const sessionStore = new MySQLStore({
  expiration: 300000,
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
      db.query('SELECT * FROM users', (err, result) => {
        if(err) throw err;
        //CHECKS IF USRENAME ALREADY EXISTS
        db.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.body.Username], (err, result) => {
          if(err) throw err
          else if (result.length) {
            res.render('register', {
              pass: req.body.Password,
              confirm: req.body.ConfirmPassword,
              username: req.body.username,
              available: req.body.username
            });
          }
          else {
            //REGISTER NEW USER TO DATABASE
            let sql = 'INSERT INTO users SET ?';
            db.query(sql,data,(err) => {
              if(err) throw err
            });
            //ADDS A BLANK PROFILE FOR THE NEW USER
            db.query('INSERT INTO profile (username) VALUES (?)', data.username, (err) => {
              if(err) throw err;
            });
            res.redirect('/login');
          };
        });
      });
    }
    else
      res.render('register', {
        pass: req.body.Password,
        confirm: req.body.ConfirmPassword,
        username: req.body.username,
        available: "" 
      });
  } catch {
      res.send(500);
  }
});

app.post('/login', (req, res) => {
  let username = req.body.Username;
	let password = req.body.Password;
  let key = 0;
  let key2 = 1;
  
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
              res.render('login', {
                key: key,
                key2: key2
              });
          });
        });
      }
      else  
        res.render('login', {
            key: key,
            key2: key2
        });
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
  if(req.session.userinfo)
    //DESTROYS THE SESSION ENTRY IN THE DATABASE
    req.session.destroy(function(err){
      if (err) throw err;
      else
        res.redirect("/");
    });
  else
    res.redirect('login');
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
        res.render('password', {
          username: req.session.userinfo,
          pass : req.body.newPass,
          confirm : req.body.confirmNewPass
        });
      });
    });
  }
  else
  res.render('password', {
    username: req.session.userinfo,
    pass : req.body.newPass,
    confirm : req.body.confirmNewPass
  });
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

app.get('/posts', (req, res) => {
  if(req.session.userinfo) {
    db.query('SELECT * FROM cities', (err, result1) => {
      if(err) throw err;
        db.query('SELECT * FROM events', (err, result2) => {
          if(err) throw err;
          db.query('SELECT * FROM posts ORDER BY id DESC', (err, result3) => {
            if(err) throw err;
            else {
              res.render('posts', {
                post1: result1,
                post2: result2,
                post3: result3,
                userLog : req.session.userinfo
              });
            }
          });
        });
    });
  }
  else
    res.redirect('login');
});

app.post('/posts', (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  let data = {
    title: req.body.title,
    location: req.body.location,
    event: req.body.event,
    description: req.body.description,
    username: req.session.userinfo,
    date: today 
  };

  db.query('INSERT INTO posts SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('posts');
  });
});

app.post('/group', (req, res) => {
  let data = {
    username: req.session.userinfo,
    name: req.body.name,
    description: req.body.description,
    social: req.body.social,
    link: req.body.link
  };

  db.query('INSERT INTO groupings SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('groups');
  });
});

app.get('/groups', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM groupings ORDER BY id DESC', (err, result) => {
      if(err) throw err;
      else 
        res.render('groups', {
          userLog: req.session.userinfo,
          groups: result
        });
    });
  else
    res.redirect('login');
});

app.get('/deletePost/:Id',(req, res) => {
  const Id = req.params.Id;

  if(req.session.userinfo)
    db.query('DELETE from posts WHERE id = ?', [Id],(err, result) => {
        if(err) throw err;
        else 
          res.redirect('back');
    });
  else
    res.redirect('login');
});

app.get('/deleteGroup/:Id',(req, res) => {
  const Id = req.params.Id;

  if(req.session.userinfo)
    db.query('DELETE from groupings WHERE id = ?', [Id],(err, result) => {
        if(err) throw err;
        else 
          res.redirect('back');
    });
  else
    res.redirect('login');
});

app.post('/editEvent',(req, res) => {
  const Id = req.body.Id
  console.log(req.params.Id);
  db.query('UPDATE events SET date = ?, description = ? WHERE id = ?',[req.body.date, req.body.description, Id], (err) => {
    if(err) throw err
    else
      res.redirect('index');
  });
});

app.get('/editEvent/:Id',(req, res) => {
  const Id = req.params.Id;

  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE id = ?', [Id],(err, result) => {
        if(err) throw err;
        else  {
          res.render('editEvent', {
            name : result[0].name,
            location : result[0].location,
            Id : result[0].id,
            description : result[0].description,
            date : result[0].date
        });
      }
    });
  else
    res.redirect('login');
});

app.get('/deleteEvent/:Id',(req, res) => {
  const Id = req.params.Id;

  if(req.session.userinfo)
    db.query('DELETE from events WHERE id = ?', [Id],(err, result) => {
        if(err) throw err;
        else 
          res.redirect('back');
    });
  else
    res.redirect('login');
});

app.get('/createEvent', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM cities', (err, result) => {
      if(err) throw err;
      else {
        res.render('createEvent', {
          city: result
        });
    }
  });
  else
    res.redirect('login');
});

app.post('/createEvent', (req, res) => {
  let data = {
    location: req.body.location,
    username: req.session.userinfo,
    name: req.body.name,
    description: req.body.description,
    date: req.body.date
  };

  db.query('INSERT INTO events SET ?', data, (err) => {
    if(err) throw err;
    else
      res.redirect('index');
  });
});

app.get('/edit', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM profile WHERE username = ?', req.session.userinfo, (err, result) => {
      if(err) throw err;
      else {
        res.render('edit', {
          user: result[0]
      });
    }
  });
  else
    res.redirect('login');
});

//ROUTES TO THE INDIVIDUAL VIEW PAGES//
app.get('/', (req, res) => {
  res.render('landing', );
});

app.get('/login', (req, res) => {
  let key = 1;
  let key2 = 1;
    res.render('login', {
      key: key,
      key2: key2
    });
});

app.get('/register', (req, res) => {
  res.render('register', {
    pass: req.body.Password,
    confirm: req.body.ConfirmPassword,
    username: req.body.username,
    available: ""
  });
});

//VIEW PAGES THAT NEEDS LOGIN
app.get('/index', (req, res) => {
  if(req.session.userinfo) { 
    db.query('SELECT * FROM cities', (err, result) => {
      if(err) throw err;
      else
        res.render('index', {
          city : result
      });
    });
  }
  else
    res.redirect('login');
});

app.get('/password', (req, res) => {
  if(req.session.userinfo) 
    res.render('password', {
      username: req.session.userinfo,
      pass : req.body.newPass,
      confirm : req.body.confirmNewPass
    });
  else
    res.redirect('login');
});

app.get('/manila', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Manila'], (err, result) => {
      if(err) throw err;
        else
          res.render('manila', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.redirect('login');
});

app.get('/taguig', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Taguig'], (err, result) => {
      if(err) throw err;
        else
          res.render('taguig', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.send('login');
});

app.get('/makati', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Makati'], (err, result) => {
      if(err) throw err;
        else
          res.render('makati', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.redirect('login');
});

app.get('/quezon', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Quezon'], (err, result) => {
      if(err) throw err;
        else
          res.render('quezon', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.send('login');
});

app.get('/pasay', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Pasay'], (err, result) => {
      if(err) throw err;
        else
          res.render('pasay', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.redirect('login');
});

app.get('/tagaytay', (req, res) => {
  if(req.session.userinfo)
    db.query('SELECT * FROM events WHERE location = ? ORDER BY id DESC', ['Tagaytay'], (err, result) => {
      if(err) throw err;
        else
          res.render('tagaytay', {
            events: result,
            userLog: req.session.userinfo
        });
    });
  else
    res.redirect('login');
});

app.listen(3000, () => console.log('listening on port 3000!'));