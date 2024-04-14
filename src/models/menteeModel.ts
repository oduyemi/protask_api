import mongoose, { Schema, Document } from "mongoose";

export interface IMentee extends Document {
  menteeId: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const menteeSchema: Schema = new mongoose.Schema({
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
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email format",
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (phone: string) => {
        return /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone);
      },
      message: "Invalid phone number format",
    },
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now
  }  
});

const Mentee = mongoose.model<IMentee>("Mentee", menteeSchema);

export default Mentee;