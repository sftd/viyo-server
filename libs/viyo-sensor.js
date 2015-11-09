
'use strict';

// var Log = require('ab-networks-libs/libs.js').Log;
var ViyoElement = require('./viyo-element.js').ViyoElement;

var ViyoSensor = {
    self: null,
    element: null,

    types: null,

    Validate_Authentication: function(data)
    {
        if (!ViyoElement.Validate_Authentication(data))
            return false;

        if (!('types' in data)) {
            console.warn('No `types` in ViyoSensor authentication message.');
            return false;
        }

        return true;
    },

    Validate_DataFromSensor: function(data)
    {
        if (!('sensorName' in data)) {
            console.log('No `sensorName` in `dataFromSensor`.');
            return false;
        }

        return true;
    },

    Class: function(data, ab_client)
    {
        this.self = this;
        var self = this.self;
        self.element = new ViyoElement.Class(data, ab_client);

        self.types = [];
        for (var i = 0; i < data.types.length; i++)
            self.types.push(data.types[i]);
    },

    hasType: function(type)
    {
        var self = this.self;

        for (var i = 0; i < self.types.length; i++)
            if (self.types[i] === type)
                return true;

        return false;
    }

};
ViyoSensor.Class.prototype = ViyoSensor;
exports.ViyoSensor = ViyoSensor;
