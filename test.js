
'use strict';

process.env.NODE_PATH = __dirname + '/ab-dev';
require('module').Module._initPaths();

var ABClient = require('ab-libs-network/libs.js').ABClient;


var players = [
    new ABClient.Class('localhost', '8081'),
    new ABClient.Class('localhost', '8081')
];

var sensors = [
    new ABClient.Class('localhost', '8081'),
    new ABClient.Class('localhost', '8081')
];

var controller = new ABClient.Class('localhost', '8081');

function func(fn) {
    var fn_args = [];
    for (var i = 1; i < arguments.length; i++)
        fn_args.push(arguments[i]);
    fn.apply(this, fn_args);
}

/* Players */
for (var i = 0; i < players.length; i++) {
    players[i].setOnConnectedListener(func.bind(this, function(i) {
        console.log('`testPlayer%d` connected to server.', i);
    }, i));

    players[i].setOnDataReceivedListener(func.bind(this, function(i, data) {
        var message = JSON.parse(data);

        if (message.type === 'dataToPlayer') {
            if ('print' in message.data)
                console.log('`testPlayer%d`, print:', i, message.data.print);
        }
    }, i));

    players[i].setOnDisconnectedListener(func.bind(this, function(i) {
        console.log('`testPlayer%d` disconnected from server.', i);
    }, i));

    var message = {
        type: 'authentication',
        data: {
            players: [{
                name: 'testPlayer' + i,
                types: ['testPlayer']
            }]
        }
    };

    players[i].send(JSON.stringify(message));
}

/* Sensors */
var sensors_connected = [];
for (var i = 0; i < sensors.length; i++) {
    sensors_connected.push(false);

    sensors[i].setOnConnectedListener(func.bind(this, function(i) {
        console.log('`testSensor%d` connected to server.', i);
    }, i));

    sensors[i].setOnDataReceivedListener(func.bind(this, function(i, message) {
        console.log('`testSensor%d`: %s.', i, message);
    }, i));

    sensors[i].setOnDisconnectedListener(func.bind(this, function(i) {
        console.log('`testSensor%d` disconnected from server.', i);
    }, i));

    var message = {
        type: 'authentication',
        data: {
            sensors: [{
                name: 'testSensor' + i,
                types: ['testSensor']
            }]
        }
    };

    sensors[i].send(JSON.stringify(message));
}

/* Controller */
controller.setOnConnectedListener(function() {
    console.log('`testController0` connected to server.');
});

controller.setOnDataReceivedListener(function(data) {
    var message = JSON.parse(data);

    if (message.type === 'dataFromSensor') {
        var sensor = message.data.sensor;

        /* `testSensor` triggered. */
        if (sensor.types.indexOf('testSensor') > -1) {
            var controller_message = {
                type: 'dataToPlayer',
                data: {
                    players: {
                        types: ['testPlayer']
                    },
                    data: {
                        print: '`testSensor` type triggered.'
                    }
                }
            }

            controller.send(JSON.stringify(controller_message));
        }

        /* `testSensor0` triggered. */
        if (sensor.name === 'testSensor0') {
            var message = {
                type: 'dataToPlayer',
                data: {
                    players: {
                        names: ['testPlayer0']
                    },
                    data: {
                        print: '`testSensor0` triggered.'
                    }
                }
            }

            controller.send(JSON.stringify(message));
        }

        /* `testSensor1` triggered. */
        if (sensor.name === 'testSensor1') {
            var message = {
                type: 'dataToPlayer',
                data: {
                    players: {
                        names: ['testPlayer1']
                    },
                    data: {
                        print: '`testSensor1` triggered.'
                    }
                }
            }

            controller.send(JSON.stringify(message));
        }
    }
});

controller.setOnDisconnectedListener(function() {
    console.log('`testController0` disconnected from server.');
});

var message = {
    type: 'authentication',
    data: {
        controllers: [{
            name: 'testController1',
            observes: {
                types: ['testSensor']
            }
        }]
    }
}

controller.send(JSON.stringify(message));


/* Trigger Sensors */
var trigger_sensor_1 = function() {
    console.log('Sensor ' + 0 + ' triggered.');

    var message = {
        type: 'dataFromSensor',
        data: {
            sensorName: 'testSensor0',
            trigger: true
        }
    }

    sensors[0].send(JSON.stringify(message));
    setTimeout(trigger_sensor_1, 1000);
}
setTimeout(trigger_sensor_1, 1000);
