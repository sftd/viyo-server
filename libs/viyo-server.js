
'use strict';

/* External */
// var Log = require('ab-libs-logs/libs.js').Log;
var ABClient = require('ab-libs-network/libs.js').ABClient;
var ABServer = require('ab-libs-network/libs.js').ABServer;
/* Internal */
var ViyoController = require('./viyo-controller.js').ViyoController;
var ViyoElement = require('./viyo-element.js').ViyoElement;
var ViyoPlayer = require('./viyo-player.js').ViyoPlayer;
var ViyoSensor = require('./viyo-sensor.js').ViyoSensor;


var ViyoServer = {
    self: null,

    server: null,
    abClients: null,

    players: null,
    sensors: null,
    controllers: null,

    Class: function(port)
    {
        this.self = this;
        var self = this.self;

        self.server = new ABServer.Class(port);

        self.abClients = {};

        self.players = {};
        self.sensors = {};
        self.controllers = {};

        self.server.setOnConnectedListener(function(ab_client) {
            self.onConnected(ab_client);
        });

        self.server.setOnDisconnectedListener(function(ab_client) {
            self.onDisconnected(ab_client);
        });

        self.server.setOnDataReceivedListener(function(ab_client, data) {
            self.onDataReceived(ab_client, data);
        });
    },

    listen: function()
    {
        var self = this.self;

        self.server.listen();
    },

    /* ABServer Listeners */
    onConnected: function(ab_client)
    {
        var self = this.self;

        console.log('Client %d: Connected.', ab_client.id);
    },

    onDisconnected: function(ab_client)
    {
        var self = this.self;

        if (ab_client.id in self.abClients)
            delete self.abClients[ab_client.id];

        console.log('Client %d: Disconnected.', ab_client.id);
    },

    onDataReceived: function(ab_client, data)
    {
        var self = this.self;

        var message = JSON.parse(data);
        if (message === null) {
            console.warn('Cannot parse message from client `%d`:',
                    ab_client.id);
            console.warn(data);
            return;
        }

        if (!('type' in message)) {
            console.warn('No `type` in message:');
            console.warn(message);
            return;
        }

        if (message.type === 'authentication') {
            self.onDataReceived_Authentication(ab_client, message);
            return;
        }

        if (ab_client.id in self.abClients) {
            if (message.type === 'dataFromSensor') {
                self.onDataReceived_DataFromSensor(ab_client, message);
                return;
            }

            if (message.type === 'dataToPlayer') {
                self.onDataReceived_DataToPlayer(ab_client, message);
                return;
            }

            console.log('Unknown message type from authenticated client:');
            console.log(message);

            return;
        }

        console.log('Unknown message type from unauthenticated client:');
        console.log(message);
    },

    /* Helpers */
    onDataReceived_Authentication: function(ab_client, message)
    {
        var self = this.self;

        if (!('data' in message)) {
            console.warn('No data in `authentication` message.');
            return;
        }

        var data = message.data;

        /* Players */
        self.onDataReceived_Authentication_AddElement('players', ViyoPlayer,
                data, ab_client);

        /* Sensors */
        self.onDataReceived_Authentication_AddElement('sensors', ViyoSensor,
                data, ab_client);

        /* Controllers */
        self.onDataReceived_Authentication_AddElement('controllers',
                ViyoController, data, ab_client);

        self.abClients[ab_client.id] = ab_client;
    },

    onDataReceived_Authentication_AddElement: function(elements_name,
            element_class, data, ab_client)
    {
        var self = this.self;

        if (!(elements_name in data))
            return;

        var elems = data[elements_name];

        for (var i = 0; i < elems.length; i++) {
            if (element_class.Validate_Authentication(elems[i])) {
                if (elems[i].name in self[elements_name]) {
                    console.log('Overwriting `%s` in `%s`.', elems[i].name,
                            elements_name);
                }

                self[elements_name][elems[i].name] =
                        new element_class.Class(elems[i], ab_client);
                console.log('Added `%s` to `%s`.', elems[i].name, elements_name);
            }
        }
    },

    onDataReceived_DataToPlayer: function(ab_client, message)
    {
        var self = this.self;

        if (!ViyoController.Validate_DataToPlayer(message.data))
            return;

        var data = message.data;


        var player_names;
        if ('names' in data.players)
            player_names = data.players.names;
        else
            player_names = [];

        var player_types;
        if ('types' in data.players)
            player_types = data.players.types;
        else
            player_types = [];

        for (var i = 0; i < player_types.length; i++) {
            for (var p_name in self.players) {
                if (player_names.indexOf(p_name) > -1)
                    continue;

                if (self.players[p_name].hasType(player_types[i]))
                    player_names.push(p_name);
            }
        }

        var controller_message = {
            type: 'dataToPlayer',
            data: message.data.data
        };

        for (var i = 0; i < player_names.length; i++) {
            self.players[player_names[i]].element.abClient.send(
                    JSON.stringify(controller_message));
        }
    },

    onDataReceived_DataFromSensor: function(ab_client, message)
    {
        var self = this.self;

        if (!ViyoSensor.Validate_DataFromSensor(message.data))
            return;

        var data = message.data;

        if (!(data.sensorName in self.sensors)) {
            console.warn('Unknown sensor `%s`.', data.sensorName);
            return;
        }

        var sensor = self.sensors[data.sensorName];

        for (var c_name in self.controllers) {
            var controller = self.controllers[c_name];

            if (controller.isObserving(sensor)) {
                var sensor_message = {
                    type: 'dataFromSensor',
                    data: {
                        sensor: {
                            name: sensor.element.name,
                            types: sensor.types
                        },
                        data: message.data.data
                    }
                };

                self.controllers[c_name].element.abClient.send(
                        JSON.stringify(sensor_message));
            }
        }
    }

};
ViyoServer.Class.prototype = ViyoServer;
exports.ViyoServer = ViyoServer;
