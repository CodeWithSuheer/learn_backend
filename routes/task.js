import express from "express";
import { deleteTasks, getAllTasks, newTask, updateTasks } from "../controllers/task.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/new', isAuthenticated, newTask);
router.get('/all', isAuthenticated, getAllTasks);
router.route('/:id').put(updateTasks).delete(deleteTasks);

export default router;