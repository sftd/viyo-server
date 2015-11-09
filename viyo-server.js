
'use strict';

process.env.NODE_PATH = __dirname + '/ab-dev';
require('module').Module._initPaths();

var fs = require('fs');
var http = require('http');

var ViyoServer = require('./libs.js').ViyoServer;


var server = new ViyoServer.Class(8081);
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

server.listen(config.port);
console.log('Listening on: ' + config.port);

// var ABNetwork = require('./ab-network/lib.js');
//
//
// var server = new ABLibs.Network.Server(8081);
// server.setOnConnectListener(function() {
//
// });
// server.setOnMessageListener(function() {
//
// });



// var ViyoLib = require('./viyo-lib/viyo-lib');
//
// // var commandSets = new Array();
// // commandSets.push(require('./commands/tests').commandSet);
//
// var server = new VLib.CommandsServerClass(8081);
//
// fs.readdir('./commands', function(err, files) {
//     for (var i = 0; i < files.length; i++) {
//         var command_set = require('./commands/' + files[i]).commandSet;
//         server.addCommandSet(files[i].slice(0, -3), command_set);
//     }
// });
//
// server.listen();
//
// console.log('Commands server started listening...');

// var http_server = http.createServer(function(request, response) {
//     console.log(request.url);
//
//     var client = new VLib.CommandsClientClass('localhost', 8081);
//     client.connect();
//
//     var command =  new VLib.Command('test', 'echo');
//     client.send(command);
//
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Viyo Commands websocket server.')
// });
// http_server.listen(8080);
