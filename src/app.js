
const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// import the router 
const userRouter = require('./routes/user.routes.js');

// register path for different routes starts with /api/v1
app.use("/api/v1", userRouter)

module.exports = { app }