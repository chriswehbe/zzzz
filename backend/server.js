const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser =require('body-parser');
const cookieParser = require ('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const buffer =require('buffer').Buffer
const {createHash} = require('crypto')
const app = express();
  app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }));
  app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  // key: 'user', 'loggedIn',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.listen(8081, () => {
    console.log(`Express server listening on port 8081`);
  });

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'teachersapp',
    multipleStatements: true
  });

  app.post('/postassesment', (req, res) => {
    const query = `
      INSERT INTO teachersapp.assesments (materialid, assesmentname, assesmenttype, questiontype, year)
      VALUES (?);
    `;
    
    const values = [req.body[0], req.body[3], req.body[1], req.body[2], req.body[4]];
  
    connection.query(query, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
  
      // Retrieve the ID of the last inserted row
      const insertedId = result.insertId;
  
      return res.json({ created: true, assesmentid: insertedId });
    });
  });
  app.post('/creatematerial', (req, res) =>{
    const query = `
    INSERT INTO teachersapp.materials (materialid, materialname)
    values (?);
  `;
  
  const values = [req.body.materialID, req.body.materialName];
    connection.query(query, [values], (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json({created : true})
    })
  })

  app.post('/activateassesment', (req, res) => {
    const query = `
      UPDATE teachersapp.assesments SET status = 1 WHERE assesmentid = ${req.body.assesmentid};
    `;
     
    
    connection.query(query, (err, data) => {
      if (err) {
        return res.status(500).json({ err });
      }
      return res.json({ success: true });
    });
  });

  app.post('/createAssesment', (req, res) => {
    const { questions, newAssesmentID } = req.body;
  
    const insertQuery = 'INSERT INTO teachersapp.questions (assesmentid, questiontext) VALUES ?';
  
    const values = questions.map((question) => [newAssesmentID, question.text]);
  
    connection.query(insertQuery, [values], (error, results) => {
      if (error) {
        console.error('Error inserting questions:', error);
        return res.status(500).json({ error });
      }
  
      return res.json({ message: 'success' });
    });
  });
  
  app.post('/insertanswers', (req, res) => {
    const { answers, userid } = req.body;
  
    const insertQuery = 'INSERT INTO teachersapp.answers (questionid, text, userid) VALUES ?;';
  
    const values = answers.map((answer) => [answer.id, answer.text, userid]);
  
    connection.query(insertQuery, [values], (error, results) => {
      if (error) {
        console.error('Error inserting answers:', error);
        return res.status(500).json({ error });
      }
  
      return res.json({ message: 'success' });
    });
  });


  app.post('/updatequestions', (req, res) => {
    const { questions } = req.body;
  
   
    const updateQuery = 'UPDATE teachersapp.questions SET questiontext = ? WHERE questionid = ?';
  
    
    const values = questions.flatMap((question) => [question.text, question.questionid]);
  
    connection.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error('Error updating questions:', error);
        return res.status(500).json({ error });
      }
  
      return res.json({ message: 'success' });
    });
  });

  app.post('/removequestion', (req, res) => {
    const value = req.body.questionid;
  
   
    const deleteQuery = 'update teachersapp.questions set status = 0 WHERE questionid = ?';
  
    
  
    connection.query(deleteQuery, [value], (error, results) => {
      if (error) {
        console.error('Error deleting questions:', error);
        return res.status(500).json({ error });
      }
  
      return res.json({ message: 'success' });
    });
  });

  app.get('/getmaterials', (req, res) =>{
    const query = `
    select * from teachersapp.materials;
  `;
  
    connection.query(query, (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json(data)
    })
  })

  app.get('/getquestions', (req, res) => {
    const { assessmentID } = req.query;
  
    if (!assessmentID) {
      return res.status(400).json({ error: 'Missing assesmentID in query parameters' });
    }
  
    const query = `
      SELECT * FROM teachersapp.questions WHERE assesmentid = ? and status = 1;
    `;
  
    connection.query(query, [assessmentID], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json(data);
    });
  });
  
  app.post('/getquestionsandanswers', (req, res) => {
    
  
  
    const query = `
    select * from teachersapp.questions left join teachersapp.answers on questions.questionid=answers.questionid where (assesmentid ,userid) = (?);
    `;
  const values = [req.body.assessmentID, req.body.userID]
  console.log(query)
  console.log(values)
    connection.query(query, [values], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json(data);
    });
  });


  app.get('/getassesments', (req, res) =>{
    const query = `
    select * from teachersapp.assesments left join teachersapp.materials on materials.materialid=assesments.materialid;
  `;
  
    connection.query(query, (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json(data)
    })
  })

  app.post('/isanswered', (req, res) =>{
    
    const query = `
    select * from teachersapp.assesments left join teachersapp.questions on assesments.assesmentid=questions.assesmentid left join teachersapp.answers on questions.questionid=answers.questionid where (assesments.assesmentid ,userid) = (?);
  `;
   const values = [req.body.assesmentID, req.body.userid]
    connection.query(query,[values], (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json({isAnswered: data.length>0})
    })
  })

  app.post('/useranswered', (req, res) =>{
    
    const query = `
    select * from teachersapp.users where userid in (select userid from teachersapp.answers  left join teachersapp.questions on  answers.questionid=questions.questionid where assesmentid  = ?);;
  `;
   
    connection.query(query,[req.body.assesmentID], (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json({data})
    })
  })


    app.get('/getquestionstype', (req, res) =>{
    const query = `
    select * from teachersapp.questionstype;
  `;
  
    connection.query(query, (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json(data)
    })
  })

    app.get('/getassesmenttype', (req, res) =>{
    const query = `
    select * from teachersapp.assesmenttype;
  `;
  
    connection.query(query, (err, data) =>{
      if(err){
  return res.status(500).json({ err });    }
      return res.json(data)
    })
  })

app.post('/signup', (req, res) =>{
  const query = `
  INSERT INTO teachersapp.users (email, lname, fname, password, isadmin)
  values (?, false);
`;

const values = [req.body.email, req.body.lastName, req.body.firstName, req.body.password];
  connection.query(query, [values], (err, data) =>{
    if(err){
return res.status(500).json({ err });    }
    return res.json({signedUp : true})
  })
})


app.post('/signupCheck', (req, res) =>{
  const query = `
  SELECT * FROM teachersapp.users WHERE email = ?;
`;

const values = [req.body.email];
  connection.query(query, [values], (err, data) =>{
    if(err){
      return res.json("error");
    }
    if(res.length >0){
      return res.json({emailExists : true})
    }else{
      return res.json({emailExists : false})
    }
  })
})


app.post('/login', (req, res) =>{
  const query = `
  SELECT * FROM teachersapp.users WHERE email = ? and password = ? ;
`;

  connection.query(query, [req.body.email, req.body.password], (err, result) =>{
    if(err || !result.length){
      return res.json("error");
    }
    const header = '{"alg":"HS256","typ":"JWT"}'
    const payload = {userid : result[0].userid, loggedInAs:req.body.email,isAdmin: result[0].isadmin === 1}
    const key = 'secretkey'
    const stringifiedPayload =JSON.stringify(payload)
const unsignedToken = buffer.from(header).toString('base64') + '.' + buffer.from(stringifiedPayload).toString('base64')
const signature = createHash("sha256").update(key).digest(unsignedToken)
const token = buffer.from(header).toString('base64') + '.' + buffer.from(stringifiedPayload).toString('base64') + '.' + buffer.from(signature).toString('base64')
  return res.json({LoggedIn: result.length >0, isAdmin: result[0].isadmin === 1, token})

  })
})




    





