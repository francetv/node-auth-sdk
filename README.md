node-auth-sdk
=============

NodeJS request wrapper with ftven-style authent tokens


How to use?
-----------

```js
var FtvenNodeAuthSdk = require('ftven-node-auth-sdk');

var apiUrl      = 'http://myapi.ftven.fr',
    clientId    = 'myApplication',
    userId      = 'john.doe',
    userPwd     = 'crappypwd';

var sdk = new FtvenNodeAuthSdk(apiUrl, clientId, userId, userPwd);


var method = 'POST',
    uri = '/videos',
    data = {
        foo: 'bar'
    },
    headers = {
        'X-FTVEN-DEBUG': 'On'
    },
    options = {
        // Accepts any option from https://github.com/request/request#requestoptions-callback
        // Except url, uri, method, headers and body that will get overriden
        timeout: 15000
    };

sdk.call(method, uri, data, headers, options);
    .then(function(httpResponse, body) {
        // ...
    })
    .fail(function(error) {
        console.log(error);
    });

```