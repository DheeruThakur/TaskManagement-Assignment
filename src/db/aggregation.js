const mongoose = require("mongoose");

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

module.exports = { taskAggregationQuery, subTaskAggregationQuery };
