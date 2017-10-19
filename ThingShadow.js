var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var thingShadows = awsIot.thingShadow({
    keyPath: 'D:/WebProject/AWS-IoT-Demo/cert/bus.private.key',
    certPath: 'D:/WebProject/AWS-IoT-Demo/cert/bus.cert.pem',
    caPath: 'D:/WebProject/AWS-IoT-Demo/cert/rootCA.pem',
    clientId: 'bus',
    host: 'a3w4o5k368npm1.iot.us-east-1.amazonaws.com'
});

//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;

//
// Simulated device values
//
var rval = 222;
var gval = 555;
var bval = 222;

thingShadows.on('connect', function () {
    //
    // After connecting to the AWS IoT platform, register interest in the
    // Thing Shadow named 'RGBLedLamp'.
    //
    thingShadows.register('bus', {}, function () {

        // Once registration is complete, update the Thing Shadow named
        // 'RGBLedLamp' with the latest device state and save the clientToken
        // so that we can correlate it with status or timeout events.
        //
        // Thing shadow state
        //
        var rgbLedLampState = {
            "state": {
                "desired": {
                    "red": rval,
                    "green": gval,
                    "blue": bval
                }
            }
        };

        clientTokenUpdate = thingShadows.update('bus', rgbLedLampState);
        //
        // The update method returns a clientToken; if non-null, this value will
        // be sent in a 'status' event when the operation completes, allowing you
        // to know whether or not the update was successful.  If the update method
        // returns null, it's because another operation is currently in progress and
        // you'll need to wait until it completes (or times out) before updating the 
        // shadow.
        //
        if (clientTokenUpdate === null) {
            console.log('update shadow failed, operation still in progress');
        }
    });
});
thingShadows.on('status',
    function (thingName, stat, clientToken, stateObject) {
        console.log('received ' + stat + ' on ' + thingName + ': ' +
            JSON.stringify(stateObject));
        //
        // These events report the status of update(), get(), and delete() 
        // calls.  The clientToken value associated with the event will have
        // the same value which was returned in an earlier call to get(),
        // update(), or delete().  Use status events to keep track of the
        // status of shadow operations.
        //
    });

thingShadows.on('delta',
    function (thingName, stateObject) {
        console.log('received delta on ' + thingName + ': ' +
            JSON.stringify(stateObject));
    });

thingShadows.on('timeout',
    function (thingName, clientToken) {
        console.log('received timeout on ' + thingName +
            ' with token: ' + clientToken);
        //
        // In the event that a shadow operation times out, you'll receive
        // one of these events.  The clientToken value associated with the
        // event will have the same value which was returned in an earlier
        // call to get(), update(), or delete().
        //
    });