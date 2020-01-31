const express = require('express');
// const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

router.get('/teams', (req, res) => {
  res.send('You will get teams here')
})

router.post('/teams/join', (req, res) => {
  // get the type of join request
  var jointype = req.body.jointype;
  console.log(jointype);
  res.redirect('/?jointype=' + jointype)
})

app.use(bodyParser.json());
app.use('/.netlify/functions/hello', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);