const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const moment = require("moment");
const request = require("request");
moment.locale("th");
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
// router test request

app.post("/webhook", function(req, res) {
    let ToDay = moment().format("LL"); //วันที่ปัจจุบัน
    let userMessage = req.body.events[0].message.text;
    let userId = "";
    if (req.body.events[0].source.groupId != undefined) {
        userId = req.body.events[0].source.groupId;
    } else {
        userId = req.body.events[0].source.userId;
    }
    if (userMessage == "ทดสอบ") {
        let formatMessage = {
            type: "flex",
            altText: "ทดสอบระบบตอบกลับ",
            contents: {
                type: "bubble",
                styles: {
                    header: {
                        backgroundColor: "#28b463"
                    }
                },
                header: {
                    type: "box",
                    layout: "baseline",
                    contents: [
                        {
                            type: "text",
                            text: "ทดสอบระบบตอบกลับ",
                            weight: "bold",
                            size: "md",
                            gravity: "top",
                            color: "#FFFFFF",
                            flex: 0
                        }
                    ]
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "วันที่ " + ToDay,
                            align: "center"
                        },
                        {
                            type: "text",
                            text: userMessage,
                            weight: "bold",
                            size: "xl",
                            align: "center"
                        }
                    ]
                }
            }
        };
        reply(userId, formatMessage);
        res.sendStatus(200);
    } 
});

function reply(userId, formatMessage) {
    let headers = {
        "Content-Type": "application/json",
        Authorization:
            "Bearer {}" // Channel access token
    };
    let body = JSON.stringify({
        to: userId,
        messages: [formatMessage]
    });
    request.post(
        {
            url: "https://api.line.me/v2/bot/message/push",
            headers: headers,
            body: body
        },
        (err, res, body) => {
            console.log("status = " + res.statusCode);
        }
    );
}
app.listen(process.env.PORT || 8000, function() {
    console.log("Server up and listening");
});
