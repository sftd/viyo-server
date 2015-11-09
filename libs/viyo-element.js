
'use strict';

// var Log = require('./../3rdparty/ab-libs/libs.js').Log;


var ViyoElement = {
    self: null,

    name: '',
    abClient: null,

    Validate_Authentication: function(data)
    {
        if (!('name' in data)) {
            console.warn('No `name` in authentication message.');
            return false;
        }

        return true;
    },

    Class: function(data, ab_client)
    {
        this.self = this;
        var self = this.self;

        self.name = data.name;
        self.abClient = ab_client;
    },

    getName: function()
    {
        var self = this.self;

        return self.name;
    }

};
ViyoElement.Class.prototype = ViyoElement;
exports.ViyoElement = ViyoElement;
