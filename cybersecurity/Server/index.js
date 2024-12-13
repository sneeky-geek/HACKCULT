const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { z } = require("zod");
const clientModel = require("./models/Client");


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

mongoose.connect(process.env.DB_SIGN)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    if (await clientModel.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new clientModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: { name, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await clientModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to your dashboard", user: req.user });
});

app.post("/upload", upload.single('file'), async (req, res) => {
  try {
    const fileData = JSON.parse(req.file.buffer.toString('utf8'));
    await financialModel.insertMany(fileData);
    res.status(200).send({ message: 'Data uploaded successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to process file' });
  }
});

app.get("/retrieve", async (req, res) => {
  try {
    const records = await financialModel.find({}, { accountId: 1, accountHolderName: 1, _id: 0 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve data' });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
