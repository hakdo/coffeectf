const mongoose = require('mongoose');

let conn = null;

const uri = 'mongodb://' + process.env.mongostring;

var kakeparser = function (cookie) {
    var kakeboks = {};
    var smuler = [];
    try {
        var kakemiks = cookie.split(/[;,]+/);
        for (kakebit of kakemiks) {
            smuler = kakebit.split("=");
            kakeboks[smuler[0]] = smuler[1];
        }
    } catch (error) {
        console.log("something bad happened. ", error)
    }
    return kakeboks
}

var getdatafromjwt = function (jwt) {
    var payload = jwt.split('.')[1];
    var decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
}

var bodyparser = function (body) {
    var payload = decodeURI(body)
    var bodyparams = payload.split('&');
    var cleanload = {}; var smuler = [];
    for (param of bodyparams) {
        var smuler = param.split("=");
        cleanload[smuler[0]] = smuler[1];
    }
    // remove url encoding...
    return cleanload;
}

exports.handler = async function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model('HackerTeams', new mongoose.Schema({name: String, owner: String, secret: String, members: [] }));
  }

  const M = conn.model('HackerTeams');
  if (event.httpMethod == 'POST') {
    // Check if user is logged in, create new team if name is unique. Check in code instead of enforcing name as index. 
    // get the body parameters
    var kaker = kakeparser(event.headers.cookie);
    console.log(kaker);
    if (Object.keys(kaker).includes('nf_jwt')) {
        var mininfo = getdatafromjwt(kaker['nf_jwt'])
    } else {
      // return a forbidden signal
      console.log("User is not authenticated.")
      callback(null, {statusCode: 403});
    }
    var mybodyparams = bodyparser(event.body); // required for new team - unique name, must have an owner. Owner we can get from cookie --> jwt --> decode. Cookie in context?
    const doc = await M.findOne({"name": mybodyparams.team});
    if (doc) {
      // document exists, do not create
      callback(null, {
        statusCode: 200, 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({success: false, msg: "Team name not accepted."})
      });
    } else {
      // create a new document if the uid in the jwt is the same as supplied by the frontend (at least it is not *that* easy to spoof)
      if (mybodyparams.uid == mininfo.sub) {
        myteam = new M({name: mybodyparams.name, owner: mininfo.email, members: [mininfo.email]});
        await myteam.save()
        callback(null, {statusCode: 205, headers: {"location": "/"}});
      } else {
        console.log('Cookie uid is different from form supplied uid')
        callback(null, {statusCode: 403})
      }
    }
  }
};