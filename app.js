const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const routes = require('./routes/index');
const app = express();
const port = process.env.PORT || 5000;



//use session for tracking Login
app.use(session({
  secret: 'Athanas Shaauritanga',
  resave: true,
  saveUninitialized: false
}));

//make user ID available in templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});
//connecting to // DB
mongoose.connect('mongodb://ashauritanga:athanas2015@ds139879.mlab.com:39879/learn-forever',{ useNewUrlParser: true});
let db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, 'connection failed:'));

//parsing incoming request
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//serve static files from /public
app.use(express.static(__dirname + '/public'));

//set view engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//routing
app.use('/', routes);

//Unknown routes
app.use(function(req, res, next) {
  let err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, function() {
  console.log(`server is running on port ${port}`);
});
