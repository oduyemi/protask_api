import mongoose, { Schema, Document } from "mongoose";

export interface IMentor extends Document {
  mentor_id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string; 
  createdAt: Date;
  updatedAt: Date;
  salt: string;
}

const mentorSchema: Schema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date, default: Date.now 
  },
  updatedAt: { 
    type: Date, default: Date.now
  }  
  });

const Mentor = mongoose.model<IMentor>("Mentor", mentorSchema);


export default Mentor;