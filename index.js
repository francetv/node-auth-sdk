var request     = require('request');
var url         = require('url');
var Q           = require('q');
var debug       = require('debug')('node-auth-sdk');

var ClientToken = require('./lib/clientToken');
var UserToken   = require('./lib/userToken');



var FtvenNodeAuthSdk = function(apiUrl, clientId, userId, userPwd) {
    'use strict';

    var clientToken = new ClientToken(apiUrl, clientId);
    var userToken = new UserToken(apiUrl, clientToken, userId, userPwd);


    this.call = function(verb, uri, data, headers, options) {
        
        return mergeOptions(verb, uri, data, headers, options)
            
            .then(addClientTokenHeader)

            .then(addUserTokenHeader)
            
            .then(sendRequest);

    };


    function mergeOptions(verb, uri, data, headers, options) {
        var deferred = Q.defer();

        debug('Merging options');

        try {
            
            options = options || {};
            options.url = url.resolve(apiUrl, uri);
            options.method = verb;
            if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'PUT') {
                options.body = (data) ? JSON.stringify(data) : data;
            }
            options.headers = headers || {};

            debug('Merged options:');
            debug(options);

            deferred.resolve(options);

        } catch(err) {
            debug('Error while merging options');
            debug(err);
            deferred.reject(err);
        }

        return deferred.promise;
    }


    function addClientTokenHeader(options) {

        debug('Checking client token');
        
        if (!clientToken.hasToken() || !clientToken.isExpiredToken()) {

            debug('Client token null or expired');
            
            return clientToken.requestToken().then(function() {
                debug('New client token seems good');
                options.headers[clientToken.getKey()] = clientToken.getValue();
                return options;
            });

        } else {
            var deferred = Q.defer();

            options.headers[clientToken.getKey()] = clientToken.getValue();
            deferred.resolve(options);

            return deferred.promise;
        }
    }


    function addUserTokenHeader(options) {
        
        if (!userToken.hasToken() || !userToken.isExpiredToken()) {
            
            return userToken.requestToken().then(function() {
                options.headers[userToken.getKey()] = userToken.getValue();
                return options;
            });

        } else {
            var deferred = Q.defer();

            options.headers[userToken.getKey()] = userToken.getValue();
            deferred.resolve(options);

            return deferred.promise;
        }
    }


    function sendRequest(options) {
        var deferred = Q.defer();

        debug('Sending the request');
        debug(options);

        request(options, function(err, httpResponse, body) {
            if (err) {
                debug('Request failed');
                debug(err);
                deferred.reject(err);
            } else {

                try {
                    debug('Success');
                    debug(body);
                    deferred.resolve(JSON.parse(body));
                } catch(e) {
                    debug('Request failed');
                    debug(e);
                    deferred.reject('Error request response is not a valid JSON format');
                }
            }
        });

        return deferred.promise;
    }
};

module.exports = FtvenNodeAuthSdk;