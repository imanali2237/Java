What fsync does in general
When a program writes data, it usually doesn't go straight to the physical disk. It first goes into the OS's write buffer (a page cache in RAM), and the OS decides when to actually flush that buffer to disk — usually after a few seconds, for efficiency.
fsync is a system call that forces the OS to immediately flush that buffer to disk right now, instead of waiting. It's slower (because disk writes are slower than RAM writes) but guarantees the data is actually persisted, not just sitting in a buffer that could vanish if the machine loses power or crashes.
How this applies to Redis AOF
When AOF is enabled, every write command gets appended to the AOF file. But "appended to the file" doesn't automatically mean "safely on disk" — it might still just be sitting in the OS buffer. Redis gives you three policies for when to force that fsync:
appendfsync always

Redis calls fsync after every single write command
Maximum durability — if Redis crashes a millisecond after a write, that write is still safe on disk
Cost: significantly slower writes, since every command now waits on a disk flush instead of just a fast memory append
Used when: you genuinely cannot afford to lose even one write (e.g. financial transactions stored in Redis, though honestly at that point you'd usually question why it's not in a relational DB)

appendfsync everysec (the default, and the sane middle ground)

Redis fsyncs once per second, batching all the writes from that second
Worst case data loss: ~1 second of writes if the machine crashes
Performance is close to no-fsync-at-all, because the expensive disk flush only happens once a second instead of on every command
This is what most production systems use — it's the "good enough" durability/performance trade-off

appendfsync no

Redis never calls fsync itself — it just lets the OS decide when to flush (could be many seconds)
Fastest option, weakest durability guarantee
Used when: data loss of several seconds wouldn't matter (pure caching scenarios)

The practical takeaway
always sounds like the "safe" choice, but in practice almost nobody uses it for normal workloads because the performance hit is large relative to the benefit. everysec is the standard answer you'd give in an interview unless someone describes a use case where losing even one second of data is unacceptable.
A good way to remember the trade-off: fsync frequency is a dial between "fast" and "durable" — you're choosing how much money you're willing to lose in a crash window, measured in milliseconds of writes.