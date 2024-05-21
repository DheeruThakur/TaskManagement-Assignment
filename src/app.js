
const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const userRouter = require('./routes/user.routes.js');

app.use("/api/v1", userRouter)

module.exports = { app }