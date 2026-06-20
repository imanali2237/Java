# BullMQ Learning Roadmap

> Prerequisite check: You already know Redis basics and have implemented JWT sessions with Redis. That's a solid foundation — BullMQ is built directly on top of Redis, so you already understand the engine underneath it.

---

## Phase 1: Foundations (Topics 1–5)

### 1. What is a Job Queue and Why Use One
- Understand the producer-consumer pattern
- Synchronous vs asynchronous task execution
- Real-world use cases: sending emails, processing uploads, generating reports, sending notifications, payment retries
- Why NestJS + BullMQ is a common combo (you already work with NestJS daily, so this will click fast)

### 2. BullMQ Core Concepts
- Queue, Worker, Job — the three pillars
- How BullMQ stores everything in Redis (sorted sets, hashes, lists under the hood)
- Difference between BullMQ and old Bull (v3) — BullMQ is the modern, actively maintained version

### 3. Setting Up Your First Queue
- Installing `bullmq` and connecting to Redis
- Creating a `Queue` instance
- Adding jobs with `queue.add(name, data, options)`
- Inspecting jobs in Redis using `redis-cli` (apply your Redis basics here)

### 4. Setting Up Your First Worker
- Creating a `Worker` instance
- Processing function basics
- Concurrency option (`concurrency: n`)
- Difference between Queue process (old Bull) vs separate Worker process (BullMQ)

### 5. Job Lifecycle & States
- `waiting → active → completed/failed`
- `delayed`, `paused`, `stalled` states
- Listening to events: `completed`, `failed`, `progress`, `stalled`
- Using `QueueEvents` class for monitoring

---

## Phase 2: Core Job Management (Topics 6–10)

### 6. Job Options
- `delay` — scheduling jobs for later
- `attempts` and `backoff` — retry strategies (fixed vs exponential)
- `priority` — job priority queues
- `removeOnComplete` / `removeOnFail` — cleanup strategy
- `jobId` — custom job IDs for deduplication

### 7. Repeatable Jobs (Cron-like Jobs)
- `repeat` option with cron patterns
- Use cases: daily reports, subscription renewal checks, cleanup jobs
- This connects directly to your Stripe subscription work — think recurring invoice checks

### 8. Job Progress & Data Updates
- `job.updateProgress()`
- `job.update()` to change job data mid-flight
- Returning job results via `job.returnvalue`

