# Redis Commands Reference — Most Used Commands & Their Purpose

A practical reference of the Redis commands you'll actually use day-to-day, grouped by category. Each command includes what it does and why/when you'd reach for it.

---

## 1. Key Management (works on any key type)

| Command | Purpose |
|---|---|
| `SET key value` | Store a value under a key. The most basic write operation. |
| `GET key` | Retrieve a value by key. The most basic read operation. |
| `DEL key [key2 ...]` | Delete one or more keys. Frees memory immediately. |
| `EXISTS key` | Check if a key exists (returns 1 or 0). Useful before doing work that assumes a key is there. |
| `EXPIRE key seconds` | Set a TTL (time-to-live) on a key — it auto-deletes after that many seconds. Core to caching. |
| `TTL key` | Check how many seconds are left before a key expires. Returns -1 if no expiry is set, -2 if key doesn't exist. |
| `PERSIST key` | Remove the expiry from a key, making it permanent again. |
| `EXPIREAT key timestamp` | Set an expiry at a specific Unix timestamp instead of "N seconds from now." |
| `RENAME key newkey` | Rename a key. Useful for atomic "swap" operations (e.g. build new data under a temp key, then rename). |
| `TYPE key` | Check what data structure a key holds (string, list, hash, set, zset, stream). |
| `KEYS pattern` | Find all keys matching a pattern (e.g. `user:*`). **Never use in production** — blocks the server on large datasets. |
| `SCAN cursor` | Non-blocking, paginated way to iterate over keys. The production-safe alternative to `KEYS`. |
| `RANDOMKEY` | Return a random key from the database. Rarely used, occasionally handy for sampling/debugging. |

---

## 2. Strings

Strings are the simplest type — used for caching values, counters, flags, and simple key-value lookups.

| Command | Purpose |
|---|---|
| `SET key value` | Set a string value. |
| `SET key value EX seconds` | Set a value **and** a TTL in one atomic command — the standard way to cache something with expiry. |
| `SET key value NX` | Set only if the key does **not** already exist. Used to implement distributed locks. |
| `SET key value XX` | Set only if the key **already** exists. Used for "update only if present" logic. |
| `GET key` | Retrieve a string value. |
| `GETSET key value` | Set a new value and return the old one in a single atomic step. |
| `MSET key1 val1 key2 val2` | Set multiple keys at once — fewer round trips than multiple `SET` calls. |
| `MGET key1 key2` | Get multiple keys at once — fewer round trips than multiple `GET` calls. |
| `INCR key` | Atomically increment a numeric value by 1. Core building block for counters, view counts, rate limiters. |
| `DECR key` | Atomically decrement a numeric value by 1. |
| `INCRBY key amount` | Increment by a specific amount. |
| `APPEND key value` | Append a string to an existing string value. |
| `STRLEN key` | Get the length of a string value. |

---

## 3. Hashes

Hashes store field-value pairs under one key — perfect for representing an object (like a user or a session) without needing a separate key per field.

| Command | Purpose |
|---|---|
| `HSET key field value` | Set a field inside a hash. E.g. `HSET user:1 name "Ali"`. |
| `HGET key field` | Get a single field's value from a hash. |
| `HMSET key field1 val1 field2 val2` | Set multiple fields at once (older syntax — `HSET` now supports multiple fields too). |
| `HGETALL key` | Get all fields and values in a hash — useful for loading a whole "object" in one call. |
| `HDEL key field` | Delete a specific field from a hash. |
| `HEXISTS key field` | Check if a field exists in a hash. |
| `HINCRBY key field amount` | Atomically increment a numeric field inside a hash (e.g. incrementing a "login count" field). |
| `HKEYS key` | Get all field names in a hash. |
| `HVALS key` | Get all values in a hash. |
| `HLEN key` | Get the number of fields in a hash. |

**Why hashes matter:** storing a user as one hash (`user:123` with fields `name`, `email`, `lastLogin`) is more memory-efficient and easier to manage than storing each field as a separate string key.

---

## 4. Lists

Lists are ordered collections — used for queues, stacks, activity feeds, and recent-items lists.

