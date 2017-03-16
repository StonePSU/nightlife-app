'use strict';

var express = require('express');
var app = express();
require('dotenv').config();
var routes = require('./app/routes/routes.js');
var passport = require('passport');
var session = require('express-session');
require('./app/config/passport.js')(passport);
var morgan = require('morgan');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

app.use(session({
    secret: "secretStone",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/common", express.static(process.cwd() + "/app/common/"));
app.use("/controllers", express.static(process.cwd() + "/app/controllers/"));
app.use(morgan('tiny'));
app.set('view engine', 'pug');

// add middleware
app.use('/public', express.static(process.cwd() + '/public'));

// error handling 
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500).send("Oops something went wrong");
});

routes(app, passport);

app.listen(process.env.PORT || 8080, function() {
    console.log("The server is up and running");
});