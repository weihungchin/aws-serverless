const express = require("express");
const app = module.exports = express();
const AWS = require("aws-sdk");

const USERS_TABLE = process.env.USERS_TABLE;
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


app.get("/", function (req, res) {
    res.send("Hello World!");
});

// Get User endpoint
app.get("/users/:userId", function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: req.params.userId
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
                userId,
                name
            } = result.Item;
            res.json({
                userId,
                name
            });
        } else {
            res.status(404).json({
                error: "User not found"
            });
        }
    });
});