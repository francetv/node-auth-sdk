var request     = require('request');
var printf      = require('printf');
var Q           = require('q');
var url         = require('url');
var debug       = require('debug')('node-auth-sdk');

var ClientToken = function(apiUrl, clientId) {
    'use strict';

    var tokenKey = 'X-Ftven-Id';
    var tokenInfos = null;


    this.getKey = function() {
        return tokenKey;
    };


    this.getObject = function() {
        return tokenInfos;
    };


    this.getValue = function() {
        return printf('id: %s, expire: %s, token: %s', tokenInfos.id, tokenInfos.expireString, tokenInfos.token);
    };


    this.hasToken = function() {
        return tokenInfos !== null;
    };


    this.isExpiredToken = function() {
        return new Date() >= clientToken.expire - 20000; // 20 seconds security
    };


    this.requestToken = function() {
        var deferred = Q.defer();

        debug('Requesting the client token');

        var headers = {};
        headers[tokenKey] = printf('id: %s', clientId);

        var requestOptions = {
            url: url.resolve(apiUrl, '/access_token'),
            method: 'POST',
            headers: headers
        };

        debug(requestOptions);

        request(requestOptions, function(err, httpResponse, body) {
            
            if (err) {

                debug('Could not retrieve client token');
                debug(err);
                deferred.reject(err);

            } else {

                debug('Response from API code:%d', httpResponse.statusCode);
                debug('Headers:');
                debug(httpResponse.headers);

                if (httpResponse.statusCode !== 204 && httpResponse.statusCode !== 201) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            if (data.code && data.message) {
                                
                                debug(printf('Error %d %s (API Client Token)', data.code, data.message));
                                deferred.reject(printf('Error %d %s (API Client Token)', data.code, data.message));
                                return;
                            }
                        } catch(e) {}
                    }
                    debug(printf('Error %d (API Client Token)', httpResponse.statusCode));
                    deferred.reject(printf('Error %d (API Client Token)', httpResponse.statusCode));
                    return;
                }

                if (httpResponse.headers && httpResponse.headers[tokenKey.toLowerCase()]) {

                    // Hey, the token is here!
                    saveToken(httpResponse.headers[tokenKey.toLowerCase()]);
                    debug('Client token is ok and saved');
                    deferred.resolve();

                } else {
                    deferred.reject();
                }
            }
        });

        return deferred.promise;
    };


    function saveToken(data) {
        // Ensure the given access token is valid
        if (typeof data !== "string" ||
            /^id: [a-zA-Z0-9_-]+, expire: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}, token: [a-zA-Z0-9]+==$/.test(data) !== true) {
            throw "The passed access token is not valid (API Client Token)";
        }

        var expireString = data.match(/expire: ([^,]+)/)[1];

        // Extract the data from the access token
        tokenInfos = {
            id: data.match(/id: ([^,]+)/)[1],
            expire: expireString,
            expireString: expireString,
            token: data.match(/token: ([^,]+)/)[1]
        };
    }

};

module.exports = ClientToken;