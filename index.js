'use strict';

const express = require('express');
const bodyParser = require('body-parser');


var request = require("request")



const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action == "allcontacts" ) {
                    var url = "https://dataclips.heroku.com/dxmvgrthkhfrnquwigtwbshnhgim-All-Contacts.json"
                    request({
                        url: url,
                        json: true
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            console.log(body) // Print the json response
                            speech += body.values[0][0];
                            return res.json({
                                speech: speech,
                                displayText: speech,
                                source: 'apiai-webhook-sample'
                            });
                        }
                    })
                }
                


            }
        }

        console.log('result: ', speech);

        
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
