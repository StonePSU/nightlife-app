'use strict';

var Yelp = require('yelp');
var Businesses = require('../models/business.js');

function nightlifeHandler() {
    
    var yelp = new Yelp({
       consumer_key: process.env.YELP_CONSUMER_KEY,
       consumer_secret: process.env.YELP_CONSUMER_SECRET,
       token: process.env.YELP_TOKEN,
       token_secret: process.env.YELP_TOKEN_SECRET
    });
    
    this.searchLocation = function(req, res) {
        if (req.params.location) {
            console.log(req.params.location);
            yelp.search({
                term: 'bar',
                location: req.params.location,
            }).then(function(data) {
                res.json(data);
            }).catch(function(err){
                console.error(err);
                res.sendStatus(500);
            });
        }
    }
    
    this.getAttendees = function(req, res) {
        var id = req.params.id;
        
        Businesses.findOne({business_id: id}, "business_id participants", function(err, business) {
            if (err) throw err;
            var barCount = 0;
            if (business) {
               barCount = business.participants.length;
            }
            console.log(`Bar ID: ${id}, number going: ${barCount}`);
            
            res.json({count: barCount});
        })
        
    }
    
    this.addOrRemoveAttendee = function(req, res) {
        var id = req.params.id;
        
        if (req.isAuthenticated()) {
            Businesses.findOne({business_id: id}, "business_id participants", function(err, business) {
              var isGoing = false;
              var deleted = 0;
              
              if (err) throw err;
            
              if (business) {
                  // determiner if the user is already going to the bar
                  business.participants.forEach(function(participant, index) {
                      if (participant === req.user.twitter.id) {
                          isGoing = true;
                          deleted = index;
                      }
                  });
                  
                  // if the user is already going, we need to remove them from the participants
                  if (isGoing) {
                      var arrDeleted = business.participants.splice(deleted, 1);
                      business.save(function(err) {
                          if (err) throw err;
                          
                          res.json( {
                            count: business.participants.length,
                            isGoing: false
                          });
                      })
                  } else {
                      business.participants.push(req.user.twitter.id);
                      business.save(function(err) {
                          if (err) throw err;
                          
                          res.json( {
                            count: business.participants.length,
                            isGoing: true
                          });
                      })
                  }
              } else {
                  var newBus = new Businesses({
                    business_id: id,
                    participants: [req.user.twitter.id]
                  });
                  
                  newBus.save(function(err) {
                      if (err) throw err;
                      res.json( {
                          count: 1,
                          isGoing: true
                      })
                  })
              }
            });
          //res.json({message: "Success"});
        } else {
            res.cookie("last-search", id);
            res.json({ loginStatus: "GUEST"});
        }
    }
}

module.exports = nightlifeHandler;