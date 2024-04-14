import mongoose, { Schema, Document } from "mongoose";

export interface IFileAttachment extends Document {
  filename: string;
  contentType: string;
  size: number;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByRole: 'mentor' | 'mentee'; 
  createdAt: Date;
}

const fileAttachmentSchema: Schema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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

const FileAttachment = mongoose.model<IFileAttachment>("FileAttachment", fileAttachmentSchema);

export default FileAttachment;
