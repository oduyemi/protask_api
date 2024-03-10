import express, { Request, Response } from "express";
import Task, { ITask } from "../models/taskModel.js";
import TaskCategory, { ITaskCategory} from "../models/taskCategoryModel.js";
import TaskAssignment, { ITaskAssignment } from "../models/taskAssignmentModel.js";
import TaskComment, { ITaskComment} from "../models/taskCommentModel.js";
import Project, { IProject } from "../models/projectModel.js";
import Mentee, { IMentee } from "../models/menteeModel.js";
import Mentor, { IMentor } from "../models/mentorModel.js";

const router = express.Router();


router.get("/", (req: Request, res: Response) => {
    res.json({ message: "ProTask!!" });
    });

router.get("/mentees", async (req: Request, res: Response) => {
    try {
        const mentees: IMentee[] = await Mentee.find();
        if (mentees.length === 0) {
            res.status(404).json({ Message: "Mentees not available" });
        } else {
            res.json({ data: mentees });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/mentees/:menteeId", async (req: Request, res: Response) => {
    try {
        const menteeId = req.params.menteeId;
        const mentee: IMentee | null = await Mentee.findById(menteeId);
    
        if (!mentee) {
        res.status(404).json({ Message: "Mentee not found" });
        } else {
        res.json({ data: mentee });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});
        
        
router.get("/mentors", async (req: Request, res: Response) => {
    try {
        const mentors: IMentor[] = await Mentor.find();
        if (mentors.length === 0) {
            res.status(404).json({ Message: "Mentors not available" });
        } else {
            res.json({ data: mentors });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/mentors/:mentorId", async (req: Request, res: Response) => {
    try {
        const mentorId = req.params.mentorId;
        const mentor: IMentor | null = await Mentor.findById(mentorId);
    
        if (!mentor) {
        res.status(404).json({ Message: "Mentor not found" });
        } else {
        res.json({ data: mentor });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

router.get("/tasks", async (req: Request, res: Response) => {
    try {
        const tasks: ITask[] = await Task.find();
        if (tasks.length === 0) {
            res.status(404).json({ Message: "Tasks not available" });
        } else {
            res.json({ data: tasks });
        }
        } catch (error) {

        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/tasks/:taskId", async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskCategoryId;
        const task: ITask | null = await Task.findById(taskId);
    
        if (!task) {
        res.status(404).json({ Message: "Task not found" });
        } else {
        res.json({ data: task });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

router.get("/tasks/task-categories", async (req: Request, res: Response) => {
    try {
      const categories: ITaskCategory[] = await TaskCategory.find();
  
      if (categories.length === 0) {
        res.status(404).json({ Message: "No task categories available" });
      } else {
        res.json({ data: categories });
      }
    } catch (error) {
      console.error("Error fetching course categories from the database", error);
      res.status(500).json({ Message: "Internal Server Error" });
    }
});
  

router.get("/tasks/task/:categoryId", async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
    
        const category: ITaskCategory[] = await TaskCategory.find({ category: categoryId });
    
        if (category.length === 0) {
        res.status(404).json({ Message: `No tasks available for this category: ${categoryId}` });
        } else {
        res.json({ data: category });
        }
    } catch (error) {
        console.error("Error fetching course category from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});




export default router;