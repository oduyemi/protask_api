import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import twilio from "twilio";
import Task, { ITask } from "../models/taskModel.js";
import mongoose, { Schema, Document } from "mongoose";
import TaskAssignment, { ITaskAssignment } from "../models/taskAssignmentModel.js";
import TaskCategory, { ITaskCategory } from "../models/taskCategoryModel.js";
import TaskComment, { ITaskComment } from "../models/taskCommentModel.js";
import AuditLog, { IAuditLog } from "../models/auditLogModel.js";
import Project, { IProject } from "../models/projectModel.js";
import FileAttachment, { IFileAttachment } from "../models/fileAttachmentModel.js";
import Mentee, { IMentee } from "../models/menteeModel.js";
import MenteeRequest, { IMenteeRequest } from "../models/menteeRequestModel.js";
import Mentor, { IMentor } from "../models/mentorModel.js";
import MentorRequest, { IMentorRequest } from "../models/mentorRequestModel.js";

const router = express.Router();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  

require("dotenv").config();

interface MenteeSession {
    menteeID: mongoose.Types.ObjectId; 
    fname: string;
    lname: string;
    email: string;
    phone: string;
    subscription?: mongoose.Types.ObjectId;
  }
  
  interface RegistrationPinSession {
    pin: string;
    expiryTime: number;
  }

  interface MentorSession {
    mentorID: mongoose.Types.ObjectId;
    fname: string;
    lname: string;
    email: string;
    phone: string;
  }

  declare module "express-session" {
    interface SessionData {
      mentee?: MenteeSession; 
      mentor?: MentorSession;
      registrationPin?: RegistrationPinSession;
    }
  }
  
  const PIN_EXPIRY_TIME = 10 * 60 * 1000;

const sendSMSVerification = async (pin: string, phoneNumber: string) => {
    try {
        await client.messages.create({
            body: `Your registration PIN is: ${pin}`,
            to: phoneNumber,
            from: "+12052361255",
        });
        return true;
    } catch (error) {
        console.error("Error sending SMS verification:", error);
        return false;
    }
};

router.post("/sms-status", async (req: Request, res: Response) => {
    const { MessageStatus, MessageSid } = req.body;
    console.log(`Message SID: ${MessageSid}, Status: ${MessageStatus}`);
    res.sendStatus(200);
});


router.post("/task-assignment", async (req: Request, res: Response) => {
    try {
        const { taskId, menteeId, mentorId } = req.body;
        const mentorExists = await Mentor.exists({ _id: mentorId });
        if (!mentorExists) {
            return res.status(400).json({ message: "Mentor does not exist" });
        }

        const menteeExists = await Mentee.exists({ _id: menteeId, mentor: mentorId });
        if (!menteeExists) {
            return res.status(400).json({ message: "Mentee does not exist or is not mentored by the provided mentor" });
        }

        const taskExists = await Task.exists({ _id: taskId });
        if (!taskExists) {
            return res.status(400).json({ message: "Task does not exist" });
        }

        const taskAssignment = new TaskAssignment({
            taskId,
            menteeId,
            mentorId,
            assignedAt: new Date()
        });
        await taskAssignment.save();

        return res.status(200).json({ message: "Task assigned successfully to the mentee" });
    } catch (error) {
        console.error("Error assigning task:", error);
        return res.status(500).json({ message: "Error assigning task" });
    }
});

    //   M   E   N   T   E   E   S

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, phone, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, password, confirmPassword].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingMentee = await Mentee.findOne({ email });
        if (existingMentee) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const newMentee = new Mentee({ fname, lname, email, phone, password: hashedPassword });
        await newMentee.save();

        // Access token
        const token = jwt.sign(
            {
                menteeID: newMentee._id,
                email: newMentee.email
            },
            process.env.JWT_SECRET!,
        );

        // Mentee session
        const menteeSession = {
            menteeID: newMentee._id,
            fname,
            lname,
            email,
            phone
        };
        req.session.mentee = menteeSession;

        return res.status(201).json({
            message: "Mentee registered successfully.",
            token,
            nextStep: "/next-login-page",
        });
    } catch (error) {
        console.error("Error during mentee registration:", error);
        return res.status(500).json({ message: "Error registering mentee" });
    }
});

   
  
