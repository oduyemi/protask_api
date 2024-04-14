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
router.delete("/mentees/:menteeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menteeId = req.params.menteeId;
        const deletedMentee = yield menteeModel_js_1.default.findByIdAndDelete(menteeId);
        if (!deletedMentee) {
            return res.status(404).json({ Message: "Mentee not found" });
        }
        res.json({ Message: "Mentee deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting mentee", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.delete("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const deletedTask = yield taskModel_js_1.default.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ Message: "Task not found" });
        }
        res.json({ Message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.delete("/task-categories/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = yield taskCategoryModel_js_1.default.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ Message: "Task category not found" });
        }
        res.json({ Message: "Task category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task category", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.delete("/mentors/:mentorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorId = req.params.mentorId;
        const deletedMentor = yield mentorModel_js_1.default.findByIdAndDelete(mentorId);
        if (!deletedMentor) {
            return res.status(404).json({ Message: "Mentor not found" });
        }
        res.json({ Message: "Mentor deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting mentor", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
exports.default = router;
