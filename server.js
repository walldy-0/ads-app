const express = require('express');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');

const app = express();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

// db connection
const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if(NODE_ENV === 'production') dbUri = 'mongodb+srv://walldy:${process.env.DB_PASS}@cluster0.i69xevf.mongodb.net/NewWaveDB?retryWrites=true&w=majority';
else if(NODE_ENV === 'test') dbUri = 'mongodb://localhost:27017/AdsAppDBtest';
else dbUri = 'mongodb://localhost:27017/AdsAppDB';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

// middleware
app.use(helmet());
if(process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: '90fee595-c27d-4018-8cee-082a2bec4ee3',
  store: MongoStore.create(mongoose.connection),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV == 'production',
  },
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// routes
/*app.use('/api', require('./routes/ads.routes'));
app.use('/api', require('./routes/users.routes'));
*/
app.use('/auth', require('./routes/auth.routes'));

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
*/

app.use((req, res) => {
  res.status(404).json({message: 'Not found...'});
});


module.exports = server;