router.post("/login", async (req: Request, res: Response) => {
try {
    const { email, password } = req.body;
    if (![email, password].every((field) => field)) {
    return res.status(400).json({ message: "All fields are required" });
    }

    try {
    const mentee = await Mentee.findOne({ email });
    if (!mentee) {
        return res
        .status(401)
        .json({ message: "Email not registered. Please register first." });
    }

    const isPasswordMatch = await compare(password, mentee.password);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Incorrect email or password" });
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneNumber = mentee.email;
    req.session.registrationPin = {
        pin,
        expiryTime: Date.now() + PIN_EXPIRY_TIME,
    };

    const smsSent = await sendSMSVerification(pin, phoneNumber);
    if (!smsSent) {
        return res.status(500).json({ message: "Error sending registration PIN" });
    }

    // Access token
    const token = jwt.sign(
        {
            menteeID: mentee._id,
            email: mentee.email
        },
        process.env.JWT_SECRET || "default_secret",
    );

    const menteeSession = {
        menteeID: mentee._id,
        fname: mentee.fname,
        lname: mentee.lname,
        email: mentee.email,
        phone: mentee.phone,
    };

    req.session.mentee = menteeSession;

    return res.status(201).json({
        message: "Mentee login successful. PIN sent via SMS.",
        pin,
        nextStep: "/next-mentee-dashboard",
    });
    } catch (error) {
    console.error("Error during mentee login:", error);
    return res.status(500).json({ message: "Error logging in mentee" });
    }
} catch (error) {
    console.error("Error during mentee login:", error);
    return res.status(500).json({ message: "Error logging in mentee" });
}
});

router.post("/mentees/choose-mentor", async (req: Request, res: Response) => {
    try {
        const { menteeId, mentorId, taskCategoryId } = req.body;
        const mentorRequest = new MentorRequest({
            menteeId,
            mentorId,
            taskCategoryId,
            status: "pending" // Mentee requests mentor's approval
        });
        await mentorRequest.save();

        return res.status(200).json({ message: "Mentor request sent successfully" });
    } catch (error) {
        console.error("Error sending mentor request:", error);
        return res.status(500).json({ message: "Error sending mentor request" });
    }
});


router.post("/tasks", async (req: Request, res: Response) => {
    try {
        const { name, description, category } = req.body;
        if (![name, description, category].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingCategory = await TaskCategory.findOne({ name: category });
        if (!existingCategory) {
            return res.status(400).json({ message: "Invalid task category" });
        }

        // New task
        const newTask = new Task({ name, description, category: existingCategory._id });
        await newTask.save();

        return res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Error creating task" });
    }
});


router.post("/task-categories", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name field is required" });
        }

        const existingCategory = await TaskCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Task category already exists" });
        }

        // New category
        const newCategory = new TaskCategory({ name });
        await newCategory.save();

        return res.status(201).json({ message: "Task category created successfully", category: newCategory });
    } catch (error) {
        console.error("Error creating task category:", error);
        return res.status(500).json({ message: "Error creating task category" });
    }
});


router.post("/mentees/audit-logs", async (req: Request, res: Response) => {
    try {
        const { menteeID, action, entity, entityId } = req.body;
        const auditLog = new AuditLog({
            action,
            entity,
            entityId,
            performedBy: menteeID,
            performedByRole: 'mentee',
            createdAt: new Date()
        });
        await auditLog.save();

        return res.status(200).json({ message: "Audit logs for mentees created successfully" });
    } catch (error) {
        console.error("Error creating audit logs for mentees:", error);
        return res.status(500).json({ message: "Error creating audit logs for mentees" });
    }
});


router.post("/mentees/file-attachment", async (req: Request, res: Response) => {
    try {
        const { filename, contentType, size, path, uploadedBy } = req.body;
        const fileAttachment = new FileAttachment({
            filename,
            contentType,
            size,
            path,
            uploadedBy,
            uploadedByRole: 'mentee',
            createdAt: new Date()
        });
        await fileAttachment.save();

        return res.status(200).json({ message: "File attachment for mentees uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file attachment for mentees:", error);
        return res.status(500).json({ message: "Error uploading file attachment for mentees" });
    }
});



    
router.post("/logout", (req, res) => {
    try {
        // Pop mentee session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying mentee session:", err);
                return res.status(500).json({ message: "Error logging out mentee" });
            }
            return res.status(200).json({ message: "Mentee logged out successfully" });
        });
    } catch (error) {
        console.error("Error logging out mentee:", error);
        return res.status(500).json({ message: "Error logging out mentee" });
    }
});



    //   M   E   N   T   O   R   S

