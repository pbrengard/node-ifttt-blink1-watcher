var async = require('async');

exports.watched_url = 'http://api.thingm.com/blink1/events/<your-iffttt-id-here>';

exports.interval = 2;

var kelvinToRGB = function(kelvin) {
  var rgb = [0,0,0];
  var temp = kelvin / 100.
  if(temp <= 66) {
    rgb[0] = 255;
  } else {
    rgb[0] = 329.698727446 * Math.pow(temp-60, -0.0755148492);
  }

  if(temp <= 66) {
    rgb[1] = 99.4708025861 * Math.log(temp) - 161.1195681661;
  } else {
    rgb[1] = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  }

  if(temp > 66) {
    rgb[2] = 255
  } else if(temp <= 19) {
    rgb[2] = 0;
  } else {
    rgb[2] = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  }

  for(i=0;i<3;i++) {
    if(rgb[i] < 0) {
      rgb[i] = 0;
    } else if(rgb[i] > 255) {
      rgb[i] = 255
    } else {
      rgb[i] = Math.round(rgb[i]);
    }
  }

  return rgb;
};

exports.kelvinToRGB = kelvinToRGB;

exports.SunLight = function(blink1) {
  var rgb = kelvinToRGB(5000);
  blink1.fadeToRGB(1000, rgb[0], rgb[1], rgb[2]);
};

exports.On = function(blink1) {
  blink1.fadeToRGB(500, 255, 255, 255);
};

exports.Off = function(blink1) {
  blink1.fadeToRGB(500, 0, 0, 0);
};

exports.MailAlert = function(blink1) {

  blink1.rgb(function(old_r, old_g, old_b) {

    async.series([
      function(next) {
         blink1.fadeToRGB(500, 0, 0, 0, next);
      },
      function(next) {
        blink1.fadeToRGB(500, 255, 0, 0, next);
      },
      function(next) {
        setTimeout(next, 500);
      },
      function(next) {
         blink1.fadeToRGB(500, 0, 0, 0, next);
      },
      function(next) {
        blink1.fadeToRGB(500, 255, 0, 0, next);
      },
      function(next) {
        setTimeout(next, 500);
      },
      function(next) {
         blink1.fadeToRGB(500, 0, 0, 0, next);
      },
      function(next) {
        blink1.fadeToRGB(500, 255, 0, 0, next);
      },
      function(next) {
        setTimeout(next, 500);
      }

    ],
    function(err, results) {
      blink1.fadeToRGB(500, 0, 0, 0, function() {
        blink1.fadeToRGB(500, old_r, old_g, old_b);
      });
    });
  });

}
