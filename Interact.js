var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
    keyPath: 'D:/WebProject/AWS-IoT-Demo/cert/bus.private.key',
    certPath: 'D:/WebProject/AWS-IoT-Demo/cert/cert/bus.cert.pem',
    caPath: 'D:/WebProject/AWS-IoT-Demo/cert/cert/rootCA.pem',
    clientId: 'bus',
    host: 'a3w4o5k368npm1.iot.us-east-1.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
    .on('connect', function () {
        console.log('connect');
        device.subscribe('resived_topic_1');
        device.publish('sent_topic_2', JSON.stringify({

            // For DynamoDB demo

            // serialNumber: 'Truong',
            // startEngine: '123'

            // For simple MQTT demo

            test_data: 'Hello AWS Iot'
        }));
        console.log('Send succesfully');
    });

device
    .on('message', function (topic, payload) {
        console.log('message', topic, payload.toString());
    });