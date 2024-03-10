import mongoose, { Schema, Document } from "mongoose";

export interface IMenteeRequest extends Document {
    menteeId: mongoose.Types.ObjectId;
    mentorId: mongoose.Types.ObjectId;
    taskCategoryId: mongoose.Types.ObjectId;
    status: string;
    createdAt: Date;
}

const menteeRequestSchema: Schema = new mongoose.Schema({
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentee",
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true
    },
    taskCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
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

const MenteeRequest = mongoose.model<IMenteeRequest>("MenteeRequest", menteeRequestSchema);

export default MenteeRequest;
