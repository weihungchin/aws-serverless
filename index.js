// index.js

const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

const users = require("./users");

const USERS_TABLE = process.env.USERS_TABLE;
const CAMP_TABLE = process.env.CAMP_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === "true") {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000"
    });
    console.log(dynamoDb);
} else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(
    bodyParser.json({
        strict: false
    })
);

app.use(users);

// app.get("/", function(req, res) {
//   res.send("Hello World!");
// });

// // Get User endpoint
// app.get("/users/:userId", function(req, res) {
//   const params = {
//     TableName: USERS_TABLE,
//     Key: {
//       userId: req.params.userId
//     }
//   };

//   dynamoDb.get(params, (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(400).json({
//         error: "Could not get user"
//       });
//     }
//     if (result.Item) {
//       const { userId, name } = result.Item;
//       res.json({
//         userId,
//         name
//       });
//     } else {
//       res.status(404).json({
//         error: "User not found"
//       });
//     }
//   });
// });

// Create User endpoint
app.post("/users", function (req, res) {
    const {
        userId,
        name
    } = req.body;
    if (typeof userId !== "string") {
        res.status(400).json({
            error: '"userId" must be a string'
        });
    } else if (typeof name !== "string") {
        res.status(400).json({
            error: '"name" must be a string'
        });
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: userId,
            name: name
        }
    };

    dynamoDb.put(params, error => {
        if (error) {
            console.log(error);
            res.status(400).json({
                error: "Could not create user"
            });
        }
        res.json({
            userId,
            name
        });
    });
});

app.get("/campaign/:campaignId", function (req, res) {
    const params = {
        TableName: CAMP_TABLE,
        Key: {
            campaignId: req.params.campaignId
        }
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({
                error: "Could not get user"
            });
        }
        if (result.Item) {
            const {
                campaignId,
                name
            } = result.Item;
            res.json({
                campaignId,
                name
            });
        } else {
            res.status(404).json({
                error: "User not found"
            });
        }
    });
});

// Create User endpoint
app.post("/campaign", function (req, res) {
    const {
        campaignId,
        name
    } = req.body;
    if (typeof campaignId !== "string") {
        res.status(400).json({
            error: '"userId" must be a string'
        });
    } else if (typeof name !== "string") {
        res.status(400).json({
            error: '"name" must be a string'
        });
    }

    const params = {
        TableName: CAMP_TABLE,
        Item: {
            campaignId: campaignId,
            name: name
        }
    };

    dynamoDb.put(params, error => {
        if (error) {
            console.log(error);
            res.status(400).json({
                error: "Could not create user"
            });
        }
        res.json({
            campaignId,
            name
        });
    });
});

module.exports.handler = serverless(app);