exports.handler = async event => {
    // function to get CTF teams
    const mongoose = require('mongoose');
    var teamSchema = new mongoose.Schema({
        name: String,
        owner: String,
        members: String,
        secret: String
    });
    var Team = mongoose.model('Team', teamSchema);
    mongoose.connect(`mongodb://${process.env.mlabstring}`, {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected!
    Team.find({}, (err, data) => {
        if (err) {
            console.log('Lambda error: could not find teams')
        } else {
            res.json(data)
        }
    })

    });
}