"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileAttachmentSchema = new mongoose_1.default.Schema({
    filename: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    uploadedByRole: {
        type: String,
        enum: ['mentor', 'mentee'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const FileAttachment = mongoose_1.default.model("FileAttachment", fileAttachmentSchema);
exports.default = FileAttachment;
