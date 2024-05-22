const mongoose = require("mongoose")
const {DB_NAME} = require("../constants.js");

// create mongodb connection instance
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

// export the connection function
module.exports = connectDB