### 9. Error Handling & Retries
- Throwing errors inside processors
- `attempts` + `backoff` deep dive (fixed, exponential, custom backoff strategies)
- Dead letter queue pattern — handling permanently failed jobs
- Idempotency in job processors (important — you've already dealt with this concept in bulk Prisma operations)

### 10. FlowProducer (Parent-Child Jobs)
- Chaining dependent jobs together
- Use case: "process payment" job only runs after "validate inventory" job completes
- This maps well to your Order/Payment/Inventory microservices Kafka project

---

## Phase 3: Production-Grade Concepts (Topics 11–16)

### 11. Concurrency & Rate Limiting
- Worker concurrency tuning
- `limiter` option — rate limiting jobs per time window
- Avoiding overwhelming downstream services (e.g., third-party APIs, Stripe, email providers)

### 12. Queue Events & Global Monitoring
- `QueueEvents` vs local worker events
- Listening across multiple worker instances
- Building custom logging/alerting on job failures

### 13. Bull Board / Dashboard
- Installing `@bull-board/express` or `@bull-board/nestjs`
- Visualizing queues, jobs, retries, failures in a UI
- Essential for debugging in real projects — don't skip this

### 14. Multiple Queues & Worker Separation
- Running workers in separate processes/containers (relevant to your DevOps learning)
- Horizontal scaling of workers
- Queue naming conventions and namespacing

### 15. Graceful Shutdown
- `worker.close()`
- Handling in-flight jobs during deployment/restarts
- Why this matters in production (no half-processed jobs on deploy)

### 16. NestJS Integration Deep Dive
- `@nestjs/bullmq` package
- `BullModule.registerQueue()`
- `@Processor()` and `@Process()` decorators (or `Worker` class pattern in newer versions)
- Injecting queues into services with `@InjectQueue()`
- Structuring queue logic in a dedicated module (matches your NestJS architecture habits)

---

## Phase 4: Advanced & Reliability Topics (Topics 17–20)

### 17. Sandboxed Processors
- Running job processors in separate Node processes for isolation
- When and why to use this (CPU-heavy jobs, crash isolation)

### 18. Stalled Jobs & Lock Management
- How BullMQ detects stalled jobs (worker died mid-processing)
- `lockDuration`, `lockRenewTime`
- Why this matters for long-running jobs

### 19. Metrics & Observability
- Job count metrics (`getJobCounts()`)
- Integrating with logging/monitoring tools (this pairs well with your Kafka observability learning)
- Comparing queue-based vs event-based (Kafka) reliability patterns — useful since you're doing both right now

### 20. BullMQ vs Kafka — When to Use Which
- Since you're deep in KafkaJS right now, it's worth explicitly comparing:
  - BullMQ = task queues, retries, delayed jobs, single-consumer-per-job semantics
  - Kafka = event streaming, multiple consumers, replay, high-throughput logs
  - They solve different problems and are often used together in real systems

---

## 🚧 Project Checkpoint — Start Building Here

**Start the implementation project after completing Topic 10 (FlowProducer).**

At that point you'll have enough to build something real: queues, workers, retries, delayed jobs, and job chaining. Don't wait until Topic 20 — you'll learn Phase 3 and Phase 4 concepts *better* by hitting real problems in your project (e.g., you'll naturally need Bull Board once debugging gets annoying, and you'll need rate limiting once you hit a fake "Stripe" call too fast).

---

## 💡 Suggested Project: "Notification & Billing Background Worker Service"

A NestJS service that simulates real production background processing — and ties together your existing work (NestJS, Prisma, Stripe integration, Kafka).

### Core Features to Build

1. **Email/Notification Queue**
   - `welcome-email`, `password-reset`, `subscription-renewal-reminder` jobs
   - Use `delay` to send reminder emails X days before renewal

2. **Stripe Billing Retry Queue**
   - Simulate failed payment processing (mock Stripe webhook handler)
   - Use `attempts` + exponential `backoff` to retry failed charge jobs
   - Directly reuses your existing Stripe subscription/invoice work

3. **Bulk Data Processing Queue**
   - Process bulk waypoint/breadcrumb-style data in background jobs instead of blocking API requests
   - Use `concurrency` to control parallel processing
   - Ties directly into your recent bulk-deletion optimization work

4. **Job Chaining with FlowProducer**
   - Example flow: `validate-subscription` → `charge-payment` → `send-receipt-email`
   - Each step only runs if the previous succeeds

5. **Dashboard**
   - Add Bull Board so you can visually watch jobs move through states
   - Genuinely satisfying once it's running — recommend building this early, not last

6. **Graceful Shutdown + Docker**
   - Run the worker as a separate process/container from the API
   - Since you're learning Docker/DevOps in parallel, containerize the worker separately from the main NestJS app — good real-world pattern practice

### Stretch Goals (Optional, Later)
- Add rate limiting to simulate a third-party API limit
- Add a dead-letter handling route for permanently failed jobs
- Compare: re-implement the notification piece using Kafka instead of BullMQ, and journal the tradeoffs you notice firsthand

---

## Quick Reference: Suggested Pace

| Phase | Topics | Suggested Time |
|---|---|---|
| Phase 1: Foundations | 1–5 | 2–3 days |
| Phase 2: Core Job Management | 6–10 | 3–4 days |
| 🚧 **Start Project** | — | **After Topic 10** |
| Phase 3: Production-Grade | 11–16 | Build alongside project |
| Phase 4: Advanced/Reliability | 17–20 | Build alongside project |

Building the project alongside Phase 3 and 4 (instead of before) is intentional — these topics are far easier to internalize when you hit the actual problem they solve, rather than reading about them in the abstract.