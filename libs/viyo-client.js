/* Unused? */

'use strict';


var ViyoClient = {
    self: null,

    id: -1,
    socket: null,

    Class: function(id, ab_client)
    {
        this.self = this;
        var self = this.self;

        self.id = id;
        self.socket = ab_client;
    }

}
ViyoClient.Class.prototype = ViyoClient;
exports.ViyoClient = ViyoClient;
