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

exports.handler = async function(event, context, callback) {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model('HackerTeams', new mongoose.Schema({name: String, owner: String, secret: String, members: [] }));
  }
  // look for some information...
  console.log(event);
  var kaker = kakeparser(event.headers.cookie);
  console.log(kaker);
  if (Object.keys(kaker).includes('nf_jwt')) {
      var mininfo = getdatafromjwt(kaker['nf_jwt'])
  }

  const { identity, user } = client.clientContext;
  console.log("Id: ", identity);
  console.log("User: ", user);

  const M = conn.model('HackerTeams');

  const doc = await M.find({});
  
  callback(null, {
      statusCode: 200,
      body: JSON.stringify(doc)
  })
};