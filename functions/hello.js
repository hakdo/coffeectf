const express = require('express');
// const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
var mongostr = 'mongodb://' + process.env.mongostring;
const mongoose = require('mongoose');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

mongoose.connect(mongostr, {useNewUrlParser: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error to db: '));
db.once('open', function () {
// db code goes here.
  var memberSchema = new mongoose.Schema({
    uid: String,
    email: String,
    avatar: String
  });

  var teamSchema = new mongoose.Schema({
    name: String,
    owner: String,
    members: [memberSchema], // json with necessary user information to create a list and use for assignment
    secret: String
  });

  var HackerTeam = mongoose.model('HackerTeam', teamSchema);

  router.post('/teams/join', (req, res) => {
    // get the type of join request
    var jointype = req.body.jointype;
    var contentdata = req.body.team;
    if (jointype === 'create') {
      // create a new team
      var myteam = {
        name: contentdata,
        owner: "test-test",
        secret: "generated-funny-secret"
      }
      var newteam = new HackerTeam(myteam);
      newteam.save(function (err, data) {
        if (err) {
          res.redirect('/')
        } else {
          // ok, se we crated a new team, let's just dump it to the browser first...
          res.json(data)
        }
      })
    } else {
      // join a team
      res.redirect('/?jointype=' + jointype + '%error=not-implemented');
    }
  })

})

router.get('/env', (req, res) => {
  var myvar = process.env.testvariable;
  res.send(testvariable);
})

router.get('/teams', (req, res) => {
  res.send('You will get teams here')
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/.netlify/functions/hello', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);