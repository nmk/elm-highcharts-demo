'use strict';

window.Highcharts = require('highcharts/highcharts');

require('./index.html');

var Elm = require('./Main.elm'),
    mountNode = document.getElementById('main');

window.hcDemoApp = Elm.Main.embed(mountNode);
