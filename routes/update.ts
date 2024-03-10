import express, { Request, Response } from "express";
import Task, { ITask } from "../models/taskModel.js";
import TaskCategory, { ITaskCategory} from "../models/taskCategoryModel.js";
import Mentee, { IMentee } from "../models/menteeModel.js";
import Mentor, { IMentor } from "../models/mentorModel.js";

const router = express.Router();


router.put("/mentees/:menteeId", async (req: Request, res: Response) => {
    try {
        const menteeId = req.params.mentorId;
        const updatedMenteeData: Partial<IMentee> = req.body;

        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedMenteeData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedMentee= await Mentee.findByIdAndUpdate(menteeId, updatedMenteeData, { new: true });

        if (!updatedMentee) {
            return res.status(404).json({ Message: "Mentee not found" });
        }

        res.json({ data: updatedMentee });
    } catch (error) {
        console.error("Error updating mentee profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

  
router.put("/mentors/:mentorId", async (req: Request, res: Response) => {
    try {
        const mentorId = req.params.mentorId;
        const updatedMentorData: Partial<IMentor> = req.body;

        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedMentorData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, updatedMentorData, { new: true });

        if (!updatedMentor) {
            return res.status(404).json({ Message: "Mentor not found" });
        }

        res.json({ data: updatedMentor });
    } catch (error) {
        console.error("Error updating mentor profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.put("/task-categories/:categoryId", async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const updatedCategoryData: Partial<ITaskCategory> = req.body;

        const requiredFields = ["name", "description", "img"];
        const missingFields = requiredFields.filter(field => !(field in updatedCategoryData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedCategory = await TaskCategory.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ Message: "Task category not found" });
        }

        res.json({ data: updatedCategory });
    } catch (error) {
        console.error("Error updating task category", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.put("/tasks/:taskId", async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const updatedTaskData: Partial<ITask> = req.body;

        const requiredFields = ["title", "description", "img", "deadline", "completed", "createdAt", "updatedAt"];
        const missingFields = requiredFields.filter(field => !(field in updatedTaskData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ Message: "Task not found" });
        }

        res.json({ data: updatedTask });
    } catch (error) {
        console.error("Error updating task", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});



export default router;