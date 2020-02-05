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
        smuler = param.split("=");
        cleanload[smumer[0]] = smuler[1];
    }
    // remove url encoding...
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
    const doc = await M.findOne({name: 'something'});
    if (doc) {
      callback(new Error("Document already exists with that name."))
    } else {
      console.log(event.body)
      callback(null, {
          statusCode: 200,
          body: JSON.stringify(doc)
      })
    }
  }
};