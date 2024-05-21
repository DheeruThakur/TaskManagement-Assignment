const User = require("../models/user.models.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { taskAggregationQuery , subTaskAggregationQuery } = require("../db/aggregation.js");

const addTask = async (req, res) => {
  try {
    const { subject, deadline, status, email } = req.body;

    if (
      [subject, deadline, status, email].some((field) => field?.trim() === "")
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedDate = new Date(deadline);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ error : "User not found with this email" });
    }

    const task = {
      subject,
      deadline,
      status,
    };

    user.tasks.push(task);
    const savedUser = await user.save();

    const newTask = savedUser.tasks[savedUser.tasks.length - 1];

    return res
      .status(201)
      .json(new ApiResponse(201, newTask, "Task created successfully"));
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// extra end point
const addSubtasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { subject, deadline, status, email } = req.body;

    if (!subject || !deadline || !status || !email || !taskId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedDate = new Date(deadline);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const subtask = {
      subject,
      deadline,
      status,
    };

    const user = await User.findOneAndUpdate(
      { email, "tasks._id": taskId },
      { $push: { "tasks.$.subtasks": subtask } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User or task not found" });
    }

    return res
      .status(201)
      .json(new ApiResponse(201, user.tasks, "SubTask added successfully"));
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email } = req.body;

    if (!taskId || !email) {
      return res.status(400).json({ error: "taskId and email are missing" });
    }

    const user = await User.findOneAndUpdate(
      { email: email, "tasks._id": taskId },
      { $set: { "tasks.$.isDeleted": true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User or task not found" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Task deleted successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// extra endpoint
const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { email } = req.body;

    if (!taskId || !email || !subtaskId) {
      return res.status(400).json({ error: "taskId , email , subTaskId all are required" });
    }

    const user = await User.findOneAndUpdate(
      { email: email, "tasks._id": taskId, "tasks.subtasks._id": subtaskId },
      { $set: { "tasks.$[task].subtasks.$[subtask].isDeleted": true } },
      {
        arrayFilters: [{ "task._id": taskId }, { "subtask._id": subtaskId }],
        new: true,
      }
    );

    if (!user) {
      return res
        .status(404)
        .json({ error: "User or task or subtask not found" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "SubTask deleted successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const fetchAllTasks = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "email is required" });
      }

    const tasks = await User.aggregate(taskAggregationQuery(email));

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no tasks available" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const fetchAllSubTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email } = req.body;

    if (!taskId || !email) {
        return res.status(400).json({ error: "taskId and email are required" });
      }

    const subTasks = await User.aggregate(subTaskAggregationQuery(email , taskId));

    if (!subTasks || subTasks.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no subtasks available" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subTasks, "Tasks fetched successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const updateTask = async (req , res) => {
    try {
        const {taskId} = req.params;
        const {subject , deadline , status , email} = req.body;

        if(!email || !subject || !deadline || !status){
            return res.status(400).json({ error: "email , subject , deadline , status all fields are required" });
        }

        const parsedDate = new Date(deadline);

        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format" });
        }

        const user = await User.findOne({ email });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        const task = user.tasks.id(taskId);

        if (!task) {
        return res.status(404).json({ error: 'Task not found' });
        }

    
        if (task.isDeleted) {
        return res.status(404).json({ error: 'Task does not exist' });
        }

        task.subject = subject;
        task.deadline = deadline;
        task.status = status;

        await user.save();

        task.subtasks = task.subtasks.filter(subtask => !subtask.isDeleted);
        
        return res.status(200).json( new ApiResponse(200 , task , "Task updated successfully"))

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "server error",
        });
      }
}

const updateSubTasks = async (req , res) => {
    try {
        const {taskId} = req.params;
        const {subtaskList , email} = req.body;

        if(!email || !taskId || !subtaskList){
            return res.status(400).json({ error: "email , taskId , subtaskList all fields are required" });
        }

        if(!Array.isArray(subtaskList)){
            return res.status(400).json({ error: "subtaskList must be an array" });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ error: "user not found" });
        }

        const task = user.tasks.id(taskId);

        if(!task || task.isDeleted){
            return res.status(400).json({ error: "Task not found" });
        }

        const deletedSubTasks = task.subtasks.filter(subtask => subtask.isDeleted);

        const mergedSubTasks = [ ...subtaskList , ...deletedSubTasks]

        task.subtasks = mergedSubTasks;

        const savedSubtasks = await user.save();

        return res.status(200).json( new ApiResponse(200 , subtaskList , "Task updated successfully"))

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "server error",
        });
      }
}


module.exports = {
  addTask,
  deleteTask,
  addSubtasks,
  deleteSubTask,
  fetchAllTasks,
  fetchAllSubTasks,
  updateTask,
  updateSubTasks
};
