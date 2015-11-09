
'use strict';

process.env.NODE_PATH = __dirname + '/ab-dev';
require('module').Module._initPaths();

var ABClient = require('ab-libs-network/libs.js').ABClient;

/* Sensors */
var sensors = [
    // new ABClient.Class('localhost', '8081'),
    new ABClient.Class('localhost', '8081')
];

/* Sensors */
var sensors_connected = [];
for (var i = 0; i < sensors.length; i++) {
    sensors_connected.push(false);

    sensors[i].setOnConnectedListener(function() {
        console.log('`testSensor' + i + '` connected to server.');
    });

    sensors[i].setOnDataReceivedListener(function(message) {
        console.log('testSensor' + i + ': ' + message);
    });

    sensors[i].setOnDisconnectedListener(function() {
        console.log('`testSensor' + i + '` disconnected from server.');
    });

    var message = {
        'type': 'authenticate',
        'data': {
            'sensors': [{
                'name': 'testSensor' + i,
                'types': ['testSensor']
            }]
        }
    };

    sensors[i].send(JSON.stringify(message));
}
