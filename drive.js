import { google } from "googleapis";
import stream from "stream";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToDrive(file, meta) {
  const { filename } = meta;

  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  await drive.files.create({
    requestBody: {
      name: filename,
      parents: [process.env.DRIVE_FOLDER_ID]
    },
    media: {
      mimeType: file.mimetype,
      body: bufferStream
    }
  });
}
