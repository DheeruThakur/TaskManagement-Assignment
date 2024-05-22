const User = require("../models/user.models.js");
const ApiResponse = require("../utils/ApiResponse.js")

// addUser function contains all the logic to add new user in the DB.
const addUser = async (req, res) => {
  try {
    const { name, email} = req.body;

    // check for the availability of all the fields in the request's body
    if(!name || !email){
      return res.status(400).json({ error: "All fields are required" });
    }

    // create a user object to save in the DB
    const user = new User({
      tasks: [],
      name,
      email,
    });

    // save user in the DB
    await user.save();

    return res.status(201).json( new ApiResponse(201, user, "User registered Successfully") );

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// export the addUser function
module.exports = {
                    addUser
                }