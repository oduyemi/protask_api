"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskAssignmentSchema = new mongoose_1.default.Schema({
    task: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    assigned_to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Mentee",
        required: true,
    },
    assigned_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true,
    },
    assigned_at: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completed_at: {
        type: Date,
    },
});
const TaskAssignment = mongoose_1.default.model("TaskAssignment", taskAssignmentSchema);
exports.default = TaskAssignment;
