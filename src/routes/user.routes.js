const { Router } = require("express");

const {addUser} = require("../controllers/user.controller.js")
const {addTask, deleteTask, addSubtasks, deleteSubTask, fetchAllTasks, fetchAllSubTasks, updateTask, updateSubTasks} = require("../controllers/task.controller.js")

const router = Router()

// routes which are mentioned in task doc

// this route delete a task by its taskId
router.route("/tasks/:taskId").delete(deleteTask)

// this route add a new task to the task array in user
router.route("/tasks").post(addTask)

// this route fetch all the tasks along with their subtasks
router.route("/tasks").get(fetchAllTasks)

// this route fetch all subtasks of a task
router.route("/tasks/:taskId/subtasks").get(fetchAllSubTasks)

// this route update a task by its id
router.route("/tasks/:taskId").put(updateTask)

// this route updates whole subtasks array present inside a task by its task id
router.route("/tasks/:taskId/subtasks").put(updateSubTasks)


// extra routes

// this route add/register new user
router.route("/add-user").post(addUser)

// this route add subtasks in a task by its taskId
router.route("/tasks/:taskId/subtask").post(addSubtasks)

// this route delete a subtask of a task with the help of taskId and subtaskId
router.route("/tasks/:taskId/subtask/:subtaskId").delete(deleteSubTask)




module.exports = router