
'use strict';

// var Log = require('ab-network-libs/libs.js').Log;
var ViyoElement = require('./viyo-element.js').ViyoElement;

var ViyoPlayer = {
    self: null,
    element: null,

    types: null,

    Validate_Authentication: function(data)
    {
        if (!ViyoElement.Validate_Authentication(data))
            return false;

        if (!('types' in data)) {
            console.warn('No `types` in ViyoPlayer authentication message.');
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
ViyoPlayer.Class.prototype = ViyoPlayer;
exports.ViyoPlayer = ViyoPlayer;