| Command | Purpose |
|---|---|
| `LPUSH key value` | Push a value onto the **left** (head) of a list. |
| `RPUSH key value` | Push a value onto the **right** (tail) of a list. |
| `LPOP key` | Remove and return the leftmost value — used to pop items off a queue. |
| `RPOP key` | Remove and return the rightmost value. |
| `BLPOP key timeout` | Blocking version of `LPOP` — waits until an item is available or timeout hits. Used for worker processes waiting on jobs. |
| `BRPOP key timeout` | Blocking version of `RPOP`. |
| `LRANGE key start stop` | Get a range of elements (e.g. `LRANGE key 0 9` for the first 10 items) — used for paginated feeds. |
| `LLEN key` | Get the number of items in a list. |
| `LREM key count value` | Remove specific value(s) from a list. |
| `LTRIM key start stop` | Trim a list to only keep a range — useful for capping a "recent activity" list to the last N items. |
| `LINDEX key index` | Get the element at a specific index. |

**Why this matters for queues:** a basic job queue can be built with `LPUSH` (producer adds job) + `BRPOP` (worker waits for and consumes job) — this is literally the mechanism BullMQ builds on top of.

---

## 5. Sets

Sets store unique, unordered values — used for tags, relationships, deduplication, and set algebra (intersections, unions).

