var express = require('express');
var router = express.Router();

var Poll = require("../models/polls");

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/users/login');
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    res.render('index');
});

router.get('/polls',ensureAuthenticated, function(req, res){

    Poll.find({})
        .exec(function(err, queries){
            queries.reverse();
            res.render('polls', {
                queries: queries
            })
        });
});

router.get('/createpoll',ensureAuthenticated, function(req, res){
    res.render('createpoll');
});

router.get('/mypolls',ensureAuthenticated, function(req, res){

    Poll.find({ author: res.locals.user.username })
        .exec(function(err, queries){
            queries.reverse();
            res.render('mypolls', {
                queries: queries
            })
        });
});

router.get('/vote/:thisid',ensureAuthenticated, function(req,res){
    Poll.find({ _id: req.params.thisid })
        .exec(function(err, queries){
            if(err) throw err;
            res.render('display', {
                queries: queries
            });
        });
});

router.post('/createpoll', function(req, res){

    //Validation
    req.checkBody('question', 'A poll question is required').notEmpty();
    req.checkBody('answers', 'Answers are required').notEmpty();
    req.checkBody('answers', 'You must have 2 or more answers').isRightSize();

    var errors = req.validationErrors();

    var question = req.body.question;
    var answers = req.body.answers.split('/');
    var author = res.locals.user.username;

    if (errors){
        res.render('createpoll', {
            errors: errors
        });
    } else {

        var answersArr = [];

        for (var i = 0; i < answers.length; i++){
            answersArr.push({
                answer: answers[i],
                number: 0
            });
        };

        var newPoll = new Poll({
            question: question,
            answers: answersArr,
            author: author
        });

        newPoll.save(function(err){
            if(err){ 
                throw err;
            } else {
                req.flash("success_msg", "Your poll has been created!");
                res.redirect('/createpoll');
            }
        });
    }
});

router.post('/showresults/:thisid', function(req,res){

    var result = "";
    
    Poll.findOne({ _id: req.params.thisid }, function(err, queries){
        if(err) throw err;
    
        for(var i = 0; i < queries.answers.length; i++){
            if(queries.answers[i].answer === req.body.vote){
                queries.answers[i].number += 1;    
            }
        }
        result = queries.answers;

        if(result != ""){
            Poll.findByIdAndUpdate(req.params.thisid, {
                answers: result
            }, { new: true }, function(err, newdoc){

                if (err) throw err
                    res.render('results', {
                        results: newdoc,
                        answer: result
                    });             
            });
        }
    });
});

router.post('/deletepoll/:thisid', function(req,res){
    Poll.find({ _id: req.params.thisid }).remove(function(err){
        if(err) throw err;

        res.redirect('/poll/mypolls');
    });
});

module.exports = router;