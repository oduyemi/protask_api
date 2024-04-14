import express, { Request, Response } from "express";
import Task from "../models/taskModel.js";
import TaskCategory from "../models/taskCategoryModel.js";
import Mentee from "../models/menteeModel.js";
import Mentor from "../models/mentorModel.js";

const router = express.Router();


router.delete("/mentees/:menteeId", async (req: Request, res: Response) => {
    try {
        const menteeId = req.params.menteeId;
        const deletedMentee = await Mentee.findByIdAndDelete(menteeId);

        if (!deletedMentee) {
            return res.status(404).json({ Message: "Mentee not found" });
        }

        res.json({ Message: "Mentee deleted successfully" });
    } catch (error) {
        console.error("Error deleting mentee", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.delete("/tasks/:taskId", async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ Message: "Task not found" });
        }

        res.json({ Message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.delete("/task-categories/:categoryId", async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = await TaskCategory.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ Message: "Task category not found" });
        }

        res.json({ Message: "Task category deleted successfully" });
    } catch (error) {
        console.error("Error deleting task category", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.delete("/mentors/:mentorId", async (req: Request, res: Response) => {
    try {
        const mentorId = req.params.mentorId;
        const deletedMentor = await Mentor.findByIdAndDelete(mentorId);

        if (!deletedMentor) {
            return res.status(404).json({ Message: "Mentor not found" });
        }

        res.json({ Message: "Mentor deleted successfully" });
    } catch (error) {
        console.error("Error deleting mentor", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});



export default router;