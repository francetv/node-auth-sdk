var FtvenNodeAuthSdk = require('../index.js');

var params = require('./example-params.json');

// The example-params.json file looks like this:
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

sdk.getUserToken()
    .then(function(body) {
        console.log('success');
        console.log(body);
    })
    .fail(function(error) {
        console.log('fail');
        console.log(error);
    });