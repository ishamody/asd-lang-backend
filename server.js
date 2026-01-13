import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { uploadToDrive } from "./drive.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST"]
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

// THIS IS THE ONLY UPLOAD ENDPOINT
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file received");
  }

  const { participant, task, trial, stimulus, filename } = req.body;

  if (!participant || !task || !trial || !filename) {
    console.error("Missing metadata:", req.body);
    return res.status(400).send("Missing metadata");
  }

  try {
    await uploadToDrive(req.file, req.body);
    res.send("OK");
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).send("Drive upload failed");
  }
});


// sanity check
app.get("/ping", (_, res) => res.send("pong"));

app.get("/", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
