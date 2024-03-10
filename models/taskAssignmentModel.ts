import mongoose, { Schema, Document } from "mongoose";

export interface ITaskAssignment extends Document {
  task: mongoose.Types.ObjectId;
  assigned_to: mongoose.Types.ObjectId;
  assigned_by: mongoose.Types.ObjectId; 
  assigned_at: Date;
  completed: boolean;
  completed_at?: Date;
}

const taskAssignmentSchema: Schema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentee",
    required: true,
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
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

const TaskAssignment = mongoose.model<ITaskAssignment>("TaskAssignment", taskAssignmentSchema);

export default TaskAssignment;
