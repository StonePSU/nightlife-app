'use strict';
var NightlifeHandler = require("../controllers/nightlifeHandler.server.js");

function routes(app, passport) {
    var nightlifeHandler = new NightlifeHandler();
    
    app.route("/")
        .get(function(req, res) {
            console.log("render homepage");
            res.render('index'); 
        });
        
    app.route("/login")
        .get(function(req, res) {
           res.render("login"); 
        });
        
    app.route("/api/:id")
        .get(function(req, res) {
           if (req.isAuthenticated()) {
               res.json(req.user.facebook);
           } else {
               res.json("Not Authenticated");
           }
    });      
    
    app.route("/api/business/:id")
        .get(nightlifeHandler.getAttendees)
        .post(nightlifeHandler.addOrRemoveAttendee);
    
    app.route("/api/search/:location")
        .get(nightlifeHandler.searchLocation);
        
    app.route("/auth/twitter")
        .get(passport.authenticate('twitter'));
        
    app.route("/auth/twitter/callback")
        .get(passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/login'}));
}

module.exports = routes;