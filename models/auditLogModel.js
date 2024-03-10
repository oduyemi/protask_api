"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auditLogSchema = new mongoose_1.default.Schema({
    action: {
        type: String,
        required: true,
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    performedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    performedByRole: {
        type: String,
        enum: ['mentor', 'mentee'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const AuditLog = mongoose_1.default.model("AuditLog", auditLogSchema);
exports.default = AuditLog;
