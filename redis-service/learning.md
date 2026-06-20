# Redis Learning Roadmap (for Node.js / NestJS Backend Devs)

A structured path from zero to production-ready Redis usage. Built for someone who already knows Node.js/NestJS and wants to add caching + queues + real-time skills.

---

## 1. Fundamentals — What Redis Actually Is

- [ ] Understand Redis is an in-memory key-value store (not a replacement for your primary DB)
- [ ] Single-threaded event loop model (why it's fast, why blocking commands are dangerous)
- [ ] Persistence basics: RDB snapshots vs AOF (Append Only File)
- [ ] In-memory vs on-disk trade-offs — when data loss is acceptable vs not
- [ ] Install Redis locally (or via Docker) and play with `redis-cli`

**Goal:** Be able to explain what Redis is for and what it's *not* for in an interview.

---

## 2. Core Data Structures

- [ ] **Strings** — basic get/set, counters (`INCR`, `DECR`), TTLs (`EXPIRE`, `TTL`)
- [ ] **Hashes** — storing object-like data (e.g. user sessions)
- [ ] **Lists** — queues/stacks (`LPUSH`, `RPUSH`, `LPOP`, `BRPOP`)
- [ ] **Sets** — uniqueness, tags, relationships (`SADD`, `SINTER`, `SUNION`)
- [ ] **Sorted Sets (ZSETs)** — leaderboards, rate limiting, priority queues (`ZADD`, `ZRANGE`, `ZRANGEBYSCORE`)
- [ ] **Bitmaps & HyperLogLogs** — analytics-style counting (good to know, rarely used day-to-day)
- [ ] **Streams** — append-only log structure (used for event sourcing, lightweight pub-sub alternative)

**Goal:** Given a use case, instantly know which data structure fits.

---

## 3. Caching Patterns (the most important section)

- [ ] **Cache-aside (lazy loading)** — app checks cache first, falls back to DB, then populates cache
- [ ] **Write-through** — write to cache and DB at the same time
- [ ] **Write-behind (write-back)** — write to cache first, async flush to DB later
- [ ] **Read-through** — cache layer handles the DB fetch transparently
- [ ] TTL strategies — fixed expiration vs sliding expiration
- [ ] **Cache invalidation** — the actual hard problem:
    - [ ] Manual invalidation on writes
    - [ ] Event-driven invalidation (pub/sub or queue triggers cache clear)
    - [ ] Versioned cache keys (e.g. `user:123:v2`)
- [ ] **Cache stampede / thundering herd problem** and solutions (locking, request coalescing, jittered TTLs)
- [ ] **Stale-while-revalidate** pattern

**Goal:** Be able to design a caching layer for a real API and explain invalidation strategy clearly — this is what gets asked in interviews.

---

## 4. Redis in Node.js / NestJS

- [ ] Install and use `ioredis` (preferred over basic `redis` package for production use)
- [ ] NestJS integration: `@nestjs/cache-manager` + `cache-manager-redis-store` (or `cache-manager-ioredis-yet`)
- [ ] Build a custom caching decorator/interceptor in NestJS
- [ ] Implement cache-aside pattern manually in a real endpoint (e.g. cache a product listing or user profile)
- [ ] Handle connection errors, retries, and graceful degradation (app should still work if Redis goes down)
- [ ] Environment-based config (dev/staging/prod Redis instances)

**Goal:** Add real caching to one of your existing NestJS projects, not just a toy script.

---

## 5. Redis for Sessions & Auth

- [ ] Store JWT refresh tokens / session data in Redis
- [ ] Token blacklisting (logout, force-expire tokens)
- [ ] Rate limiting using Redis (sliding window, fixed window, token bucket — implement at least one using ZSETs or `INCR` + `EXPIRE`)
- [ ] `express-rate-limit` / `nestjs-throttler` with Redis store for distributed rate limiting (important: in-memory rate limiting breaks across multiple server instances)

**Goal:** Understand why Redis-backed rate limiting/sessions matter once you have more than one server instance.

---

## 6. Pub/Sub & Real-Time Features

- [ ] Redis Pub/Sub basics (`PUBLISH`, `SUBSCRIBE`)
- [ ] Use case: real-time notifications, chat features, live updates
- [ ] Understand Pub/Sub limitations (no message persistence, no delivery guarantee — messages are lost if no subscriber is listening)
- [ ] When to use Pub/Sub vs a proper queue (this distinction matters a lot)

**Goal:** Know when Pub/Sub is the right tool vs when you actually need a message queue.

---

## 7. Redis as a Queue (Bridge to BullMQ)

- [ ] Understand Redis Lists as a basic queue mechanism
- [ ] Move to **BullMQ** (built on Redis, the standard for Node.js job queues)
    - [ ] Producers, consumers, workers
    - [ ] Job retries, backoff strategies, delayed jobs
    - [ ] Dead-letter / failed job handling
    - [ ] Concurrency control
- [ ] Build something real: background job processor (e.g. email sending, image processing, order pipeline)

**Goal:** This bridges directly into your "stand out" project — caching + queues in one system.

---

## 8. Scaling & Production Concepts

- [ ] Redis persistence config trade-offs in production (RDB snapshot intervals, AOF fsync policy)
- [ ] **Redis replication** — primary/replica setup, read scaling
- [ ] **Redis Sentinel** — high availability, automatic failover
- [ ] **Redis Cluster** — sharding across multiple nodes (know the concept, don't need to be an expert)
- [ ] Eviction policies (`LRU`, `LFU`, `noeviction`) — what happens when memory fills up
- [ ] Memory optimization — monitoring memory usage, avoiding storing huge objects
- [ ] Connection pooling and avoiding connection leaks in Node apps

**Goal:** Be able to discuss how Redis behaves in production, not just locally.

---

## 9. Monitoring & Debugging

- [ ] `redis-cli MONITOR` and `INFO` commands
- [ ] Slow log analysis (`SLOWLOG`)
- [ ] Key expiration monitoring, memory usage tracking
- [ ] Tools: RedisInsight (GUI), Grafana + Redis exporter for metrics

**Goal:** Know how to debug "why is Redis slow" or "why is memory growing" in a live system.

---

## 10. Capstone Project (apply everything)

Build one project that uses:
- [ ] Cache-aside pattern for a frequently-read resource (e.g. product catalog, user profiles)
- [ ] Redis-backed rate limiting on public endpoints
- [ ] BullMQ for an async task (e.g. order processing, notification dispatch)
- [ ] Pub/Sub or Streams for a real-time feature (e.g. live order status updates)
- [ ] Proper TTL + invalidation strategy, documented in your README
- [ ] Basic monitoring (log cache hit/miss ratio at minimum)

Document your **design decisions** in the README — interviewers care more about *why* you chose a pattern than that you used Redis at all.

---

## Suggested Pace

| Week | Focus |
|------|-------|
| 1 | Fundamentals + data structures + redis-cli practice |
| 2 | Caching patterns + invalidation strategies (theory) |
| 3 | ioredis/NestJS integration — add caching to a real project |
| 4 | Sessions, auth, rate limiting with Redis |
| 5 | Pub/Sub + intro to BullMQ |
| 6 | BullMQ deep dive — build the async job feature |
| 7 | Production concepts (replication, Sentinel, eviction, monitoring) |
| 8 | Capstone project polish + documentation |

---

## Quick Reference: Tools/Packages to Know

- `ioredis` — main Redis client for Node.js
- `@nestjs/cache-manager` — NestJS caching abstraction
- `bullmq` — Redis-based job queue for Node.js
- `nestjs-throttler` (with Redis storage) — rate limiting in NestJS
- `RedisInsight` — GUI for inspecting Redis data
- Docker — easiest way to run Redis locally (`docker run -p 6379:6379 redis`)