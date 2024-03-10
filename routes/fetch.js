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
router.get("/", (req, res) => {
    res.json({ message: "ProTask!!" });
});
router.get("/mentees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentees = yield menteeModel_js_1.default.find();
        if (mentees.length === 0) {
            res.status(404).json({ Message: "Mentees not available" });
        }
        else {
            res.json({ data: mentees });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/mentees/:menteeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menteeId = req.params.menteeId;
        const mentee = yield menteeModel_js_1.default.findById(menteeId);
        if (!mentee) {
            res.status(404).json({ Message: "Mentee not found" });
        }
        else {
            res.json({ data: mentee });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/mentors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentors = yield mentorModel_js_1.default.find();
        if (mentors.length === 0) {
            res.status(404).json({ Message: "Mentors not available" });
        }
        else {
            res.json({ data: mentors });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/mentors/:mentorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorId = req.params.mentorId;
        const mentor = yield mentorModel_js_1.default.findById(mentorId);
        if (!mentor) {
            res.status(404).json({ Message: "Mentor not found" });
        }
        else {
            res.json({ data: mentor });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield taskModel_js_1.default.find();
        if (tasks.length === 0) {
            res.status(404).json({ Message: "Tasks not available" });
        }
        else {
            res.json({ data: tasks });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskCategoryId;
        const task = yield taskModel_js_1.default.findById(taskId);
        if (!task) {
            res.status(404).json({ Message: "Task not found" });
        }
        else {
            res.json({ data: task });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/tasks/task-categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield taskCategoryModel_js_1.default.find();
        if (categories.length === 0) {
            res.status(404).json({ Message: "No task categories available" });
        }
        else {
            res.json({ data: categories });
        }
    }
    catch (error) {
        console.error("Error fetching course categories from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/tasks/task/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        const category = yield taskCategoryModel_js_1.default.find({ category: categoryId });
        if (category.length === 0) {
            res.status(404).json({ Message: `No tasks available for this category: ${categoryId}` });
        }
        else {
            res.json({ data: category });
        }
    }
    catch (error) {
        console.error("Error fetching course category from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
exports.default = router;
