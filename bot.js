var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var fs = require('fs');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /(BOBBY B)/i;
  console.log(request);
  if(request.text && botRegex.test(request.text)) {
    sleep(2000)
    this.res.writeHead(200);
    sendRandomLine("responses.txt");
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(message) {
  var botResponse, options, body, botReq;

  botResponse = message;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse,
    "attachments" : [
      {
        "type"  : "image",
        "url"   : "https://i.imgur.com/hrCP6Uk.gifv"
      }
    ]
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function sendRandomLine(filename) {
  var data = ""
  console.log("You are here")
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    var lines = data.toString().split('\n');
    postMessage(lines[Math.floor(Math.random()*lines.length)]);
 })
}

exports.respond = respond;
