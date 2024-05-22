require("dotenv").config({path:__dirname+'/.env'});

const connectDB = require("./db/index.js");
const { app } = require("./app.js");


// connect with the DB by calling connectDB function
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8090, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });