const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Subforum = require('./models/Subforum');
const Thread = require('./models/Thread');
const Comment = require('./models/Comment');
const withAuth = require('./middleware');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const cors = require('cors');
// const merlin = require('merlin');

const app = express();

const secret = 'thisismysecretthatisnotinthegiffolderu';

const dbname = 'react_ca2';


// enchange security with helmet
app.use(helmet());

// get the CORS working
app.use(cors());


// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// get logs when the app is accessed
// app.user(merlin('dev'));

// serve files from the dist directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// URL to our DB - will be loaded from an env variable or will use local DB
const dbroute = process.env.MONGODB_URL;

let db;

// connect to the db and start the express app
// MongoClient.connect(dbroute, {useNewUrlParser: true}, (err, client) => {
//   if (err) throw err;
//
//   db = client.db(dbname);
//   // start the express web app listening
//
// });


mongoose.connect(dbroute, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log('Successfully connected');
  }
});
// solves deprecation error
mongoose.set('useCreateIndex', true);
// define the various endpoints


//
// app.get('/api/home', (req, res) => {
//   res.send('Welcome!');
// });

// register a new user
app.post('/api/register', (req, res) => {
  req.body.created_on = new Date();
  req.body.admin = false;
  const {
    email,
    password,
    name,
    created_on,
    admin
  } = req.body;
  const user = new User({ email, password, name, created_on, admin});
  user.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error registering new user please try again.');
    } else {
      // issue a token there
      console.log('user registered');
      const payload = { email };
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res.cookie('token', token, { httpOnly: true }).sendStatus(200);
      // res.status(200).send('Welcome to the club!');
    }
  });
});

