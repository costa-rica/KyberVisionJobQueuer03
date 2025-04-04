var express = require("express");
var router = express.Router();
const { Queue } = require("bullmq");
const Redis = require("ioredis");

const redisConnection = new Redis();
const videoUploadQueue = new Queue("KyberVisionVideoUploader03", {
  connection: redisConnection,
});

router.post("/add", async (req, res) => {
  const job = await videoUploadQueue.add("videoUpload", req.body);
  res.json({ message: "Video upload job added", jobId: job.id });
});

module.exports = router;
