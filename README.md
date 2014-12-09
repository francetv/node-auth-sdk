node-auth-sdk
=============

NodeJS request wrapper with ftven-style authent tokens

Steps
-----

You need to send a request to an API, but you cannot send it directly. There are 3 steps.

### Step 1: the client token

If the token is not already saved or if it is expired, this package will automatically grab a Client Token. The Client Token identifies the application you are currenlty developping. Let's say it's called `myApplication`.
A request is sent to `http://myapi.ftven.fr/access_token` with this header:
```
'X-Ftven-Id': 'id: myApplication'
```
The API responds with this header:
```
'X-Ftven-Id': 'id: myApplication, expire: 2014-12-10T14:16:21+0100, token: OTIxZjkzOGY4MjY4NzFhYz2ZDU53OTY1ZjE2ZGEzOWQxNDRjMWQwNQ=='
```

### Step 2: the user token

Another token is needed, for the user. It identifies the current user of the application.
This package will automatically grab the Client Token if needed.
A request is sent to `http://myapi.ftven.fr/user_token` with this headers:
```
'X-Ftven-Id': 'id: myApplication, expire: 2014-12-10T14:16:21+0100, token: OTIxZjkzOGY4MjY4NzFhYz2ZDU53OTY1ZjE2ZGEzOWQxNDRjMWQwNQ=='
'X-Ftven-User': 'id: john.doe, password: 769hjjKBJYG988YHJFyJ99863Dff'
```
The API responds with this header:
```
'x-Ftven-User': 'id: john.doe, expire: 2014-12-10T14:16:21+0100, token: Yzg2YjA0MWNiNmFlZDc0YzVjZGM2OT3RhYzFiOD5NTAzNjI2MmMwMw=='
```

### Step 3: the request

Finally, your initial request is sent with these two headers:
```
'X-Ftven-Id': 'id: myApplication, expire: 2014-12-10T14:16:21+0100, token: OTIxZjkzOGY4MjY4NzFhYz2ZDU53OTY1ZjE2ZGEzOWQxNDRjMWQwNQ=='
'X-Ftven-User': 'id: john.doe, expire: 2014-12-10T14:16:21+0100, token: Yzg2YjA0MWNiNmFlZDc0YzVjZGM2OT3RhYzFiOD5NTAzNjI2MmMwMw=='
```

If everything goes right, the API is happy and your request is accepted by the API.
If anything goes wrong, take a breath, take a beer, then launch your app in debug mode.


Debug mode
----------

Just add `DEBUG=node-auth-sdk` when launching your application.
For example if you use to launch your app like this:
```
node bin/myApp.js
```
Then launch it like that:
```
DEBUG=node-auth-sdk node bin/myApp.js
```


How to use?
-----------

First, install the package in your repository:
```npm install ftven-node-auth-sdk --save```

Then, implement like this:

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
        // What's sent as a body for the POST, PUT, PATCH verbs.
        // FTVEN's APIs have a JSON body.
        foo: 'bar'
    },
    headers = {
        // Add your custom headers here. Example:
        'X-Ftven-Debug': 1
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


Contribution
------------

Don't hesitate to fix bugs.
Don't hesitate to adapt this module to your own API, but try to do this by implementing new options, instead of creating a fork.
Don't forget to change version number in `package.json` and publish to NPM.