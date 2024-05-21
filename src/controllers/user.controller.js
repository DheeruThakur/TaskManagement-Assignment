const User = require("../models/user.models.js");
const ApiResponse = require("../utils/ApiResponse.js")

const addUser = async (req, res) => {
  try {
    const { name, email} = req.body;

    const user = new User({
      tasks: [],
      name,
      email,
    });

    await user.save();
    return res.status(201).json( new ApiResponse(201, user, "User registered Successfully") );
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};


module.exports = {
                    addUser
                }