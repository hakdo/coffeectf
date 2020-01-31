exports.handler = async function(event, context, callback) {
    var body = JSON.parse(event.body);
    console.log(body);
};