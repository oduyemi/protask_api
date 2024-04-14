import mongoose, { Schema, Document } from "mongoose";

export interface IMentorRequest extends Document {
    menteeId: mongoose.Types.ObjectId;
    mentorId: mongoose.Types.ObjectId;
    taskCategoryId: mongoose.Types.ObjectId;
    status: string;
    createdAt: Date;
}

const mentorRequestSchema: Schema = new mongoose.Schema({
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

const MentorRequest = mongoose.model<IMentorRequest>("MentorRequest", mentorRequestSchema);

export default MentorRequest;