| Command | Purpose |
|---|---|
| `SADD key value` | Add a value to a set (duplicates are automatically ignored). |
| `SREM key value` | Remove a value from a set. |
| `SMEMBERS key` | Get all members of a set. |
| `SISMEMBER key value` | Check if a value exists in a set — O(1) lookup, great for "has this user already done X" checks. |
| `SCARD key` | Get the number of members in a set (the set's size). |
| `SINTER key1 key2` | Get the intersection of two sets — e.g. "users who like both Pizza AND Sushi." |
| `SUNION key1 key2` | Get the union of two sets — e.g. "all users who like Pizza OR Sushi." |
| `SDIFF key1 key2` | Get the difference between two sets — e.g. "users who like Pizza but NOT Sushi." |
| `SPOP key` | Remove and return a random member — useful for random sampling. |

**Why sets matter:** great for things like "unique visitors today," "users currently online," or tagging systems where order doesn't matter but uniqueness does.

---

## 6. Sorted Sets (ZSETs)

Sorted sets are like sets, but every member has a **score**, keeping them ordered. This is one of the most powerful and underused structures in Redis.

| Command | Purpose |
|---|---|
| `ZADD key score member` | Add a member with a score — e.g. `ZADD leaderboard 500 "player1"`. |
| `ZSCORE key member` | Get a member's score. |
| `ZRANGE key start stop` | Get members ordered by score, ascending (e.g. top of a leaderboard). |
| `ZREVRANGE key start stop` | Get members ordered by score, descending — common for "top 10" leaderboards. |
| `ZRANGEBYSCORE key min max` | Get members within a score range — useful for time-window queries (e.g. events between two timestamps used as scores). |
| `ZINCRBY key amount member` | Atomically increase a member's score — e.g. incrementing a player's points. |
| `ZRANK key member` | Get a member's rank (position) in the sorted order. |
| `ZREM key member` | Remove a member from the sorted set. |
| `ZCARD key` | Get the number of members in the sorted set. |
| `ZCOUNT key min max` | Count how many members fall within a score range. |

**Why ZSETs matter:** they're the backbone of leaderboards, priority queues, and sliding-window rate limiters (using timestamps as scores and trimming old entries with `ZREMRANGEBYSCORE`).

---

## 7. Pub/Sub

Real-time messaging between publishers and subscribers — no persistence, no delivery guarantee.

| Command | Purpose |
|---|---|
| `SUBSCRIBE channel` | Listen for messages on a channel. |
| `PUBLISH channel message` | Send a message to all current subscribers of a channel. |
| `UNSUBSCRIBE channel` | Stop listening to a channel. |
| `PSUBSCRIBE pattern` | Subscribe to multiple channels matching a pattern (e.g. `news.*`). |

**Why this matters:** good for live notifications, chat features, or broadcasting events to multiple connected services — but remember, if no one is subscribed when a message is published, it's lost forever. Not for anything that needs guaranteed delivery.

---

## 8. Streams

An append-only log structure — like Pub/Sub, but with persistence and consumer groups (multiple consumers can each track their own read position).

| Command | Purpose |
|---|---|
| `XADD stream field value` | Append an entry to a stream. |
| `XRANGE stream start end` | Read a range of entries from a stream. |
| `XREAD COUNT n STREAMS stream id` | Read new entries from a stream, optionally blocking until new data arrives. |
| `XLEN stream` | Get the number of entries in a stream. |
| `XGROUP CREATE stream group id` | Create a consumer group so multiple workers can each process the stream independently and track their own progress. |
| `XACK stream group id` | Acknowledge that a consumer has successfully processed an entry. |

**Why this matters:** Streams solve Pub/Sub's biggest weakness (no persistence) — good for event sourcing, activity logs, or lightweight event-driven systems where you need a replayable history.

---

## 9. Expiration & TTL Utilities

| Command | Purpose |
|---|---|
| `EXPIRE key seconds` | Set TTL in seconds. |
| `PEXPIRE key milliseconds` | Set TTL in milliseconds — for sub-second precision. |
| `TTL key` | Check remaining TTL in seconds. |
| `PTTL key` | Check remaining TTL in milliseconds. |
| `PERSIST key` | Remove TTL, making the key permanent. |

---

## 10. Transactions

| Command | Purpose |
|---|---|
| `MULTI` | Start a transaction block — queues commands instead of executing them immediately. |
| `EXEC` | Execute all queued commands in the transaction atomically. |
| `DISCARD` | Cancel a transaction before it executes. |
| `WATCH key` | Watch a key for changes — used for optimistic locking (the transaction fails if the watched key changed before `EXEC`). |

**Why this matters:** Redis transactions guarantee that no other client's commands can be interleaved between your queued commands — useful for things like "read a value, modify it, write it back" without race conditions.

---

## 11. Server & Debugging

| Command | Purpose |
|---|---|
| `PING` | Check if the server is alive — returns `PONG`. |
| `INFO` | Get detailed server stats — memory usage, connected clients, uptime, persistence status, etc. |
| `MONITOR` | Stream every command hitting the server in real time — great for learning/debugging, never run in production (huge performance hit). |
| `SLOWLOG GET` | View recently logged slow commands — helps find performance bottlenecks. |
| `DBSIZE` | Get the total number of keys in the current database. |
| `FLUSHDB` | Delete **all** keys in the current database. Dangerous — be careful with this in any shared environment. |
| `FLUSHALL` | Delete all keys in **all** databases. Even more dangerous. |
| `CONFIG GET parameter` | Check a server configuration value (e.g. `CONFIG GET maxmemory`). |
| `CONFIG SET parameter value` | Change a server configuration value at runtime. |
| `CLIENT LIST` | See all currently connected clients — useful for debugging connection leaks. |

---

## 12. Common Patterns Cheat-Sheet

| Use Case | Commands Used |
|---|---|
| Cache a DB query result | `SET key value EX seconds` then `GET key` |
| Distributed lock | `SET key value NX EX seconds` |
| Rate limiting (fixed window) | `INCR key` + `EXPIRE key seconds` |
| Rate limiting (sliding window) | `ZADD` with timestamp scores + `ZREMRANGEBYSCORE` to trim old entries |
| Simple job queue | `LPUSH` (producer) + `BRPOP` (worker) |
| Leaderboard | `ZADD`, `ZREVRANGE`, `ZINCRBY` |
| Session storage | `HSET` for session fields + `EXPIRE` for auto-logout |
| "Is user online" tracking | `SADD` to an "online users" set + `SREM` on disconnect |
| Token blacklisting (logout) | `SET key "blacklisted" EX remainingTokenLifetime` |
| Real-time notifications | `PUBLISH` / `SUBSCRIBE` |
| Event log with replay capability | `XADD` / `XREAD` / consumer groups |

---

## Notes

- Almost everything here is **O(1) or O(log n)** — that's why Redis is fast. The dangerous ones are `KEYS`, `FLUSHDB`/`FLUSHALL`, and unbounded `SMEMBERS`/`HGETALL`/`LRANGE` calls on huge collections — these can block the single-threaded server.
- When in doubt about a command's time complexity, check the official docs page for that command — Redis docs always list Big-O complexity per command.
- This list covers ~80% of real-world usage. Redis has many more commands (geospatial, bitmaps, scripting with Lua, etc.) — learn those once you hit a use case that needs them rather than memorizing upfront.