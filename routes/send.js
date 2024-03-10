"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const twilio_1 = __importDefault(require("twilio"));
const taskModel_js_1 = __importDefault(require("../models/taskModel.js"));
const taskAssignmentModel_js_1 = __importDefault(require("../models/taskAssignmentModel.js"));
const taskCategoryModel_js_1 = __importDefault(require("../models/taskCategoryModel.js"));
const auditLogModel_js_1 = __importDefault(require("../models/auditLogModel.js"));
const fileAttachmentModel_js_1 = __importDefault(require("../models/fileAttachmentModel.js"));
const menteeModel_js_1 = __importDefault(require("../models/menteeModel.js"));
const mentorModel_js_1 = __importDefault(require("../models/mentorModel.js"));
const mentorRequestModel_js_1 = __importDefault(require("../models/mentorRequestModel.js"));
const router = express_1.default.Router();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
require("dotenv").config();
const PIN_EXPIRY_TIME = 10 * 60 * 1000;
const sendSMSVerification = (pin, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.messages.create({
            body: `Your registration PIN is: ${pin}`,
            to: phoneNumber,
            from: "+12052361255",
        });
        return true;
    }
    catch (error) {
        console.error("Error sending SMS verification:", error);
        return false;
    }
});
router.post("/sms-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { MessageStatus, MessageSid } = req.body;
    console.log(`Message SID: ${MessageSid}, Status: ${MessageStatus}`);
    res.sendStatus(200);
}));
router.post("/task-assignment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, menteeId, mentorId } = req.body;
        const mentorExists = yield mentorModel_js_1.default.exists({ _id: mentorId });
        if (!mentorExists) {
            return res.status(400).json({ message: "Mentor does not exist" });
        }
        const menteeExists = yield menteeModel_js_1.default.exists({ _id: menteeId, mentor: mentorId });
        if (!menteeExists) {
            return res.status(400).json({ message: "Mentee does not exist or is not mentored by the provided mentor" });
        }
        const taskExists = yield taskModel_js_1.default.exists({ _id: taskId });
        if (!taskExists) {
            return res.status(400).json({ message: "Task does not exist" });
        }
        const taskAssignment = new taskAssignmentModel_js_1.default({
            taskId,
            menteeId,
            mentorId,
            assignedAt: new Date()
        });
        yield taskAssignment.save();
        return res.status(200).json({ message: "Task assigned successfully to the mentee" });
    }
    catch (error) {
        console.error("Error assigning task:", error);
        return res.status(500).json({ message: "Error assigning task" });
    }
}));
//   M   E   N   T   E   E   S
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, password, confirmPassword].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingMentee = yield menteeModel_js_1.default.findOne({ email });
        if (existingMentee) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newMentee = new menteeModel_js_1.default({ fname, lname, email, phone, password: hashedPassword });
        yield newMentee.save();
        // Access token
        const token = jsonwebtoken_1.default.sign({
            menteeID: newMentee._id,
            email: newMentee.email
        }, process.env.JWT_SECRET);
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
    }
    catch (error) {
        console.error("Error during mentee registration:", error);
        return res.status(500).json({ message: "Error registering mentee" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (![email, password].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        try {
            const mentee = yield menteeModel_js_1.default.findOne({ email });
            if (!mentee) {
                return res
                    .status(401)
                    .json({ message: "Email not registered. Please register first." });
            }
            const isPasswordMatch = yield (0, bcrypt_1.compare)(password, mentee.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
            const pin = Math.floor(1000 + Math.random() * 9000).toString();
            const phoneNumber = mentee.email;
            req.session.registrationPin = {
                pin,
                expiryTime: Date.now() + PIN_EXPIRY_TIME,
            };
            const smsSent = yield sendSMSVerification(pin, phoneNumber);
            if (!smsSent) {
                return res.status(500).json({ message: "Error sending registration PIN" });
            }
            // Access token
            const token = jsonwebtoken_1.default.sign({
                menteeID: mentee._id,
                email: mentee.email
            }, process.env.JWT_SECRET || "default_secret");
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
        }
        catch (error) {
            console.error("Error during mentee login:", error);
            return res.status(500).json({ message: "Error logging in mentee" });
        }
    }
    catch (error) {
        console.error("Error during mentee login:", error);
        return res.status(500).json({ message: "Error logging in mentee" });
    }
}));
router.post("/mentees/choose-mentor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menteeId, mentorId, taskCategoryId } = req.body;
        const mentorRequest = new mentorRequestModel_js_1.default({
            menteeId,
            mentorId,
            taskCategoryId,
            status: "pending" // Mentee requests mentor's approval
        });
        yield mentorRequest.save();
        return res.status(200).json({ message: "Mentor request sent successfully" });
    }
    catch (error) {
        console.error("Error sending mentor request:", error);
        return res.status(500).json({ message: "Error sending mentor request" });
    }
}));
router.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category } = req.body;
        if (![name, description, category].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingCategory = yield taskCategoryModel_js_1.default.findOne({ name: category });
        if (!existingCategory) {
            return res.status(400).json({ message: "Invalid task category" });
        }
        // New task
        const newTask = new taskModel_js_1.default({ name, description, category: existingCategory._id });
        yield newTask.save();
        return res.status(201).json({ message: "Task created successfully", task: newTask });
    }
    catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Error creating task" });
    }
}));
router.post("/task-categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name field is required" });
        }
        const existingCategory = yield taskCategoryModel_js_1.default.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Task category already exists" });
        }
        // New category
        const newCategory = new taskCategoryModel_js_1.default({ name });
        yield newCategory.save();
        return res.status(201).json({ message: "Task category created successfully", category: newCategory });
    }
    catch (error) {
        console.error("Error creating task category:", error);
        return res.status(500).json({ message: "Error creating task category" });
    }
}));
router.post("/mentees/audit-logs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menteeID, action, entity, entityId } = req.body;
        const auditLog = new auditLogModel_js_1.default({
            action,
            entity,
            entityId,
            performedBy: menteeID,
            performedByRole: 'mentee',
            createdAt: new Date()
        });
        yield auditLog.save();
        return res.status(200).json({ message: "Audit logs for mentees created successfully" });
    }
    catch (error) {
        console.error("Error creating audit logs for mentees:", error);
        return res.status(500).json({ message: "Error creating audit logs for mentees" });
    }
}));
router.post("/mentees/file-attachment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contentType, size, path, uploadedBy } = req.body;
        const fileAttachment = new fileAttachmentModel_js_1.default({
            filename,
            contentType,
            size,
            path,
            uploadedBy,
            uploadedByRole: 'mentee',
            createdAt: new Date()
        });
        yield fileAttachment.save();
        return res.status(200).json({ message: "File attachment for mentees uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading file attachment for mentees:", error);
        return res.status(500).json({ message: "Error uploading file attachment for mentees" });
    }
}));
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
    }
    catch (error) {
        console.error("Error logging out mentee:", error);
        return res.status(500).json({ message: "Error logging out mentee" });
    }
});
//   M   E   N   T   O   R   S
router.post("/mentors/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, password, confirmPassword].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingMentor = yield mentorModel_js_1.default.findOne({ email });
        if (existingMentor) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newMentor = new mentorModel_js_1.default({ fname, lname, email, phone, password: hashedPassword });
        yield newMentor.save();
        // Generate and send PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const phoneNumber = phone;
        const smsSent = yield sendSMSVerification(pin, phoneNumber);
        if (!smsSent) {
            return res.status(500).json({ message: "Error sending registration PIN" });
        }
        // Access token
        const token = jsonwebtoken_1.default.sign({
            mentorID: newMentor._id,
            email: newMentor.email
        }, process.env.JWT_SECRET || "default_secret");
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
    }
    catch (error) {
        console.error("Error during Mentor registration:", error);
        return res.status(500).json({ message: "Error registering Mentor" });
    }
}));
router.post("/mentors/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (![email, password].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        try {
            const mentor = yield mentorModel_js_1.default.findOne({ email });
            if (!mentor) {
                return res
                    .status(401)
                    .json({ message: "Email not registered. Please register first." });
            }
            const isPasswordMatch = yield (0, bcrypt_1.compare)(password, mentor.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
            const pin = Math.floor(1000 + Math.random() * 9000).toString();
            const phoneNumber = mentor.email;
            req.session.registrationPin = {
                pin,
                expiryTime: Date.now() + PIN_EXPIRY_TIME,
            };
            const smsSent = yield sendSMSVerification(pin, phoneNumber);
            if (!smsSent) {
                return res.status(500).json({ message: "Error sending registration PIN" });
            }
            // Access token
            const token = jsonwebtoken_1.default.sign({
                mentorID: mentor._id,
                email: mentor.email
            }, process.env.JWT_SECRET || "default_secret");
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
        }
        catch (error) {
            console.error("Error during mentor login:", error);
            return res.status(500).json({ message: "Error logging in mentor" });
        }
    }
    catch (error) {
        console.error("Error during mentor login:", error);
        return res.status(500).json({ message: "Error logging in mentor" });
    }
}));
router.post("/mentors/respond-to-mentee-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, status } = req.body;
        const mentorRequest = yield mentorRequestModel_js_1.default.findById(requestId);
        if (!mentorRequest) {
            return res.status(404).json({ message: "Mentor request not found" });
        }
        mentorRequest.status = status;
        yield mentorRequest.save();
        return res.status(200).json({ message: "Mentee request responded successfully" });
    }
    catch (error) {
        console.error("Error responding to mentee request:", error);
        return res.status(500).json({ message: "Error responding to mentee request" });
    }
}));
router.post("/mentors/audit-logs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mentorID, action, entity, entityId } = req.body;
        const auditLog = new auditLogModel_js_1.default({
            action,
            entity,
            entityId,
            performedBy: mentorID,
            performedByRole: 'mentor',
            createdAt: new Date()
        });
        yield auditLog.save();
        return res.status(200).json({ message: "Audit logs for mentors created successfully" });
    }
    catch (error) {
        console.error("Error creating audit logs for mentors:", error);
        return res.status(500).json({ message: "Error creating audit logs for mentors" });
    }
}));
router.post("/mentors/file-attachment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contentType, size, path, uploadedBy } = req.body;
        const fileAttachment = new fileAttachmentModel_js_1.default({
            filename,
            contentType,
            size,
            path,
            uploadedBy,
            uploadedByRole: 'mentor',
            createdAt: new Date()
        });
        yield fileAttachment.save();
        return res.status(200).json({ message: "File attachment for mentors uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading file attachment for mentors:", error);
        return res.status(500).json({ message: "Error uploading file attachment for mentors" });
    }
}));
router.post("/admin/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying admin session:", err);
                return res.status(500).json({ message: "Error logging out admin" });
            }
            return res.status(200).json({ message: "Admin logged out successfully" });
        });
    }
    catch (error) {
        console.error("Error logging out admin:", error);
        return res.status(500).json({ message: "Error logging out admin" });
    }
});
exports.default = router;
