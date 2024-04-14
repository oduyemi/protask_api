import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  task_category: mongoose.Types.ObjectId; 
  description: string;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  assigned_to: mongoose.Types.ObjectId; 
}

const taskSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  task_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskCategory", 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: "Mentee", 
    required: true,
  },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
