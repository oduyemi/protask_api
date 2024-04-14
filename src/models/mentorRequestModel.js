"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mentorRequestSchema = new mongoose_1.default.Schema({
    menteeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Mentee",
        required: true
    },
    mentorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true
    },
    taskCategoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "TaskCategory",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const MentorRequest = mongoose_1.default.model("MentorRequest", mentorRequestSchema);
exports.default = MentorRequest;
