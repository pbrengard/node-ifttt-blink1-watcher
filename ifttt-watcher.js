#!/usr/bin/env node
/*
 *
 *
 */



var Blink1 = require('node-blink1');
var http = require('http');
var express = require('express');
var serveStatic = require('serve-static')

var config = require('./config')

var testmode = 0;
var intervalSecs = 2;

// parse commandline args
process.argv.forEach(function (val, index, array) {
  if( val.indexOf("test") == 0 ) {
    testmode = 1;
  }
});

console.log("watching every "+config.interval+" the url: "+config.watched_url);

// open a blink1 for use
var blink1;
try {
  blink1 = new Blink1.Blink1();
} catch(err) {
  console.log("no blink1 devices found");
  if( !testmode ) process.exit(1);
}

var latest = 0;

reqcallback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
          str += chunk;
  });

  response.on('end', function () {
    var obj = JSON.parse(str);
    if(obj && obj.events && obj.events.length > 0
      && parseInt(obj.events[0].date) > latest) {
       latest = parseInt(obj.events[0].date);
       config[obj.events[0].name](blink1);
    }
  });
}


timercallback = function() {
  var req = http.request(config.watched_url, reqcallback);
  req.end();
};

timercallback();
setInterval( timercallback, config.interval * 1000 );


var app = express();

app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}))

app.get('/off', function(req, res) {
   blink1.fadeToRGB(1000, 0, 0, 0);
   res.end();
});

app.get('/set_temp/:temp', function(req, res, next) {
  var temp = parseInt(req.params.temp);
  if(temp) {
    var rgb = config.kelvinToRGB(temp);
    blink1.setRGB(rgb[0], rgb[1], rgb[2]);
//  } else {
    res.end();
  }
});

var server = app.listen(8080, function() {
  console.log('Server is running');
});

