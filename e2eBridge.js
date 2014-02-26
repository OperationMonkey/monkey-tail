/**
 * Module dependencies.
 */
'use strict';
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var http = require('http');
var fixtures = require('./test/fixtures');

var app = express();

// all environments
app.set('port', process.env.PORT || 3333);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// Home
app.options('/', cors());
app.get('/', function(req, res) {
    res.send({ status: 'OK' });
});

// Graph
app.options('/fixtures', cors());
app.post('/fixtures', cors(), function(req, res) {
    fixtures.setupFixtures(function(err) {
        if (err) {
            return res.send({ status: 'error', error: err });
        }
        return res.send({ status: 'ok' });
    });
});

// Handle errors and if no one responded to the request
app.use(function(err, req, res, next) {
    res.send(404, { status: 'error', error: 'method not found' });
    next();
});

// Server
var server = http.createServer(app);
if (require.main === module) {
    mongoose.connect('mongodb://localhost/monkey', function(err) {
        if (err) {
            console.log('Could not connect to Mongo: ', err);
            process.exit();
        }

        server.listen(app.get('port'), function(err) {
            if (err) {
                console.log('Could not listen: ', err);
                process.exit();
            }

            console.log('Running in ' + app.settings.env + ' environment');
            console.log('Express server listening on port ' + app.get('port'));
        });
    });
}

module.exports = server;
