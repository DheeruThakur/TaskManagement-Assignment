const { Router } = require("express");

const {addUser} = require("../controllers/user.controller.js")
const {addTask, deleteTask, addSubtasks, deleteSubTask, fetchAllTasks, fetchAllSubTasks, updateTask, updateSubTasks} = require("../controllers/task.controller.js")

const router = Router()

// routes which are mentioned in task doc
router.route("/tasks/:taskId").delete(deleteTask)
router.route("/tasks").post(addTask)
router.route("/tasks").get(fetchAllTasks)
router.route("/tasks/:taskId/subtasks").get(fetchAllSubTasks)
router.route("/tasks/:taskId").put(updateTask)
router.route("/tasks/:taskId/subtasks").put(updateSubTasks)


// extra routes
router.route("/add-user").post(addUser)
router.route("/tasks/:taskId/subtask").post(addSubtasks)
router.route("/tasks/:taskId/subtask/:subtaskId").delete(deleteSubTask)




module.exports = router