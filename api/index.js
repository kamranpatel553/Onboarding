import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "viiibits-super-secret-jwt-key-2024";
const MONGO_URI = process.env.MONGO_URI || "";
const ALLOWED_DOMAIN = "@viiibits.com";

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const AllowedEmail = mongoose.models.AllowedEmail || mongoose.model("AllowedEmail", new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  addedAt: { type: Date, default: Date.now },
}));

const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
}));

const Progress = mongoose.models.Progress || mongoose.model("Progress", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  roadmaps: { type: Map, of: Object, default: {} },
  updatedAt: { type: Date, default: Date.now },
}));

async function seedAdmin() {
  const existing = await User.findOne({ role: "admin" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin@123", 10);
    await User.create({ name: "Admin", email: "admin@viiibits.com", password: hashed, role: "admin" });
  }
}

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    await seedAdmin();
    next();
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database connection failed." });
  }
});

const authenticate = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  try { req.user = jwt.verify(h.split(" ")[1], JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: "Invalid or expired token" }); }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required." });
    const e = email.toLowerCase().trim();
    if (!e.endsWith(ALLOWED_DOMAIN)) return res.status(400).json({ message: `Only ${ALLOWED_DOMAIN} emails allowed.` });
    const isAllowed = await AllowedEmail.findOne({ email: e });
    if (!isAllowed) return res.status(403).json({ message: "Your email is not authorized. Contact admin." });
    const exists = await User.findOne({ email: e });
    if (exists) return res.status(409).json({ message: "Account already exists." });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: e, password: hashed, role: "user" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Internal server error." }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required." });
    const e = email.toLowerCase().trim();
    if (!e.endsWith(ALLOWED_DOMAIN)) return res.status(400).json({ message: `Only ${ALLOWED_DOMAIN} emails allowed.` });
    const user = await User.findOne({ email: e });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Internal server error." }); }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.get("/api/progress", authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) return res.json({});
    const result = {};
    progress.roadmaps.forEach((value, key) => { result[key] = value; });
    return res.json(result);
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.post("/api/progress", authenticate, async (req, res) => {
  try {
    const { roadmap, checkedSteps } = req.body;
    if (!roadmap || checkedSteps === undefined) return res.status(400).json({ message: "roadmap and checkedSteps required." });
    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { [`roadmaps.${roadmap}`]: checkedSteps, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.get("/api/admin/allowed-emails", authenticate, requireAdmin, async (req, res) => {
  try {
    const emails = await AllowedEmail.find().sort({ addedAt: -1 });
    return res.json(emails.map(e => ({ id: e._id, email: e.email, addedAt: e.addedAt })));
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.post("/api/admin/allowed-emails", authenticate, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required." });
    const e = email.toLowerCase().trim();
    if (!e.endsWith(ALLOWED_DOMAIN)) return res.status(400).json({ message: `Only ${ALLOWED_DOMAIN} emails.` });
    const existing = await AllowedEmail.findOne({ email: e });
    if (existing) return res.status(409).json({ message: "Already in allowed list." });
    await AllowedEmail.create({ email: e });
    return res.status(201).json({ success: true });
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.delete("/api/admin/allowed-emails/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await AllowedEmail.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Email not found." });
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

app.get("/api/admin/users", authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    const usersWithProgress = await Promise.all(users.map(async (u) => {
      const progress = await Progress.findOne({ userId: u._id });
      const progressData = {};
      if (progress) { progress.roadmaps.forEach((value, key) => { progressData[key] = value; }); }
      return { id: u._id, name: u.name, email: u.email, createdAt: u.createdAt, progress: progressData };
    }));
    return res.json(usersWithProgress);
  } catch (err) { return res.status(500).json({ message: "Internal server error." }); }
});

export default app;
