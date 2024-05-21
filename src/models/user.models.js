const { mongoose, Schema } = require("mongoose");

const subtaskSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "inprogress", "completed"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "inprogress", "completed"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subtasks: [subtaskSchema],
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [taskSchema],
});

module.exports = mongoose.model("User", userSchema);