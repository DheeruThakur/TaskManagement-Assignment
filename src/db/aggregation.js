const mongoose = require("mongoose");

// this aggregation query function contains aggregation query to fetch all tasks whose isDeleted flag is false and also fetch their 
// subtasks whose isDeleted flag is false
const taskAggregationQuery = (email) => [
  {
    $match: { email },
  },
  {
    $project: {
      tasks: {
        $filter: {
          input: "$tasks",
          as: "task",
          cond: {
            $eq: ["$$task.isDeleted", false],
          },
        },
      },
    },
  },
  {
    $unwind: "$tasks",
  },
  {
    $project: {
      "tasks._id": 1,
      "tasks.subject": 1,
      "tasks.deadline": 1,
      "tasks.status": 1,
      "tasks.isDeleted": 1,
      "tasks.subtasks": {
        $filter: {
          input: "$tasks.subtasks",
          as: "subtask",
          cond: {
            $eq: ["$$subtask.isDeleted", false],
          },
        },
      },
    },
  },
  {
    $group: {
      _id: "$_id",
      tasks: { $push: "$tasks" },
    },
  },
];

// this aggregation query function contains aggregation query to fetch all subtasks whose isDeleted flag is false 
const subTaskAggregationQuery = (email, taskId) => [
  {
    $match: { email },
  },
  {
    $unwind: "$tasks",
  },
  {
    $match: { "tasks._id": new mongoose.Types.ObjectId(taskId) },
  },
  {
    $unwind: "$tasks.subtasks",
  },
  {
    $match: { "tasks.subtasks.isDeleted": false },
  },
  {
    $group: { _id: "$tasks._id", subtasks: { $push: "$tasks.subtasks" } },
  },
];

// export both the functions
module.exports = { taskAggregationQuery, subTaskAggregationQuery };
