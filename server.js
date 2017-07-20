var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Chart = require('chart.js');

//var routes = require('./routes/index');
var users = require('./routes/users');
var poll = require('./routes/poll');
//create instance of express
var app = express();
//create viewing engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//static folder
app.use(express.static(path.join(__dirname, 'public')));
//express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(expressValidator({
    customValidators: {
        isRightSize: function(value) {
            var arr = value.split('/');
            return arr.length > 1;
        }
    }
}));
//connect Flash
app.use(flash());
//Global vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', poll);
app.use('/users', users);
app.use('/poll', poll);
//connect to mongod
mongoose.connect('mongodb://localhost/LoginTest');

//console.log(res.locals);

app.listen(process.env.PORT || 3000, function(){
    console.log("listening");
});