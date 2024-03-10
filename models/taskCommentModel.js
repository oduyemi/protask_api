"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskCommentSchema = new mongoose_1.default.Schema({
    task: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    commenter: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    commenterRole: {
        type: String,
        enum: ['mentor', 'mentee'],
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    commentedAt: {
        type: Date,
        default: Date.now,
    },
});
const TaskComment = mongoose_1.default.model("TaskComment", taskCommentSchema);
exports.default = TaskComment;