// authenticate the user
app.post('/api/authenticate', (req, res)=>{
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) =>{
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

// check if the user is  logged in/ has a token
app.get('/api/checkToken', withAuth, (req, res) => {
  // console.log('someone checked the token and it has it');
  res.sendStatus(200);
});

// logout the user
app.get('/api/logout', withAuth, (req, res) =>{
  res.cookie('token', '', { httpOnly: true }).sendStatus(200);
});

// retrieve all subforums
app.get('/api/subforums', (req, res) => {
  // db.collection('subforums').find().toArray((err, result) => {
  //   if (err) throw err;
  //   // console.log(result);
  //   res.send(result);
  // });
  Subforum.find({}, (err, subforums) => {
    if (err) throw err;
    res.status(200).send(subforums);
  });
});

// get one subforum  - might not need this
app.get('/api/subforums/:id', (req, res) => {
  // db.collection('subforums').findOne({_id: new ObjectID(req.params.id) }, (err, result) => {
  //   if (err) throw err;
  //   // console.log(result);
  //   res.send(result);
  // });
  Subforum.findOne({_id: new ObjectID(req.params.id)}, (err, result) => {
    if (err) throw err;
    res.status(200).send(result);
  });

});

// get all the threads
app.get('/api/threads', (req, res) => {

  // db.collection('threads').find().toArray( (err, threads) => {
  //   if (err) throw err;
  //
  //   // console.log(threads);
  //   res.send(threads);
  // });
  Thread.find({}, (err, threads) => {
    if (err) throw err;
    res.status(200).send(threads);
  });
});

// insert a comment
app.post('/api/comment', withAuth, (req, res) => {
  req.body._id = new ObjectID();
  req.body.threadId = new ObjectID(req.body.threadId);
  // req.body.name = req.email;
  User.findOne({email: req.email}, (err, user) => {
    if(err) throw err;
    req.body.name = user.name;
    const comment = new Comment(req.body);
    comment.save(err=>{
      if (err) throw err;
      res.status(200).json({success:true});
    });
  });
  // db.collection('comments').insertOne(req.body);
  // res.send({success:true});

});

// get comments from a thread
app.get('/api/comment/:threadId', (req, res) => {

  // db.collection('comments').find({threadId: new ObjectID(req.params.threadId)}).toArray((err, comments) => {
  //   res.send(comments);
  // });
  Comment.find({threadId: new ObjectID(req.params.threadId)}, (err, comments) => {
    if (err) throw err;
    res.status(200).send(comments);
  });
});

// get threads by subforum name
app.get('/api/threads/:name', (req, res) =>{
  // console.log(req.params.name);
  if(req.params.name === 'undefined') {
    res.status(400).json({success:false});
  } else {
    // db.collection('subforums').findOne({name:req.params.name}, (err, subforum)=>{
    //   if (err) throw err;
    //   //
    //   // console.log(subforum);
    //   db.collection('threads').find({subforum_id: new ObjectID(subforum._id) }).toArray( (err, threads) => {
    //     if (err) throw err;
    //     // console.log(threads);
    //     res.send(threads);
    //
    //   });
    // });
    Subforum.findOne({name:req.params.name}, (err, subforum) => {
      if (err) throw err;
      Thread.find({subforum_id: new ObjectID(subforum._id)}, (err, threads) => {
        if (err) throw err;
        res.status(200).send(threads);
      });
    });

  }
});

// get thread by  id
app.get('/api/thread/:id', (req, res) =>{
  // console.log('get thread by id!');
  Thread.findOne({_id: new ObjectID(req.params.id)}, (err, thread) =>{
    if (err) throw err;
    // delete thread.rate;
    // delete thread.subforum_id;
    // delete thread.rated_by;
    // delete thread.created_on;
    res.status(200).send(thread);
  });

});

// add a thread in a subforum by subforum name
app.post('/api/thread/:name', withAuth, (req, res) =>{

  User.findOne({email:req.email}, (err, user) => {
    if (err) {
      throw err;
    }
    if(!user) {
      res.status(401)
        .json({
          error: 'No user found with this email'
        });
    } else {
      Subforum.findOne({name: req.params.name}, (err, subforum) => {
        if (err) throw err;
        if (!subforum) {
          req.status(401)
            .jons({
              error: 'No subforum with this name, can\'t create thread'
            });
        } else {
          const thread = new Thread({
            title: req.body.title,
            subtitle: req.body.subtitle,
            body: req.body.body,
            image: req.body.image,
            rate:0,
            rated_by:[],
            subforum_id: new ObjectID(subforum._id),
            created_by: new ObjectID(user._id),
            created_on: new Date()
          });
          thread.save(err=>{
            if(err) {
              res.status(401)
                .json({
                  error: 'I could not add a new thread for some reason'
                });
            }
            console.log('new thread created');
            res.status(200).send({message: 'YOU CREATED A THREAD GG!!'});
          });
        }
      });
    }
  });
});

// rate a thread
app.put('/api/ratethread/:id', withAuth, (req, res) => {
  const rate = parseInt(req.body.rate);
  if(rate !== 1 && rate !== -1) {
    console.log('Rate is invalid!!!');
    res.sendStatus(401).json({error: 'Your rate is invalid'});
  }
  Thread.findOne({_id: new ObjectID(req.params.id)}, (err, thread) => {
    if(err) throw err;

    User.findOne({email:req.email}, (err, user) => {
      if (err) throw err;
      const result = thread.rated_by.map(u=>{
        return u.user_id;
      });
      // upvote / downvote logic begins there
      // if the user never voted
      if(result.toString().indexOf(user._id.toString()) === -1) {
        // get the total of ratings
        const existingRate = thread.rate;

        // calculate the new rating adding the rating given by the user to the actual rating
        const new_rate = parseInt(existingRate) + parseInt(rate);

        // set the new total rate
        thread.rate = new_rate;

        // set who voted and its rating
        thread.rated_by.push({user_id: new ObjectID(user._id), rate: rate});

        // modify the new thread
        thread.save( err => {
          if (err) throw err;

          // send a status to the ui/user to inform that the change took place
          res.status(200).json({message:'You voted'});
        });

        // in case the user already voted!
      } else {

        // get the position in the array where the user is stored with its voting value
        const index = result.toString().indexOf(user._id.toString());

        // check if the user tried to use the same vote!
        if(thread.rated_by[index].rate  === rate) {

          console.log('you already voted!');

          // send the user an error because he voted this option
          res.status(401).json({error: 'You already voted this option'});
        } else {

          // if the user changed its vote

          const existingRate = thread.rate;
          const new_rate = parseInt(existingRate) + parseInt(rate);
          thread.rate = new_rate;
          thread.rated_by[index].rate = rate;
          console.log(thread.rated_by);
          thread.save( err => {
            if (err) throw err;
            console.log('you chaned your vote!');
            res.status(200).json({message:'You changed your vote!!!'});
          });
        }
      }
    });
  });
});

// delete the thread created by that user
app.delete('/api/thread/:id', withAuth, (req, res) => {
  User.findOne({email: req.email}, (err, user) => {
    Thread.deleteOne({created_by: new ObjectID(user._id), _id: new ObjectID(req.params.id)}, err => {
      if (err) {
        res.status(401).json({error:'You can\'t delete this thread'});
      }
      res.status(200).send({message: 'success'});
    });
  });
});

// update thread created by that user
app.put('/api/thread/:id', withAuth, (req, res) => {
  User.findOne({email: req.email}, (err, user) => {
    Thread.findOne({created_by: new ObjectID(user._id), _id: new ObjectID(req.params.id)}, (err, thread) => {
      if (err) throw err;

      thread.title = req.body.title;
      thread.subtitle = req.body.subtitle;
      thread.body = req.body.body;
      thread.image = req.body.image;
      thread.save( err => {
        if (err) {
          throw err;
          res.status(401).send({error: 'Couldn\'t update thread!'});
        }
        res.status(200).send({message: 'Thread updated!'});
      });
    });
  });
});

// get user details
app.get('/api/user', withAuth, (req, res) =>{
  User.findOne({email:req.email}, (err, user)=>{
    if(err) throw err;
    delete user.password; // this doens't work for some reason :(
    user.password = 'null';
    res.status(200).send(user);
  });
});

// get user name only
app.get('/api/user/:id', (req, res) =>{
  User.findOne({_id: new ObjectID(req.params.id)}, (err, user)=>{
    if(err) throw err;
    // delete user.password;
    res.status(200).send(user.name);
  });
});


// edit user
app.put('/api/user', withAuth, (req, res) => {
  User.findOne({email: req.email}, (err, user) => {
    if (err) {
      throw err;
      res.status(401).send({error: 'Couldn\'t update user!'});
    }
    user.name = req.body.name;
    user.isCorrectPassword(req.body.oldPassword, (err, same) => {
      if (err) {
        res.status(500)
          .json({
            message: 'Internal error please try again'
          });
      } else if (!same) {
        res.status(401)
          .json({
            message: 'Old password is wrong'
          });
      } else {
        user.password = req.body.newPassword;
        console.log(user);
        user.save(err=>{
          if(err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
              });
          }
          res.status(200).send({success:true});
        });
      }
    });

  });
});

// check if the user voted in this thread
app.get('/api/checkVote/:threadId', withAuth, (req, res) => {
  User.findOne({email:req.email}, (err, user) => {
    if (err) throw err;
    Thread.findOne({_id: new ObjectID(req.params.threadId)}, (err, thread) => {
      if(err) throw err;
      const rated_by = thread.rated_by.toObject();;
      rated_by.find(e=>{
        if(e.user_id.toString() === user._id.toString()) {
          res.status(200).json({voted:true, vote:e.rate});
        } else {
          res.status(200).json({voted:false});
        }
      });
    });

  });

});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
// // get all comments not used
// app.get('/api/comment', (req, res) => {
//   db.collection('comments').find().toArray((err, comments) => {
//     res.send(comments);
//   });
// });
