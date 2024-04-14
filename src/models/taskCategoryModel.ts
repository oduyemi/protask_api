import mongoose, { Schema, Document } from "mongoose";

export interface ITaskCategory extends Document {
  name: string;
  description: string;
}

const taskCategorySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const TaskCategory = mongoose.model<ITaskCategory>("TaskCategory", taskCategorySchema);

export default TaskCategory;