router.post("/mentors/register", async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, phone, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, password, confirmPassword].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingMentor = await Mentor.findOne({ email });
        if (existingMentor) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const newMentor = new Mentor({ fname, lname, email, phone, password: hashedPassword });
        await newMentor.save();

        // Generate and send PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const phoneNumber = phone;
        const smsSent = await sendSMSVerification(pin, phoneNumber);

        if (!smsSent) {
            return res.status(500).json({ message: "Error sending registration PIN" });
        }

        // Access token
        const token = jwt.sign(
            {
                mentorID: newMentor._id,
                email: newMentor.email
            },
            process.env.JWT_SECRET || "default_secret",
        );

        // Mentor session
        const mentorSession = {
            mentorID: newMentor._id,
            fname,
            lname,
            email,
            phone
        };
        req.session.mentor = mentorSession;

        return res.status(201).json({
            message: "Mentor registered successfully. PIN sent via SMS.",
            nextStep: "/next-login-page",
        });
    } catch (error) {
        console.error("Error during Mentor registration:", error);
        return res.status(500).json({ message: "Error registering Mentor" });
    }
});


router.post("/mentors/login", async (req: Request, res: Response) => {
try {
    const { email, password } = req.body;
    if (![email, password].every((field) => field)) {
    return res.status(400).json({ message: "All fields are required" });
    }

    try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
        return res
        .status(401)
        .json({ message: "Email not registered. Please register first." });
    }

    const isPasswordMatch = await compare(password, mentor.password);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Incorrect email or password" });
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneNumber = mentor.email;
    req.session.registrationPin = {
        pin,
        expiryTime: Date.now() + PIN_EXPIRY_TIME,
    };

    const smsSent = await sendSMSVerification(pin, phoneNumber);
    if (!smsSent) {
        return res.status(500).json({ message: "Error sending registration PIN" });
    }

    // Access token
    const token = jwt.sign(
        {
            mentorID: mentor._id,
            email: mentor.email
        },
        process.env.JWT_SECRET || "default_secret",
    );        
    const mentorSession = {
        mentorID: mentor._id,
        fname: mentor.fname,
        lname: mentor.lname,
        email: mentor.email,
        phone: mentor.phone,
    };

    req.session.mentor = mentorSession;

    return res.status(201).json({
        message: "Mentor login successful. PIN sent via SMS.",
        pin,
        nextStep: "/next-mentor-dashboard",
    });
    } catch (error) {
    console.error("Error during mentor login:", error);
    return res.status(500).json({ message: "Error logging in mentor" });
    }
} catch (error) {
    console.error("Error during mentor login:", error);
    return res.status(500).json({ message: "Error logging in mentor" });
}
});

router.post("/mentors/respond-to-mentee-request", async (req: Request, res: Response) => {
    try {
        const { requestId, status } = req.body;
        const mentorRequest = await MentorRequest.findById(requestId);
        if (!mentorRequest) {
            return res.status(404).json({ message: "Mentor request not found" });
        }

        mentorRequest.status = status;
        await mentorRequest.save();

        return res.status(200).json({ message: "Mentee request responded successfully" });
    } catch (error) {
        console.error("Error responding to mentee request:", error);
        return res.status(500).json({ message: "Error responding to mentee request" });
    }
});


router.post("/mentors/audit-logs", async (req: Request, res: Response) => {
    try {
        const { mentorID, action, entity, entityId } = req.body;
        const auditLog = new AuditLog({
            action,
            entity,
            entityId,
            performedBy: mentorID,
            performedByRole: 'mentor',
            createdAt: new Date()
        });
        await auditLog.save();

        return res.status(200).json({ message: "Audit logs for mentors created successfully" });
    } catch (error) {
        console.error("Error creating audit logs for mentors:", error);
        return res.status(500).json({ message: "Error creating audit logs for mentors" });
    }
});

router.post("/mentors/file-attachment", async (req: Request, res: Response) => {
    try {
        const { filename, contentType, size, path, uploadedBy } = req.body;
        const fileAttachment = new FileAttachment({
            filename,
            contentType,
            size,
            path,
            uploadedBy,
            uploadedByRole: 'mentor',
            createdAt: new Date()
        });
        await fileAttachment.save();

        return res.status(200).json({ message: "File attachment for mentors uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file attachment for mentors:", error);
        return res.status(500).json({ message: "Error uploading file attachment for mentors" });
    }
});

router.post("/admin/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying admin session:", err);
                return res.status(500).json({ message: "Error logging out admin" });
            }
            return res.status(200).json({ message: "Admin logged out successfully" });
        });
    } catch (error) {
        console.error("Error logging out admin:", error);
        return res.status(500).json({ message: "Error logging out admin" });
    }
});

















export default router;