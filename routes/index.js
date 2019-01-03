const express = require('express');
const User = require('../models/user');
const mid = require('../middlewares/index');
const router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  return res.render('home', {title: 'Educate the World'})
});

//GET profile
router.get('/profile', function(req, res, next) {
  if(!req.session.userId) {
    const err = new Error('You are not authorized to view this page');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if(error){
          return next(error);
        } else {
          return res.render('profile', {
            title: 'User Profile',
            firstName: user.firstName,
            lastName: user.lastName 
          })
        }
      });
});

//GET logout
router.get('/logout', function(req, res, next) {
  if(req.session){
    //delete session
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//GET register form
router.get('/register', mid.loggedOut,  function(req, res, next) {
  return res.render('register', {title: 'Sign Up'})
});

//POST to // // DB
router.post('/register', function(req, res, next) {
  if(req.body.firstName &&
    req.body.lastName &&
    req.body.email &&
    req.body.password && req.body.confirm) {
      //confirm match passwords
      if(req.body.password !== req.body.confirm) {
        const err = new Error('Passwords do not match!');
        err.status = 400;
        return next(err);
      }

      //Create Object
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
      //creating user
      User.create(userData, function(error, user) {
        if(error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    } else {
      let err = new Error('All Fields Reguired');
      err.status = 400;
      return next(err);
    }
});

//GET Login
router.get('/login', mid.loggedOut,  function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

//POST Login
router.post('/login', function(req, res, next) {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    })
  } else {
    const err = new Error('Email and password are required');
    err.status = 400;
    next(err);
  }
});

//GET about page
router.get('/about', function(req, res, next) {
  return res.render('about', {title: 'About Us'})
});

module.exports = router;
