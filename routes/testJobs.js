const express = require("express");
const { Queue, Worker } = require("bullmq");
const Redis = require("ioredis");
const router = express.Router();

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define the queue with a Redis connection
const testJobQueue = new Queue("KyberVisionTestJob03", {
  connection: redisConnection,
});

// Create a worker to process jobs from the queue
const worker = new Worker(
  "KyberVisionTestJob03",
  async (job) => {
    console.log(`⚙️ Starting Job ID: ${job.id}`);

    const steps = [
      { message: "📥 video received", delay: 3000 },
      { message: "📋 verify video meta data", delay: 3000 },
      { message: "🎥 process video", delay: 3000 },
      { message: "💾 saving new video", delay: 3000 },
      {
        message: "📡 sending API notice that video processing is completed",
        delay: 3000,
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(step.message);

      // Log progress to BullMQ
      await job.updateProgress(Math.floor(((i + 1) / steps.length) * 100));
      await job.log(step.message);

      // Delay between steps
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    console.log(`✅ Completed Job ID: ${job.id}`);
    return { success: true };
  },
  {
    connection: redisConnection,
    // concurrency: 1, // This ensures jobs are processed one at a time
    concurrency: 2, // This ensures jobs are processed one at a time
  }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} has been completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});

// Route for adding jobs to the queue
router.post("/add", async (req, res) => {
  try {
    const job = await testJobQueue.add("test-job", {
      videoPath: "dummy/path/to/video.mp4",
    });

    console.log(`🌟 Job added to the queue with ID: ${job.id}`);

    res
      .status(200)
      .json({ message: "Job triggered successfully!", jobId: job.id });
  } catch (error) {
    console.error("❌ Error triggering job:", error.message);
    res.status(500).json({ error: "Error triggering job" });
  }
});

module.exports = router;
