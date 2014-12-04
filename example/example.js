var FtvenNodeAuthSdk = require('../index.js');

var params = require('./example-params.json');

/*
var params = {
    "apiUrl": "",
    "clientId": "",
    "userId": "",
    "userPwd": "",
    "verb": "GET",
    "uri": ""
}*/

var sdk = new FtvenNodeAuthSdk(params.apiUrl, params.clientId, params.userId, params.userPwd);

sdk.call(params.verb, params.uri)
    .then(function(httpResponse, body) {
        console.log(body);
    })
    .fail(function(error) {
        console.log(error);
    });