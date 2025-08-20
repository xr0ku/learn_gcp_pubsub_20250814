import dotenv from "dotenv";
import path from "path";
import express from "express";
import { PubSub } from "@google-cloud/pubsub";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

const projectId = process.env.GOOGLE_PROJECT_ID;
if (!projectId) {
  throw new Error("project is not found.");
}

const pubsub = new PubSub({
  projectId,
});

const topicName = process.env.PUBSUB_TOPIC_NAME;
if (!topicName) {
  throw new Error("pubsub topic name is not found.");
}

app.post("/publish", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(404).json({ error: "message is required" });

  console.log({
    topicName,
    projectId,
  });

  try {
    const dataBuffer = Buffer.from(JSON.stringify({ message }));
    const messageId = await pubsub.topic(topicName).publish(dataBuffer);
    res.status(200).json({ message: "Published", messageId });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({ error: "Failed to publish message" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 App is listening on http://localhost:${PORT}`);
});
