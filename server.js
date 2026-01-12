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

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file");
    }

    await uploadToDrive(req.file, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
