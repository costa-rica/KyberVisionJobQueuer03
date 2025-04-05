# KyberVision Job Queuer (KyberVisionJobQueuer03)

## Description

KyberVisionJobQueuer03 is an ExpressJS application designed to manage and monitor jobs using BullMQ and Bull Board. It serves as a centralized job queue manager for various microservices in the Kyber Vision ecosystem.

The application is designed to:

- Trigger jobs for connected microservices (e.g., KyberVisionTestJob03, KyberVisionVideoUpload03, KyberVisionMontageVideoProcessor03).
- Monitor job progress and logs through a Bull Board dashboard available at `/dashboard`.
- Ensure sequential processing of jobs to maintain order and efficiency.

---

## Features

- 📊 **BullMQ Integration**: Queue management powered by Redis and BullMQ.
- 📋 **Bull Board Dashboard**: Provides a visual interface to monitor queues and inspect job logs.
- 🔒 **Sequential Job Processing**: Ensures jobs are processed one at a time when necessary.
- 🔗 **Microservice Integration**: Communicates with various microservices via queues.

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies using Yarn:

```bash
yarn install
```

3. Set up your `.env` file with Redis configuration:

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=8003
APP_NAME=KyberVisionJobQueuer03
PATH_TO_TEST_JOB_SERVICE=/Users/nick/Documents/KyberVisionTestJob03/
```

---

## Redis Commands (Mac & Ubuntu)

### Delete queue from terminal (Mac)

- Delete All Data: `redis-cli FLUSHALL`
- Delete Specific Database: `redis-cli -n 0 FLUSHDB`
- Delete Specific Queue: `redis-cli --raw keys "*KyberVisionVideoUploader03*" | xargs redis-cli del`

### 📌 **Starting Redis in the Background**

#### MacOS (using Homebrew)

```bash
brew services start redis
```

#### Ubuntu (using systemd)

```bash
sudo systemctl start redis
```

---

### 📌 **Checking Redis Status**

```bash
redis-cli ping
```

#### MacOS (using Homebrew)

```bash
brew services list | grep redis
```

#### Ubuntu (using systemd)

```bash
sudo systemctl status redis
```

---

### 📌 **Stopping Redis**

#### MacOS (using Homebrew)

```bash
brew services stop redis
```

#### Ubuntu (using systemd)

```bash
sudo systemctl stop redis
```

---

### 📌 **Restarting Redis (If Needed)**

#### MacOS (using Homebrew)

```bash
brew services restart redis
```

#### Ubuntu (using systemd)

```bash
sudo systemctl restart redis
```

---

These commands will help you manage the Redis server on both Mac and Ubuntu systems.

---

## Usage

1. **Start Redis Server**:

```bash
redis-server
```

2. **Start KyberVisionJobQueuer03 Server**:

```bash
yarn start
```

3. **Access Bull Board Dashboard**:

```
http://localhost:8003/dashboard
```

4. **Trigger a Job via API** (Example for Test Jobs):

```bash
curl -X POST http://localhost:8003/test-jobs/add
```

```bash
curl -X POST http://localhost:8003/video-uploader/process \
--header "Content-Type: application/json" \
--data '{"filename": "Video01_trimmed.mp4"}'
```

---

## Routes

- **`POST /test-jobs/add`** - Adds a new test job to the queue.
- **`GET /dashboard`** - Access the Bull Board dashboard to monitor job queues.

---

## Dependencies

- `express` - For handling routes and middleware.
- `bullmq` - For managing job queues.
- `@bull-board/express` - For creating a visual interface for monitoring queues.
- `ioredis` - For connecting to Redis.

---

## Understanding the code for child process

```js
const child = spawn("node", ["index.js"], {
  cwd: path.join(process.env.PATH_TO_TEST_JOB_SERVICE),
  stdio: ["pipe", "pipe", "pipe"], // Make sure to capture stdout and stderr
});
```

It is an array of three elements: [stdin, stdout, stderr].

- "pipe": This allows the parent process to directly communicate with the child process via streams. By using "pipe", you are telling Node.js:
  - "pipe" for stdin: The parent process can send data to the child process.
  - "pipe" for stdout: The parent process can read the standard output of the child process.
  - "pipe" for stderr: The parent process can read the standard error output of the child process.

## License

MIT License
