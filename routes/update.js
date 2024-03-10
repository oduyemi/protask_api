"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskModel_js_1 = __importDefault(require("../models/taskModel.js"));
const taskCategoryModel_js_1 = __importDefault(require("../models/taskCategoryModel.js"));
const menteeModel_js_1 = __importDefault(require("../models/menteeModel.js"));
const mentorModel_js_1 = __importDefault(require("../models/mentorModel.js"));
const router = express_1.default.Router();
router.put("/mentees/:menteeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menteeId = req.params.mentorId;
        const updatedMenteeData = req.body;
        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedMenteeData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedMentee = yield menteeModel_js_1.default.findByIdAndUpdate(menteeId, updatedMenteeData, { new: true });
        if (!updatedMentee) {
            return res.status(404).json({ Message: "Mentee not found" });
        }
        res.json({ data: updatedMentee });
    }
    catch (error) {
        console.error("Error updating mentee profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.put("/mentors/:mentorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorId = req.params.mentorId;
        const updatedMentorData = req.body;
        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedMentorData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedMentor = yield mentorModel_js_1.default.findByIdAndUpdate(mentorId, updatedMentorData, { new: true });
        if (!updatedMentor) {
            return res.status(404).json({ Message: "Mentor not found" });
        }
        res.json({ data: updatedMentor });
    }
    catch (error) {
        console.error("Error updating mentor profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.put("/task-categories/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        const updatedCategoryData = req.body;
        const requiredFields = ["name", "description", "img"];
        const missingFields = requiredFields.filter(field => !(field in updatedCategoryData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedCategory = yield taskCategoryModel_js_1.default.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ Message: "Task category not found" });
        }
        res.json({ data: updatedCategory });
    }
    catch (error) {
        console.error("Error updating task category", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.put("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const updatedTaskData = req.body;
        const requiredFields = ["title", "description", "img", "deadline", "completed", "createdAt", "updatedAt"];
        const missingFields = requiredFields.filter(field => !(field in updatedTaskData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedTask = yield taskModel_js_1.default.findByIdAndUpdate(taskId, updatedTaskData, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ Message: "Task not found" });
        }
        res.json({ data: updatedTask });
    }
    catch (error) {
        console.error("Error updating task", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
exports.default = router;
