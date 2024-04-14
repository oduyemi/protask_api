"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menteeRequestSchema = new mongoose_1.default.Schema({
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
const MenteeRequest = mongoose_1.default.model("MenteeRequest", menteeRequestSchema);
exports.default = MenteeRequest;
