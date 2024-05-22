const User = require("../models/user.models.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { taskAggregationQuery , subTaskAggregationQuery } = require("../db/aggregation.js");

// addTask function contains all the logic to add new task in the tasks array present inside user in DB.
const addTask = async (req, res) => {
  try {
    const { subject, deadline, status, email } = req.body;

    // check for the availability of all the fields in the request's body
    if(!subject || !deadline || !status || email){
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedDate = new Date(deadline);

    // check for the format of the date passed by the user
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ error : "User not found with this email" });
    }

    // create a new task object to save in the DB
    const task = {
      subject,
      deadline,
      status,
    };

    user.tasks.push(task);
    const savedUser = await user.save();

    // filter out the saved task for returning in API response
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

// addSubtasks function contains all the logic to add new subtask in the subtasks array present 
//    inside the task object in a user in DB.
const addSubtasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { subject, deadline, status, email } = req.body;

    // check for the availability of all the fields in the request's body
    if (!subject || !deadline || !status || !email || !taskId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedDate = new Date(deadline);

    // check for the format of the date passed by the user
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // create a new subtask object to save in the DB
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

// deleteTask function contains all the logic to delete a task from tasks array present inside user in DB.
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email } = req.body;

    // check for the availability of all the fields in the request's body
    if (!taskId || !email) {
      return res.status(400).json({ error: "taskId and email are missing" });
    }

    // query for updating the isDeleted flag to true
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

// deleteSubTask function contains all the logic to delete a subtask from subtasks array present inside tasks array 
// which is a field in user in DB.
const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { email } = req.body;

     // check for the availability of all the fields in the request's body
    if (!taskId || !email || !subtaskId) {
      return res.status(400).json({ error: "taskId , email , subTaskId all are required" });
    }

    // query to delete a subtask
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

// fetchAllTasks function contains all the logic to fetch all the tasks along with their subtasks of a user.
const fetchAllTasks = async (req, res) => {
  try {
    const { email } = req.body;

    // check for the availablity of email field 
    if (!email) {
        return res.status(400).json({ error: "email is required" });
      }

    // query to fetch all tasks
    const tasks = await User.aggregate(taskAggregationQuery(email));

    // check for the correct result
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

// fetchAllSubTasks function contains all the logic to fetch all the subtasks of a particular task.
const fetchAllSubTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email } = req.body;

    // check for the availability of all the fields in the request's body
    if (!taskId || !email) {
        return res.status(400).json({ error: "taskId and email are required" });
      }

    // query to fetch all subtasks of a task
    const subTasks = await User.aggregate(subTaskAggregationQuery(email , taskId));

    // check for the correct result
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

// updateTask function contains all the logic to update a task present inside tasks array in user in DB.
const updateTask = async (req , res) => {
    try {
        const {taskId} = req.params;
        const {subject , deadline , status , email} = req.body;

        // check for the availability of all the fields in the request's body
        if(!email || !subject || !deadline || !status){
            return res.status(400).json({ error: "email , subject , deadline , status all fields are required" });
        }

        const parsedDate = new Date(deadline);

        // check for the format of the date passed by the user
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format" });
        }

        // query to find the user
        const user = await User.findOne({ email });

        // check for the correct result(user)
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        // find a task with given taskId in tasks array present in user fetched from DB
        const task = user.tasks.id(taskId);

        if (!task) {
        return res.status(404).json({ error: 'Task not found' });
        }

    
        // checking that if the task is already deleted or not
        if (task.isDeleted) {
        return res.status(404).json({ error: 'Task does not exist' });
        }

        // update task object
        task.subject = subject;
        task.deadline = deadline;
        task.status = status;

        // save the modified task object in DB
        await user.save();

        // For returning purpose modify the subtask array
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

// updateSubTasks function contains all the logic to update all the subtasks present inside tasks array in user in DB.
const updateSubTasks = async (req , res) => {
    try {
        const {taskId} = req.params;
        const {subtaskList , email} = req.body;

        // check for the availability of all the fields in the request's body
        if(!email || !taskId || !subtaskList){
            return res.status(400).json({ error: "email , taskId , subtaskList all fields are required" });
        }

        // checking that subtaskList is an valid array or not
        if(!Array.isArray(subtaskList)){
            return res.status(400).json({ error: "subtaskList must be an array" });
        }

        // query to fetch user from DB
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ error: "user not found" });
        }

        // find a task with given taskId in tasks array present in user fetched from DB
        const task = user.tasks.id(taskId);

        // checking that if the task is already deleted or not
        if(!task || task.isDeleted){
            return res.status(400).json({ error: "Task not found" });
        }

        // filter all the subtasks whose isDeleted flag is true i.e deleted subtasks
        const deletedSubTasks = task.subtasks.filter(subtask => subtask.isDeleted);

        // create a array by merging new subtasks array and filtered deleted subtasks array
        const mergedSubTasks = [ ...subtaskList , ...deletedSubTasks]

        // update the subtasks array of task
        task.subtasks = mergedSubTasks;

        // save the updated task/user
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

// export all the functions
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
