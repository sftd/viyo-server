
'use strict';

// var Log = require('ab-libs-logs/libs.js').Log;
var ViyoElement = require('./viyo-element.js').ViyoElement;


var ViyoController = {
    self: null,
    element: null,

    client: null,

    observed_Names: null,
    observed_Types: null,

    Validate_Authentication: function(data)
    {
        if (!ViyoElement.Validate_Authentication(data))
            return false;

        return true;
    },

    Validate_DataToPlayer: function(data)
    {
        if (!('players' in data))
            return false;

        return true;
    },

    Class: function(data, ab_client)
    {
        this.self = this;
        var self = this.self;
        self.element = new ViyoElement.Class(data, ab_client);

        self.observed_Names = [];
        self.observed_Types = [];

        self.parse_Authentication(data);
    },

    parse_Authentication: function(data)
    {
        var self = this.self;

        if ('observes' in data) {
            var o = data.observes;
            if ('names' in o) {
                for (var i = 0; i < o.names.length; i++)
                    self.observed_Names.push(o.names[i]);
            }
            if ('types' in o) {
                for (var i = 0; i < o.types.length; i++)
                    self.observed_Types.push(o.types[i]);
            }
        }
    },

    isObserving: function(sensor) {
        var self = this.self;

        if (self.observed_Names.indexOf(sensor.element.getName()) > -1)
            return true;

        for (var i = 0; i < self.observed_Types.length; i++) {
            if (sensor.hasType(self.observed_Types[i]))
                return true;
        }

        return false;
    }

};
ViyoController.Class.prototype = ViyoController;
exports.ViyoController = ViyoController;
