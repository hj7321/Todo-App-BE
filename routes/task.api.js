const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.controller");
const auth = require("../controller/auth.controller").authenticate;

router.post("/", auth, taskController.createTask);
router.get("/", auth, taskController.getTasks);
router.get("/my", auth, taskController.getMyTasks);
router.get("/search", auth, taskController.searchTasks);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
