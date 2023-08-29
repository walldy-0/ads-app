const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { login, password, phone, avatar } = req.body;

    if (login && typeof login === 'string' && password && typeof password === 'string' && phone && typeof phone === 'string') {
      const userWithLogin = await User.findOne({ login });
      if (userWithLogin) {
        return res.status(409).send({ message: 'User with this login already exists' });
      }

      const user = await User.create({ login, password: await bcrypt.hash(password, 10), phone, avatar });
      res.status(201).send({ message: 'User ' + user.login + ' created' });
    } else {
      res.status(400).send({ message: 'Bad request' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (login && typeof login === 'string' && password && typeof password === 'string') {
      const user = await User.findOne({ login });

      if (!user) {
        res.status(400).send({ message: 'Incorrect login or password' });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user_id = user._id;
          req.session.login = user.login;
          res.status(200).send({ message: 'Login successfull' });
        } else {
          res.status(400).send({ message: 'Incorrect login or password' });
        }
      }
    } else {
      res.status(400).send({ message: 'Bad request' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
        res.redirect('/');
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  res.send(req.session.user_id);
};
