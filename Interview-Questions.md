====================================================================
REDIS + BULLMQ INTERVIEW QUESTIONS (Compiled List)
====================================================================
Note: Live web search was unavailable while compiling this, so this
list is built from widely-known, commonly-asked interview question
sets for Redis and BullMQ (Node.js/NestJS context). Let me know if
you'd like me to re-run a fresh web search and update/add sources.
====================================================================


====================================================================
SECTION 1: REDIS BASICS
====================================================================
1. What is Redis? How is it different from traditional databases like MySQL/PostgreSQL?
2. Why is Redis called an in-memory data store? What are the trade-offs of storing data in memory?
3. What data types does Redis support? (String, List, Hash, Set, Sorted Set, Bitmap, HyperLogLog, Stream, Geo)
4. What is the difference between Redis and Memcached?
5. Is Redis single-threaded or multi-threaded? Explain how this affects performance.
6. What is the default port Redis runs on?
7. How does Redis persist data to disk? (RDB vs AOF)
8. What is the difference between RDB snapshotting and AOF (Append Only File)?
9. Can Redis run without persistence at all? When would you do that?
10. What happens to data in Redis if the server restarts and no persistence is configured?
11. What are Redis keys? What are the naming conventions/best practices for keys?
12. How do you set an expiry (TTL) on a key? Commands: EXPIRE, TTL, PEXPIRE, PERSIST.
13. What happens when a key expires — is it deleted immediately or lazily?
14. What eviction policies does Redis support? (noeviction, allkeys-lru, volatile-lru, allkeys-lfu, volatile-lfu, allkeys-random, volatile-random, volatile-ttl)
15. What is the maxmemory-policy and why is it important in production?


====================================================================
SECTION 2: DATA STRUCTURES & COMMANDS
====================================================================
16. Difference between LPUSH/RPUSH and LPOP/RPOP — how would you implement a queue vs a stack using Redis Lists?
17. How do Redis Sets differ from Lists? When would you use SADD vs LPUSH?
18. What is a Sorted Set (ZSET) and what real-world use cases fit it (leaderboards, rate limiting, priority queues)?
19. Explain HSET, HGET, HGETALL — when do you use a Hash instead of multiple String keys?
20. What is HyperLogLog used for? How accurate is it?
21. What are Redis Bitmaps used for (e.g., tracking daily active users)?
22. What is a Redis Stream (XADD, XREAD, XGROUP) and how does it compare to Kafka topics?
23. How do you perform atomic increments/decrements? (INCR, INCRBY, DECR)
24. What is the SCAN command and why is it preferred over KEYS in production?
25. What does the EXPIRE command do internally, and what is "active expiry" vs "passive expiry"?


====================================================================
SECTION 3: TRANSACTIONS, ATOMICITY & SCRIPTING
====================================================================
26. How do Redis transactions work? Explain MULTI, EXEC, DISCARD, WATCH.
27. Is Redis MULTI/EXEC truly ACID? What guarantees does it NOT provide (no rollback on runtime errors)?
28. What is optimistic locking in Redis using WATCH?
29. What are Lua scripts in Redis (EVAL/EVALSHA) and why are they useful for atomic operations?
30. How would you implement a distributed lock using Redis? What is the Redlock algorithm?
31. What are the pitfalls of using Redis as a distributed lock (clock drift, failover issues)?
32. How do you ensure atomicity when doing "check-then-act" operations in Redis (e.g., rate limiting)?


====================================================================
SECTION 4: PERSISTENCE, REPLICATION & HIGH AVAILABILITY
====================================================================
33. Explain RDB persistence — how snapshotting works and its pros/cons (fast restart, but can lose recent data).
34. Explain AOF persistence — fsync policies (always, everysec, no) and trade-offs.
35. Can you use RDB and AOF together? What is "hybrid persistence"?
36. What is Redis replication? How does master-replica (slave) replication work?
37. What is the difference between synchronous and asynchronous replication in Redis?
38. What is Redis Sentinel and what problem does it solve (automatic failover, monitoring)?
39. What is Redis Cluster? How does it differ from Sentinel?
40. How does Redis Cluster shard data across nodes? (Hash slots — 16384 slots)
41. What happens during a Redis Cluster resharding or node failure?
42. What is split-brain in Redis replication and how is it mitigated?
43. How do you achieve high availability with Redis in production (Sentinel/Cluster/managed services like ElastiCache)?


====================================================================
SECTION 5: PERFORMANCE & SCALING
====================================================================
44. Why is Redis so fast? (In-memory, single-threaded event loop, efficient data structures, I/O multiplexing)
45. What is pipelining in Redis and how does it improve throughput?
46. What's the difference between pipelining and transactions (MULTI/EXEC)?
47. How would you handle a "hot key" problem in Redis (a single key getting massive traffic)?
48. How does Redis handle large values? What problems can big keys (large hashes/lists) cause?
49. What is connection pooling and why does it matter when using Redis from a Node.js/NestJS app?
50. How do you monitor Redis performance? (INFO command, MONITOR, latency monitor, slowlog, RedisInsight)
51. What is the SLOWLOG command used for?
52. How would you debug a sudden memory spike in Redis?
53. What is keyspace notification in Redis and what is it used for (e.g., listening to expired key events)?


====================================================================
SECTION 6: CACHING PATTERNS (Important for backend/NestJS roles)
====================================================================
54. What is cache-aside (lazy loading) pattern? How do you implement it with Redis?
55. What is write-through vs write-behind caching?
56. How do you handle cache invalidation? What are common strategies (TTL, event-based invalidation, versioned keys)?
57. What is the "cache stampede" (thundering herd) problem and how do you prevent it (locks, jittered TTL, request coalescing)?
58. How would you cache a paginated API response in Redis? What key structure would you use?
59. How do you handle stale data in a cache vs source-of-truth database?
60. What is "cache penetration" (querying for non-existent keys repeatedly) and how do you mitigate it (e.g., caching null/negative results, Bloom filters)?
61. How would you design a Redis-based session store for a NestJS app?
62. How would you implement rate limiting using Redis (token bucket, sliding window with ZSET/INCR+EXPIRE)?


