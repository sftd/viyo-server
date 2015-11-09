
'use strict';

process.env.NODE_PATH = __dirname + '/ab-dev';
require('module').Module._initPaths();

var ABClient = require('ab-libs-network/libs.js').ABClient;


/* Controller */
var controller = new ABClient.Class('localhost', '8081');

controller.setOnConnectedListener(function() {
    console.log('`testController1` connected to server.');
});

controller.setOnDataReceivedListener(function(message) {
    var data = JSON.parse(message);

    var sensor = data.sensor;

    if (sensor.name === 'testSensor1') {
        controller.send(JSON.stringify({
            'sendToPlayer': {
                'types': ['testPlayer'],
                'message': 'TestSensor1 triggered.'
            }
        }));
    }

    if (sensor.name === 'testSensor2') {
        controller.send(JSON.stringify({
            'sendToPlayer': {
                'names': ['testPlayer1'],
                'message': 'TestSensor2 triggered.'
            }
        }));
    }
});

controller.setOnDisconnectedListener(function() {
    console.log('`Sensor1` disconnected from server.');
});

var message = {
    'type': 'authenticate',
    'data': {
        'controllers': [{
            'name': 'testController1',
            'types': 'testController',
            'observes_Types': ['testSensor']
        }]
    }
}

controller.send(JSON.stringify(message));
