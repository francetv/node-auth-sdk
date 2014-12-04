var request     = require('request');
var url         = require('url');
var Q           = require('q');

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

        try {
            
            options = options || {};
            options.url = url.resolve(apiUrl, uri);
            options.method = verb;
            options.body = (data) ? JSON.stringify(data) : data;
            options.headers = headers || {};

            deferred.resolve(options);

        } catch(err) {
            deferred.reject(err);
        }

        return deferred.promise;
    }


    function addClientTokenHeader(options) {
        
        if (!clientToken.hasToken() || !clientToken.isExpiredToken()) {
            
            return clientToken.requestToken().then(function() {
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

        request(options, function(err, httpResponse, body) {
            if (err) {
                deferred.reject(err);
            } else {

                try {
                    deferred.resolve(JSON.parse(body));
                } catch(e) {
                    deferred.reject('Error request response is not a valid JSON format');
                }
            }
        });

        return deferred.promise;
    }
};

module.exports = FtvenNodeAuthSdk;