====================================================================
SECTION 7: SECURITY & OPERATIONS
====================================================================
63. How do you secure a Redis instance (requirepass/AUTH, ACLs, binding to localhost, disabling dangerous commands like FLUSHALL)?
64. What are Redis ACLs (Access Control Lists) introduced in Redis 6?
65. How do you handle Redis backups in production?
66. What is the FLUSHALL/FLUSHDB command and why is it dangerous?
67. How do you upgrade a Redis cluster with zero downtime?
68. What Redis version features matter (e.g., Redis 6 multi-threaded I/O, Redis 7 functions, ACLs)?


====================================================================
SECTION 8: REDIS WITH NODE.JS / NESTJS (Practical, given your background)
====================================================================
69. Which Redis client libraries have you used in Node.js (ioredis vs node-redis)? Differences?
70. How do you integrate Redis caching into a NestJS app (CacheModule, custom interceptors)?
71. How would you use Redis as a pub/sub broker between NestJS microservices?
72. How do you handle Redis connection retries/reconnection logic in a production NestJS service?
73. How would you use Redis to cache Prisma/MongoDB query results?
74. How do you test code that depends on Redis (mocking ioredis, using redis-mock, or a test container)?
75. How would you implement idempotency for an API endpoint using Redis (storing request IDs with TTL)?


====================================================================
SECTION 9: SYSTEM DESIGN / SCENARIO QUESTIONS
====================================================================
76. Design a leaderboard system using Redis Sorted Sets — how do you get a user's rank efficiently?
77. Design a distributed rate limiter for an API gateway using Redis.
78. Design a real-time notification system using Redis Pub/Sub vs Redis Streams — which would you pick and why?
79. How would you use Redis to deduplicate events in an event-driven system (e.g., Kafka consumer idempotency)?
80. How would you design a session management system across multiple server instances using Redis?
81. If Redis goes down in production, what's your fallback strategy for an API that depends on it?
82. How would you migrate a large Redis dataset to a new cluster with minimal downtime?
83. Pub/Sub vs Streams vs Lists as a queue — compare trade-offs (delivery guarantees, persistence, consumer groups).


====================================================================
SECTION 10: BULLMQ (Redis-based Queue for Node.js)
====================================================================
84. What is BullMQ and what problem does it solve? How does it use Redis under the hood?
85. What is the difference between BullMQ and the older Bull library?
86. What are the core concepts in BullMQ: Queue, Worker, Job, QueueEvents, FlowProducer?
87. How do you create a Queue and add a Job in BullMQ?
88. What is a Worker in BullMQ and how does it process jobs (concurrency option)?
89. How does BullMQ guarantee job persistence if the app crashes mid-processing?
90. What job states exist in BullMQ (waiting, active, completed, failed, delayed, paused)?
91. How do you implement delayed jobs in BullMQ?
92. How do you implement repeatable/cron jobs in BullMQ?
93. What is job priority in BullMQ and how is it implemented internally?
94. How does BullMQ handle retries and backoff strategies (fixed, exponential)?
95. What are BullMQ "stalled jobs" and how are they detected/recovered?
96. What is the lock mechanism in BullMQ (lockDuration, lockRenewTime) and why is it needed?
97. How do you implement rate limiting for job processing in BullMQ (limiter option)?
98. What is a FlowProducer in BullMQ and how do you chain dependent jobs (parent-child jobs)?
99. How do you handle job progress reporting in BullMQ?
100. What are BullMQ events (completed, failed, progress, stalled) and how do you listen to them (QueueEvents)?
101. How do you remove/clean up old completed or failed jobs in BullMQ (removeOnComplete, removeOnFail)?
102. How does BullMQ scale horizontally — can multiple workers across multiple servers consume from the same queue?
103. How do you handle job concurrency control per worker vs across the whole queue?
104. What is the difference between a Queue's "pause" and a Worker's "pause"?
105. How would you implement a dead-letter-queue pattern in BullMQ for permanently failed jobs?
106. How do you test BullMQ queues/workers in unit/integration tests?
107. How do you integrate BullMQ with NestJS (@nestjs/bullmq module, @Processor, @Process decorators)?
108. What Redis data structures does BullMQ use internally (Lists, Sorted Sets, Hashes) to manage job states?
109. How would you monitor BullMQ queues in production (Bull Board / Bull-Arena style dashboards)?
110. How do you handle idempotency in BullMQ job processors to avoid duplicate side effects on retry?
111. What happens if Redis used by BullMQ goes down — how do queues recover?
112. How would you design a multi-tenant job queue system using BullMQ (separate queues vs job metadata filtering)?


====================================================================
SECTION 11: QUICK-FIRE / CONCEPTUAL ONE-LINERS
====================================================================
113. Redis is single-threaded for command execution but multi-threaded for I/O since Redis 6 — true or false? Explain.
114. What does "Redis as a broker" mean in NestJS microservices transport options?
115. Difference between Redis Pub/Sub and a message queue (no persistence/replay in Pub/Sub).
116. Why can't Redis Pub/Sub messages be replayed to late subscribers (Streams can, via consumer groups)?
117. What's the maximum size of a single Redis value? (512MB)
118. What does OBJECT ENCODING tell you about how Redis stores a value internally (e.g., listpack vs hashtable)?


====================================================================
END OF FILE
====================================================================