import mongoose, { Schema, Document } from "mongoose";

export interface ITaskComment extends Document {
  task: mongoose.Types.ObjectId;
  commenter: mongoose.Types.ObjectId;
  commenterRole: 'mentor' | 'mentee'; // Indicates the role of the commenter
  comment: string;
  commentedAt: Date;
}

const taskCommentSchema: Schema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
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

const TaskComment = mongoose.model<ITaskComment>("TaskComment", taskCommentSchema);

export default TaskComment;
