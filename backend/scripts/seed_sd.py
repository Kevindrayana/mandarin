"""Seed DDIA system-design topics and quiz questions."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from models import connect, init_schema  # noqa: E402

TOPICS = [
    # Part I: Foundations
    {
        "slug": "reliability-scalability-maintainability",
        "title": "Reliability, Scalability & Maintainability",
        "description": "The three goals of a data-intensive application: surviving faults, handling load, and enabling change.",
        "chapter_num": 1,
        "part_num": 1,
        "position_order": 1,
        "prerequisites": "",
    },
    {
        "slug": "data-models-query-languages",
        "title": "Data Models & Query Languages",
        "description": "Relational, document, and graph models — and the trade-offs between them.",
        "chapter_num": 2,
        "part_num": 1,
        "position_order": 2,
        "prerequisites": "reliability-scalability-maintainability",
    },
    {
        "slug": "storage-and-retrieval",
        "title": "Storage & Retrieval",
        "description": "How storage engines work: B-trees, LSM-trees, SSTables, and column stores.",
        "chapter_num": 3,
        "part_num": 1,
        "position_order": 3,
        "prerequisites": "data-models-query-languages",
    },
    {
        "slug": "encoding-and-evolution",
        "title": "Encoding & Evolution",
        "description": "Serialisation formats, schema evolution, and dataflow between services.",
        "chapter_num": 4,
        "part_num": 1,
        "position_order": 4,
        "prerequisites": "storage-and-retrieval",
    },
    # Part II: Distributed Data
    {
        "slug": "replication",
        "title": "Replication",
        "description": "Keeping copies of data on multiple nodes: leaders, followers, and conflict resolution.",
        "chapter_num": 5,
        "part_num": 2,
        "position_order": 1,
        "prerequisites": "encoding-and-evolution",
    },
    {
        "slug": "partitioning",
        "title": "Partitioning (Sharding)",
        "description": "Splitting data across nodes to spread load, and handling rebalancing.",
        "chapter_num": 6,
        "part_num": 2,
        "position_order": 2,
        "prerequisites": "replication",
    },
    {
        "slug": "transactions",
        "title": "Transactions",
        "description": "ACID guarantees, isolation levels, and the cost of serializability.",
        "chapter_num": 7,
        "part_num": 2,
        "position_order": 3,
        "prerequisites": "partitioning",
    },
    {
        "slug": "distributed-systems-trouble",
        "title": "Trouble with Distributed Systems",
        "description": "Unreliable networks, clocks, and process pauses — what you can and cannot assume.",
        "chapter_num": 8,
        "part_num": 2,
        "position_order": 4,
        "prerequisites": "transactions",
    },
    {
        "slug": "consistency-and-consensus",
        "title": "Consistency & Consensus",
        "description": "Linearizability, CAP theorem, ordering guarantees, and distributed consensus.",
        "chapter_num": 9,
        "part_num": 2,
        "position_order": 5,
        "prerequisites": "distributed-systems-trouble",
    },
    # Part III: Derived Data
    {
        "slug": "batch-processing",
        "title": "Batch Processing",
        "description": "MapReduce, dataflow engines (Spark), and the Unix philosophy at scale.",
        "chapter_num": 10,
        "part_num": 3,
        "position_order": 1,
        "prerequisites": "consistency-and-consensus",
    },
    {
        "slug": "stream-processing",
        "title": "Stream Processing",
        "description": "Kafka, event sourcing, CQRS, and handling time in unbounded data streams.",
        "chapter_num": 11,
        "part_num": 3,
        "position_order": 2,
        "prerequisites": "batch-processing",
    },
    {
        "slug": "future-of-data-systems",
        "title": "The Future of Data Systems",
        "description": "Unbundling databases, derived data views, and end-to-end correctness.",
        "chapter_num": 12,
        "part_num": 3,
        "position_order": 3,
        "prerequisites": "stream-processing",
    },
]

# Each entry: prompt, explanation, choices list where one has is_correct=True
QUESTIONS: dict[str, list[dict]] = {
    "reliability-scalability-maintainability": [
        {
            "prompt": "What is the key difference between a 'fault' and a 'failure' in DDIA's terminology?",
            "explanation": "A fault is a deviation in one component from its spec. A failure is when the whole system stops providing its required service. Fault-tolerant systems prevent faults from causing failures.",
            "choices": [
                {"text": "A fault is a deviation in one component; a failure is when the overall system stops providing its service.", "is_correct": True},
                {"text": "A fault is a software bug; a failure is a hardware crash.", "is_correct": False},
                {"text": "A fault is always recoverable; a failure is permanent.", "is_correct": False},
                {"text": "A fault is user-visible; a failure is internal and unobserved.", "is_correct": False},
            ],
        },
        {
            "prompt": "Why does Netflix's Chaos Monkey deliberately kill random production servers?",
            "explanation": "Deliberately triggering faults ensures fault-tolerance machinery is continuously exercised. It surfaces weaknesses before a real unplanned failure occurs and trains teams to respond.",
            "choices": [
                {"text": "To ensure fault-tolerance code is regularly exercised and weaknesses are found before a real incident.", "is_correct": True},
                {"text": "To reduce infrastructure costs by removing redundant instances.", "is_correct": False},
                {"text": "To test the monitoring and alerting systems in isolation.", "is_correct": False},
                {"text": "To simulate load and measure performance under stress.", "is_correct": False},
            ],
        },
        {
            "prompt": "A service reports p50=50 ms, p95=200 ms, p99=2000 ms. What does p99=2000 ms mean in practice?",
            "explanation": "p99 (99th percentile) means 1 in 100 requests takes ≥2 s. Tail latencies disproportionately affect the users who interact most heavily with the service.",
            "choices": [
                {"text": "1 in 100 requests takes at least 2 seconds; the heaviest users experience the worst tail.", "is_correct": True},
                {"text": "99% of requests fail within 2 seconds.", "is_correct": False},
                {"text": "The average request takes 2 seconds for 99% of users.", "is_correct": False},
                {"text": "99% of the time the service is unavailable.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'elastic scalability'?",
            "explanation": "Elastic systems automatically add resources when load spikes and release them when load drops — a key property of cloud-native architectures.",
            "choices": [
                {"text": "Automatically adding or removing resources in response to detected load changes.", "is_correct": True},
                {"text": "Scaling horizontally by manually adding commodity hardware.", "is_correct": False},
                {"text": "Surviving hardware failures without data loss.", "is_correct": False},
                {"text": "Scaling vertically by upgrading individual machine sizes.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does DDIA mean by 'evolvability' (also called extensibility) under maintainability?",
            "explanation": "Evolvability means making it easy for engineers to adapt the system to unanticipated future requirements — essential because requirements never stop changing.",
            "choices": [
                {"text": "Making it easy to adapt the system to unanticipated future requirements.", "is_correct": True},
                {"text": "Using version control so the system can be rolled back to a previous state.", "is_correct": False},
                {"text": "Deploying the system to multiple environments (dev, staging, prod).", "is_correct": False},
                {"text": "Ensuring backward compatibility when upgrading third-party dependencies.", "is_correct": False},
            ],
        },
    ],

    "data-models-query-languages": [
        {
            "prompt": "What is 'impedance mismatch' in the context of relational databases?",
            "explanation": "Application code uses objects and classes; the relational model uses tables and rows. An awkward ORM translation layer is needed between these two representations.",
            "choices": [
                {"text": "The disconnect between object-oriented application code and the relational table representation.", "is_correct": True},
                {"text": "The performance gap between read and write operations in a relational database.", "is_correct": False},
                {"text": "The inconsistency in data between a leader replica and its followers.", "is_correct": False},
                {"text": "The speed difference between SQL and NoSQL query engines.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does 'schema-on-read' mean, and which database type typically uses it?",
            "explanation": "Schema-on-read: the data's structure is implicit and only interpreted when read, not enforced at write time. Document databases like MongoDB use this, offering flexibility at the cost of no write-time validation.",
            "choices": [
                {"text": "The schema is implicit; structure is applied when reading rather than enforced on write. Document databases use this.", "is_correct": True},
                {"text": "The schema is validated on every read query to catch corruption.", "is_correct": False},
                {"text": "Reads are faster because there is no schema validation overhead.", "is_correct": False},
                {"text": "The DBA defines the schema at query time rather than at table creation.", "is_correct": False},
            ],
        },
        {
            "prompt": "When does a document database's 'data locality' advantage break down?",
            "explanation": "Locality helps when you need the whole document. It hurts when you need only a small part of a large document (you still load it all) or when data naturally spans multiple documents and requires joins.",
            "choices": [
                {"text": "When you need only a small part of a large document, or when data spans multiple documents.", "is_correct": True},
                {"text": "When the document database doesn't support secondary indexes.", "is_correct": False},
                {"text": "When the collection has more than 10,000 documents.", "is_correct": False},
                {"text": "When the database is deployed across multiple data centers.", "is_correct": False},
            ],
        },
        {
            "prompt": "What makes graph databases particularly suited for multi-hop relationship queries?",
            "explanation": "Graph databases store vertices and edges explicitly. Traversing 'friends of friends' or fraud chains requires following edges, which is cheap. In a relational model, each hop would require an expensive join.",
            "choices": [
                {"text": "They store edges explicitly, making multi-hop traversal cheap without repeated joins.", "is_correct": True},
                {"text": "They keep all data in memory for constant-time access.", "is_correct": False},
                {"text": "Their declarative query language is easier for optimizers to handle.", "is_correct": False},
                {"text": "They don't require a schema, so relationship types can change freely.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the key advantage of declarative queries (like SQL) over imperative APIs (like MapReduce)?",
            "explanation": "Declarative queries state WHAT you want; the optimizer chooses HOW. This lets the database improve its execution plan, parallelize operations, or exploit new indexes without changing your query.",
            "choices": [
                {"text": "The optimizer can choose and improve the execution plan without changing the query.", "is_correct": True},
                {"text": "Declarative languages are always faster than imperative code.", "is_correct": False},
                {"text": "They enforce data types, preventing application errors.", "is_correct": False},
                {"text": "Declarative queries are portable across any database engine.", "is_correct": False},
            ],
        },
    ],

    "storage-and-retrieval": [
        {
            "prompt": "What is the primary write-performance advantage of LSM-trees over B-trees?",
            "explanation": "LSM-trees buffer writes in memory (memtable) and flush them as sequential SSTable files, converting random writes to sequential disk I/O. B-trees update pages in-place (random I/O). Sequential writes are much faster on HDDs and better for SSD write amplification.",
            "choices": [
                {"text": "LSM-trees convert random writes to sequential disk writes by batching through an in-memory buffer.", "is_correct": True},
                {"text": "LSM-trees use less memory than B-trees for the same dataset.", "is_correct": False},
                {"text": "LSM-trees support transactions natively while B-trees do not.", "is_correct": False},
                {"text": "LSM-trees never write to disk during normal operation.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'write amplification' and why does it matter for SSDs?",
            "explanation": "Write amplification: one logical write causes multiple physical disk writes (e.g., SSTable compaction rewrites data repeatedly). SSDs have limited write cycles per cell, so high write amplification shortens SSD lifespan and reduces sustained write throughput.",
            "choices": [
                {"text": "A single logical write causes multiple physical writes (e.g., compaction); it wears out SSDs faster and limits throughput.", "is_correct": True},
                {"text": "Writes are replicated to multiple nodes, amplifying network traffic.", "is_correct": False},
                {"text": "The database pads writes to align with disk block boundaries.", "is_correct": False},
                {"text": "Write operations must be retried multiple times due to lock contention.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the purpose of a Write-Ahead Log (WAL) in a storage engine?",
            "explanation": "The WAL records every intended change before applying it to the main data structures. After a crash, the engine replays the WAL to recover committed changes — ensuring durability without requiring immediate synchronous writes to the main file.",
            "choices": [
                {"text": "To ensure durability: changes are logged before being applied, enabling crash recovery.", "is_correct": True},
                {"text": "To improve write throughput by batching many writes into one disk flush.", "is_correct": False},
                {"text": "To enable MVCC snapshots for concurrent read transactions.", "is_correct": False},
                {"text": "To replicate write operations to follower nodes in real time.", "is_correct": False},
            ],
        },
        {
            "prompt": "How does column-oriented storage improve performance for analytical (OLAP) queries?",
            "explanation": "OLAP queries read a few columns across many rows (e.g., SUM(amount) for all orders). Column storage keeps all values for one column together, so the query reads only the relevant columns. It also enables much better compression (similar values adjacent).",
            "choices": [
                {"text": "Queries read only the needed columns, skipping irrelevant data; adjacent similar values also compress better.", "is_correct": True},
                {"text": "Column stores keep all data in RAM, making all operations faster.", "is_correct": False},
                {"text": "Column stores eliminate the need for indexes on analytical tables.", "is_correct": False},
                {"text": "Column stores are faster for point reads and single-row inserts.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does a Bloom filter do in a storage engine like RocksDB?",
            "explanation": "A Bloom filter is a probabilistic data structure: it can say 'definitely not present' or 'probably present.' Before a potentially expensive SSTable disk read for a missing key, RocksDB checks the Bloom filter; a 'not present' result skips the read entirely.",
            "choices": [
                {"text": "Quickly determines a key is definitely absent, avoiding expensive disk reads for non-existent keys.", "is_correct": True},
                {"text": "Compresses SSTable files before they are written to disk.", "is_correct": False},
                {"text": "Distributes keys evenly across partitions to avoid hot spots.", "is_correct": False},
                {"text": "Schedules when SSTable files should be compacted.", "is_correct": False},
            ],
        },
    ],

    "encoding-and-evolution": [
        {
            "prompt": "What is 'backward compatibility' in schema evolution?",
            "explanation": "Backward compatibility: new code can read data written by old code. This is critical during rolling upgrades when new and old code run simultaneously — the new code must tolerate data encoded with the old schema.",
            "choices": [
                {"text": "New code can read data that was written by old code.", "is_correct": True},
                {"text": "Old code can read data that was written by new code.", "is_correct": False},
                {"text": "The current schema matches the schema stored in the database.", "is_correct": False},
                {"text": "Data encoded in one format can be decoded by any other format.", "is_correct": False},
            ],
        },
        {
            "prompt": "Why is using language-specific serialization (Java Serialization, Python pickle) for inter-service communication dangerous?",
            "explanation": "Language-specific formats couple you to one language, have no cross-language support, lack versioning/schema evolution, are often inefficient, and can have severe security vulnerabilities — deserializing untrusted data can execute arbitrary code.",
            "choices": [
                {"text": "It couples you to one language, has no versioning support, and can execute arbitrary code on deserialization.", "is_correct": True},
                {"text": "It uses too much disk space compared to text formats like JSON.", "is_correct": False},
                {"text": "It's too slow for production workloads.", "is_correct": False},
                {"text": "It doesn't support nested objects or arrays.", "is_correct": False},
            ],
        },
        {
            "prompt": "How does Avro handle schema evolution differently from Protocol Buffers?",
            "explanation": "Avro encodes no field tags in the data. Fields are matched by position using the writer's schema against the reader's schema at decode time. This makes Avro very compact and ideal for dynamically generated schemas (like Hadoop Avro), but the writer's schema must be shipped alongside the data.",
            "choices": [
                {"text": "Avro encodes no field tags; fields are matched using the writer's and reader's schemas together at decode time.", "is_correct": True},
                {"text": "Avro embeds the full schema in every encoded message, making it self-describing.", "is_correct": False},
                {"text": "Avro requires every field to have a default value for backward compatibility.", "is_correct": False},
                {"text": "Avro uses string field names for readability while Protobuf uses integer tags.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'dataflow through services' (REST/RPC), and what is its key schema-evolution challenge?",
            "explanation": "Services deploy independently, so at any point old and new versions coexist. The client calling an API might be older than the server, or vice versa. Both forward compatibility (old code reads new data) and backward compatibility (new code reads old data) must hold simultaneously.",
            "choices": [
                {"text": "Services upgrade independently, so both forward and backward compatibility must hold at the same time.", "is_correct": True},
                {"text": "REST always uses JSON, which is schemaless, so evolution is never a problem.", "is_correct": False},
                {"text": "Services share a database schema, so evolution is centrally managed.", "is_correct": False},
                {"text": "RPC frameworks automatically version themselves using semantic versioning.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the key trade-off between text formats (JSON, XML) and binary formats (Protobuf, Avro, Thrift)?",
            "explanation": "Text formats: human-readable, easy to debug, wide tooling support, flexible. Binary formats: more compact (3–10× smaller), faster to encode/decode, enforce schemas with type checking and evolution support — but not human-readable without tooling.",
            "choices": [
                {"text": "Text formats are human-readable and flexible; binary formats are more compact, faster, and enforce schemas.", "is_correct": True},
                {"text": "Text formats are always safer; binary formats can cause data corruption.", "is_correct": False},
                {"text": "Binary formats support more data types; text formats only handle strings.", "is_correct": False},
                {"text": "Text formats are faster because they skip the encoding/decoding step.", "is_correct": False},
            ],
        },
    ],

    "replication": [
        {
            "prompt": "What is the fundamental trade-off between synchronous and asynchronous replication?",
            "explanation": "Synchronous: the leader waits for follower acknowledgment before confirming the write — no data loss on leader failure, but writes block if the follower is slow or down. Asynchronous: faster writes, but if the leader fails before followers catch up, acknowledged writes can be lost.",
            "choices": [
                {"text": "Synchronous guarantees no data loss but blocks if a follower is slow; asynchronous is faster but can lose acknowledged writes.", "is_correct": True},
                {"text": "Synchronous replication is faster because it uses a direct connection.", "is_correct": False},
                {"text": "Asynchronous replication never loses data because it retries until acknowledged.", "is_correct": False},
                {"text": "Synchronous replication requires more follower nodes than asynchronous.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'replication lag' and what user-visible problem can it cause?",
            "explanation": "Replication lag is the delay between a write hitting the leader and appearing on followers. If reads are load-balanced across followers, a user may see stale data — or worse, see their own just-submitted change disappear when the next read hits a lagging follower.",
            "choices": [
                {"text": "The delay before a leader write appears on followers; reading from a lagging follower can return stale or vanishing data.", "is_correct": True},
                {"text": "The time it takes to copy the full dataset to a new replica when it first joins.", "is_correct": False},
                {"text": "The extra latency added to writes because synchronous replication waits for followers.", "is_correct": False},
                {"text": "The delay caused when the leader waits for a network partition to heal.", "is_correct": False},
            ],
        },
        {
            "prompt": "What consistency guarantee does 'read-your-writes' (read-after-write consistency) provide?",
            "explanation": "After a user submits data, they will always see their own change on subsequent reads — even if the system routes reads to lagging followers. Other users may still see stale data. Typically implemented by routing the submitting user's reads to the leader.",
            "choices": [
                {"text": "After you write data, your own subsequent reads will always see that write.", "is_correct": True},
                {"text": "All users immediately see your writes across every replica.", "is_correct": False},
                {"text": "Writes are acknowledged only after they appear on all replicas.", "is_correct": False},
                {"text": "Every read from any replica returns the globally most recent value.", "is_correct": False},
            ],
        },
        {
            "prompt": "What problem is unique to multi-leader replication that single-leader setups avoid entirely?",
            "explanation": "In multi-leader replication, two leaders can accept writes to the same record simultaneously, creating conflicting versions. Single-leader prevents this because all writes funnel through one node. Conflict detection and resolution is the defining challenge of multi-leader systems.",
            "choices": [
                {"text": "Write conflicts: the same data can be modified on two leaders at the same time.", "is_correct": True},
                {"text": "Follower failures, since each leader has its own set of followers.", "is_correct": False},
                {"text": "Network partitions, which only occur with multiple active leaders.", "is_correct": False},
                {"text": "Higher read latency because reads must be coordinated across leaders.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the key availability advantage of leaderless (Dynamo-style) replication?",
            "explanation": "Leaderless systems (Cassandra, Riak, Amazon Dynamo) send writes to multiple nodes simultaneously. Writes succeed when a quorum (w out of n) nodes acknowledge — even with some nodes down. There is no single leader whose failure stops writes.",
            "choices": [
                {"text": "Writes succeed as long as a quorum of nodes is reachable, even when some nodes are offline.", "is_correct": True},
                {"text": "It provides stronger consistency than leader-based replication.", "is_correct": False},
                {"text": "It eliminates write conflicts, since there is no leader to serialize writes.", "is_correct": False},
                {"text": "It provides lower read latency because there is no leader coordination step.", "is_correct": False},
            ],
        },
    ],

    "partitioning": [
        {
            "prompt": "What is the main risk of key-range partitioning using a monotonically increasing key like a timestamp?",
            "explanation": "All writes go to the partition containing today's timestamp range — a 'hot partition.' Other partitions are idle. Hash-based or compound partitioning distributes writes more evenly at the cost of losing efficient range scans.",
            "choices": [
                {"text": "All recent writes land on one partition (hot spot) while older partitions sit idle.", "is_correct": True},
                {"text": "Keys cannot be located without scanning all partitions.", "is_correct": False},
                {"text": "Key-range partitions cannot be rebalanced when a new node joins.", "is_correct": False},
                {"text": "Secondary indexes are incompatible with key-range partitioning.", "is_correct": False},
            ],
        },
        {
            "prompt": "What problem does hash-based partitioning solve, and what does it sacrifice?",
            "explanation": "Hashing distributes keys evenly, eliminating hot spots. But adjacent keys land on different partitions, so range queries (all records between A and B) must scatter across all partitions — an expensive scatter/gather operation.",
            "choices": [
                {"text": "It distributes keys evenly to avoid hot spots, at the cost of efficient range queries.", "is_correct": True},
                {"text": "It ensures all related data is co-located on the same node.", "is_correct": False},
                {"text": "It eliminates the need for rebalancing when nodes join or leave.", "is_correct": False},
                {"text": "It makes secondary index queries faster by grouping similar values.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the challenge of secondary indexes in a partitioned dataset?",
            "explanation": "Secondary indexes don't map neatly to partition keys. Local (document-based) indexes require scatter/gather reads across all partitions. Global (term-based) indexes are more efficient to read but complicate writes — a single write may need to update index entries on several partitions.",
            "choices": [
                {"text": "Secondary indexes don't align with partition keys: local indexes need scatter/gather reads; global indexes complicate writes.", "is_correct": True},
                {"text": "Secondary indexes are unsupported in all distributed databases.", "is_correct": False},
                {"text": "Secondary indexes must be stored on a separate dedicated cluster.", "is_correct": False},
                {"text": "Using a secondary index forces you to use the same partition scheme as the primary index.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the 'fixed number of partitions' rebalancing strategy and why does it simplify operations?",
            "explanation": "Create far more partitions than nodes upfront (e.g., 1000 partitions for 10 nodes). When a node joins, move some complete partitions to it. Keys never change their partition; only the partition-to-node assignment changes — so no key rehashing is needed.",
            "choices": [
                {"text": "Pre-create many more partitions than nodes; adding a node just reassigns existing partitions without rehashing keys.", "is_correct": True},
                {"text": "Keep the number of partitions equal to the number of nodes at all times.", "is_correct": False},
                {"text": "Fixed partitions require all traffic to pause while partitions are moved.", "is_correct": False},
                {"text": "Each write operation triggers a check to see if rebalancing is needed.", "is_correct": False},
            ],
        },
        {
            "prompt": "What role does ZooKeeper play in request routing for systems like Kafka or HBase?",
            "explanation": "ZooKeeper holds the authoritative partition-to-node mapping. Routing tiers and clients subscribe to changes. When a rebalance occurs, ZooKeeper notifies subscribers so they can update their routing tables without needing a central load balancer.",
            "choices": [
                {"text": "It maintains the partition-to-node mapping and notifies clients/routers when partitions move.", "is_correct": True},
                {"text": "It acts as a load balancer, directing each request to the least-loaded node.", "is_correct": False},
                {"text": "It stores partition data redundantly so any node can answer any request.", "is_correct": False},
                {"text": "It runs leader election for every individual partition key.", "is_correct": False},
            ],
        },
    ],

    "transactions": [
        {
            "prompt": "What does 'atomicity' guarantee in ACID transactions?",
            "explanation": "Atomicity means all operations in the transaction either all commit or all abort — no partial success. If a failure occurs mid-transaction, any partial changes are rolled back, leaving the database as if the transaction never started.",
            "choices": [
                {"text": "All operations succeed together or all are rolled back — no partial commits.", "is_correct": True},
                {"text": "Concurrent operations cannot interfere with each other.", "is_correct": False},
                {"text": "Each CPU instruction in the transaction is indivisible.", "is_correct": False},
                {"text": "Committed data is never erased even after hardware failure.", "is_correct": False},
            ],
        },
        {
            "prompt": "What anomaly does 'read committed' isolation prevent, and what does it still allow?",
            "explanation": "Read committed blocks dirty reads (seeing uncommitted data) and dirty writes (overwriting another transaction's uncommitted change). But it still allows non-repeatable reads: the same row read twice within a transaction may return different values if another transaction committed between reads.",
            "choices": [
                {"text": "Prevents dirty reads and dirty writes, but allows non-repeatable reads.", "is_correct": True},
                {"text": "Prevents all anomalies including phantom reads and write skew.", "is_correct": False},
                {"text": "Prevents non-repeatable reads but allows dirty reads for performance.", "is_correct": False},
                {"text": "Prevents dirty writes only; all reads may see uncommitted data.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a 'phantom read' and why is it harder to prevent than a non-repeatable read?",
            "explanation": "A phantom read: a transaction re-executes a range query and finds new rows inserted by a concurrently committed transaction. It's harder to prevent because the new rows don't exist yet when the first read happens, so there's nothing to lock. Predicate locks or gap locks are needed.",
            "choices": [
                {"text": "A range query returns different rows on re-execution because new matching rows were inserted concurrently.", "is_correct": True},
                {"text": "A row disappears and reappears between two reads in the same transaction.", "is_correct": False},
                {"text": "A read returns NULL for data deleted by a concurrent transaction.", "is_correct": False},
                {"text": "A read sees another transaction's uncommitted data.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'write skew', and how does it differ from a 'lost update'?",
            "explanation": "Write skew: two transactions read overlapping data, then each writes to different records, violating an application invariant (e.g., two doctors both go off-call because each saw two doctors were still on call). Lost update: both transactions read and write the same record; one overwrites the other.",
            "choices": [
                {"text": "Write skew: two transactions read overlapping data and write different records, breaking an invariant. Lost update: both write the same record and one overwrites the other.", "is_correct": True},
                {"text": "Write skew occurs only in distributed systems; lost updates happen on single-node databases.", "is_correct": False},
                {"text": "They are the same anomaly with different names in different communities.", "is_correct": False},
                {"text": "Write skew is prevented by read committed; lost updates require serializable isolation.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is 'serializable snapshot isolation' (SSI) and what is its key advantage over two-phase locking (2PL)?",
            "explanation": "SSI is optimistic: transactions run without acquiring locks; at commit time, the system checks for serialization conflicts and aborts the loser. 2PL is pessimistic: it acquires locks that block concurrent readers and writers. SSI offers much higher throughput under low contention because reads and writes don't block each other.",
            "choices": [
                {"text": "SSI is optimistic (detect conflicts at commit, abort loser); 2PL is pessimistic (block via locks). SSI gives higher throughput under low contention.", "is_correct": True},
                {"text": "SSI is stronger than 2PL and prevents more anomalies.", "is_correct": False},
                {"text": "SSI is only used for read-only transactions; 2PL handles writes.", "is_correct": False},
                {"text": "SSI requires two separate database instances to compare snapshots.", "is_correct": False},
            ],
        },
    ],

    "distributed-systems-trouble": [
        {
            "prompt": "Why can't distributed systems rely on wall-clock timestamps to order events across nodes?",
            "explanation": "Clocks on different machines drift at different rates, and NTP synchronization is only approximate (typically within milliseconds but sometimes much worse). A timestamp from node A may claim to be earlier than node B's even if A's event happened later. You cannot safely infer causality from wall-clock time alone.",
            "choices": [
                {"text": "Machine clocks drift and NTP is approximate, so timestamps cannot reliably establish causality across nodes.", "is_correct": True},
                {"text": "Timestamp comparison is too slow for high-throughput distributed systems.", "is_correct": False},
                {"text": "Time zone differences make cross-region timestamp comparisons impossible.", "is_correct": False},
                {"text": "Timestamps only work within a single database transaction.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does the 'split-brain' problem mean in a distributed system?",
            "explanation": "Split-brain: a network partition causes two nodes each to believe they are the current leader. Both accept writes, producing conflicting state. Single-leader systems prevent this with fencing tokens or epoch numbers that invalidate stale leaders.",
            "choices": [
                {"text": "Two nodes each believe they are the active leader simultaneously due to a network partition.", "is_correct": True},
                {"text": "The database index is split across nodes, causing inconsistent query results.", "is_correct": False},
                {"text": "A node's memory is split between two competing workloads, causing OOM.", "is_correct": False},
                {"text": "Two replicas permanently diverge because replication was never repaired.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does the 'two generals problem' prove about distributed systems?",
            "explanation": "Two armies must coordinate a simultaneous attack over an unreliable messenger; no finite exchange of messages can guarantee both sides commit. In distributed systems this proves no algorithm can achieve perfect consensus over an unreliable channel — some irreducible uncertainty always remains.",
            "choices": [
                {"text": "No algorithm can guarantee consensus over an unreliable communication channel — some uncertainty always remains.", "is_correct": True},
                {"text": "You need at least two independent nodes for any form of fault tolerance.", "is_correct": False},
                {"text": "Message ordering cannot be guaranteed in distributed systems.", "is_correct": False},
                {"text": "Byzantine fault tolerance requires more than two nodes.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the difference between 'crash-stop' and 'crash-recovery' fault models?",
            "explanation": "Crash-stop: a failed node stops permanently. Crash-recovery: the node may crash and restart, retaining durable (disk) state but losing in-memory state. Most real systems assume crash-recovery, which is why WALs and durable storage matter — in-memory state must be re-derived after restart.",
            "choices": [
                {"text": "Crash-stop: the node fails permanently. Crash-recovery: the node may restart and recover durable state but loses in-memory state.", "is_correct": True},
                {"text": "Crash-stop is a software failure; crash-recovery is a hardware failure.", "is_correct": False},
                {"text": "Crash-stop loses all data; crash-recovery loses only the last transaction.", "is_correct": False},
                {"text": "They describe the same event but at different levels of granularity.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a 'fencing token' and what problem does it solve?",
            "explanation": "A fencing token is a monotonically increasing number issued with each lock grant. Clients include it on every write request. Storage nodes reject any write with a token lower than the highest seen. This prevents a 'zombie' leader — one that still believes it holds the lock after a new leader was elected — from corrupting data.",
            "choices": [
                {"text": "A monotonically increasing number that prevents an expired lock holder from writing after a new leader is elected.", "is_correct": True},
                {"text": "A cryptographic token that authenticates requests between distributed nodes.", "is_correct": False},
                {"text": "A counter tracking how many times a partition has been rebalanced.", "is_correct": False},
                {"text": "A token passed between nodes to coordinate which handles the next request.", "is_correct": False},
            ],
        },
    ],

    "consistency-and-consensus": [
        {
            "prompt": "What does 'linearizability' guarantee, and how does it differ from 'serializability'?",
            "explanation": "Linearizability (recency guarantee): once a write completes, all subsequent reads see the new value — the system appears as a single copy. Serializability (isolation guarantee): concurrent transactions appear to execute in some serial order. They are orthogonal: you can have one without the other.",
            "choices": [
                {"text": "Linearizability: reads see the latest write (single-copy illusion). Serializability: transactions appear in a serial order. They are orthogonal.", "is_correct": True},
                {"text": "They are the same concept with different names used in different communities.", "is_correct": False},
                {"text": "Serializability is strictly stronger and implies linearizability.", "is_correct": False},
                {"text": "Linearizability applies to transactions; serializability applies to individual operations.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does the CAP theorem actually say, and what is its most important practical implication?",
            "explanation": "CAP: during a network Partition you must choose between Consistency (linearizability) and Availability (responding to every request). Since real networks do partition, you must decide which property to sacrifice. 'CA without P' is not a real option for distributed systems.",
            "choices": [
                {"text": "During a partition you must choose between consistency and availability — 'CA without P' is not a real distributed-system option.", "is_correct": True},
                {"text": "You can never have both consistency and availability in a distributed system.", "is_correct": False},
                {"text": "Consistency, availability, and performance are the three things you trade off.", "is_correct": False},
                {"text": "Using enough replicas lets you achieve all three (C, A, P) simultaneously.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a Lamport timestamp (logical clock) and what ordering property does it provide?",
            "explanation": "A Lamport timestamp is a counter incremented with each event. If event A causally precedes B, then ts(A) < ts(B). But the converse doesn't hold: two unrelated events might have ts(X) < ts(Y) without any causal link. Lamport clocks capture causal ordering, not wall-clock time.",
            "choices": [
                {"text": "A counter that captures causal ordering: if A → B then ts(A) < ts(B), but not the reverse.", "is_correct": True},
                {"text": "A clock synchronized via NTP that provides millisecond-accurate distributed timestamps.", "is_correct": False},
                {"text": "A vector of per-node clocks that captures all concurrent events.", "is_correct": False},
                {"text": "A global sequence number issued by a single coordinator node.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does the Raft consensus algorithm guarantee, and when does it make progress?",
            "explanation": "Raft guarantees: a single elected leader, and all committed log entries appear on all nodes in the same order. It makes progress (liveness) when a majority of nodes can communicate. It prioritizes safety over availability — during a partition with no majority, it stops accepting writes.",
            "choices": [
                {"text": "A single agreed-upon log with one leader; progress is guaranteed as long as a majority of nodes can communicate.", "is_correct": True},
                {"text": "Every node always has an identical copy of data, even during network partitions.", "is_correct": False},
                {"text": "Zero-downtime leader elections, ensuring no writes are ever rejected.", "is_correct": False},
                {"text": "Leaderless consensus using a voting round for each individual operation.", "is_correct": False},
            ],
        },
        {
            "prompt": "Why does requiring linearizability come at a high cost in distributed systems?",
            "explanation": "Linearizability requires that reads reflect the latest write, which means stale replicas can't serve reads and writes must be acknowledged by a quorum. During a network partition, a linearizable system must refuse requests on the minority side rather than serve potentially stale data — sacrificing availability.",
            "choices": [
                {"text": "It requires cross-node coordination, hurts latency, and forces the system to sacrifice availability during partitions.", "is_correct": True},
                {"text": "It requires storing multiple versions of every record.", "is_correct": False},
                {"text": "It serializes all writes globally so only one write proceeds at a time.", "is_correct": False},
                {"text": "It needs a global lock manager that becomes a single point of failure.", "is_correct": False},
            ],
        },
    ],

    "batch-processing": [
        {
            "prompt": "What Unix philosophy did MapReduce inherit, and why does it matter for large-scale data processing?",
            "explanation": "Unix programs: do one thing well, communicate via stdin/stdout, compose via pipes. MapReduce: each job does one transformation; jobs chain via HDFS files. This composability makes jobs debuggable, retryable independently, and reusable.",
            "choices": [
                {"text": "Programs do one thing well and compose via uniform interfaces (files/stdin/stdout) — making jobs composable, retryable, and debuggable.", "is_correct": True},
                {"text": "Programs should be written in C for maximum performance on large datasets.", "is_correct": False},
                {"text": "Each program automatically parallelizes by using all available CPU cores.", "is_correct": False},
                {"text": "Programs share mutable state via a central file system for coordination.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a MapReduce 'combiner' and what problem does it solve?",
            "explanation": "A combiner is a local mini-reduce that runs on each mapper before the shuffle. For commutative/associative operations (e.g., counts, sums), it partially aggregates data locally, reducing the volume of data sent over the network during the shuffle — the most expensive MapReduce phase.",
            "choices": [
                {"text": "A local pre-aggregation step on each mapper that reduces data sent over the network during the shuffle.", "is_correct": True},
                {"text": "A process that merges the output of multiple MapReduce jobs into a single result.", "is_correct": False},
                {"text": "A fault-tolerance mechanism that re-runs failed reduce tasks on a different node.", "is_correct": False},
                {"text": "A tool that combines small input files into a single split for a mapper.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the key performance advantage of dataflow engines (Spark) over MapReduce?",
            "explanation": "MapReduce materializes (writes to disk) all intermediate state between every map and reduce stage. Spark builds a DAG of operations and keeps intermediate results in memory when possible, avoiding many expensive disk round-trips for multi-stage pipelines.",
            "choices": [
                {"text": "They avoid materializing all intermediate state to disk between stages, keeping results in memory when possible.", "is_correct": True},
                {"text": "They support real-time streaming, which MapReduce fundamentally cannot do.", "is_correct": False},
                {"text": "They are simpler to program because they drop the map/reduce paradigm entirely.", "is_correct": False},
                {"text": "They use less memory by streaming data through without buffering.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a 'sort-merge join' in batch processing and when is it preferred?",
            "explanation": "Both input datasets are sorted by the join key, then merged in a single sequential pass (like a zipper). Unlike hash joins, it doesn't require holding an entire dataset in memory, making it preferable when both datasets are large or when the data is already sorted.",
            "choices": [
                {"text": "Both inputs are sorted by join key, then merged in one sequential pass — efficient for large datasets without hash table memory pressure.", "is_correct": True},
                {"text": "The smaller dataset is sorted into the larger one sequentially.", "is_correct": False},
                {"text": "Sort outputs from different nodes are merged at a central reducer.", "is_correct": False},
                {"text": "A join that exploits MapReduce's implicit sort to avoid writing a custom comparator.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the 'skew' problem in batch processing and how is it typically addressed?",
            "explanation": "Skew: some keys are much more frequent than others (e.g., a celebrity user), so a few reduce tasks receive disproportionately large amounts of data and become stragglers. Common mitigations: salting (append a random suffix to hot keys, split across multiple reducers, then merge) or two-stage aggregation.",
            "choices": [
                {"text": "Hot keys cause some reduce tasks to receive far more data, creating stragglers. Mitigated by salting hot keys or two-stage aggregation.", "is_correct": True},
                {"text": "Data is unevenly distributed across time, causing some partitions to be much larger.", "is_correct": False},
                {"text": "Map tasks finish at different speeds because some input files are larger.", "is_correct": False},
                {"text": "Alphabetical key distribution causes uneven load in the sort phase.", "is_correct": False},
            ],
        },
    ],

    "stream-processing": [
        {
            "prompt": "What is 'event sourcing' and what is its key advantage over storing current state?",
            "explanation": "Event sourcing stores every state change as an immutable event in a log; current state is derived by replaying events. Advantages: full audit trail, temporal queries (state at time T), easy debugging, and the ability to build new derived views by replaying the log.",
            "choices": [
                {"text": "Storing every change as an immutable event log; enables full audit trails, temporal queries, and rebuilding derived views.", "is_correct": True},
                {"text": "Sourcing events from an external system to trigger database writes.", "is_correct": False},
                {"text": "Using events instead of synchronous HTTP calls between microservices.", "is_correct": False},
                {"text": "Logging API requests for security auditing.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the practical difference between 'at-least-once' and 'exactly-once' processing semantics?",
            "explanation": "At-least-once: messages are never lost but may be re-delivered and processed multiple times. Exactly-once: each message is processed exactly one time. True exactly-once is expensive (requires distributed transactions or idempotency checks). In practice, idempotent at-least-once processing achieves the same visible effect.",
            "choices": [
                {"text": "At-least-once may produce duplicates; exactly-once avoids them, typically via idempotent operations or transactions.", "is_correct": True},
                {"text": "At-least-once is stronger because it guarantees every message is delivered.", "is_correct": False},
                {"text": "Exactly-once means each message is processed in under one millisecond.", "is_correct": False},
                {"text": "They are equivalent in practice because duplicate events have no real-world effect.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a 'watermark' in stream processing and why is it needed?",
            "explanation": "A watermark is a timestamp threshold signaling that all events with timestamps ≤ T have been received. Events arrive out of order (a mobile app sends delayed events when it reconnects). The processor uses the watermark to decide when it's safe to close a time window and emit results despite late arrivals.",
            "choices": [
                {"text": "A timestamp threshold signaling all events up to time T have arrived; used to close time windows despite out-of-order events.", "is_correct": True},
                {"text": "A checkpoint marker that triggers a durable state snapshot for fault recovery.", "is_correct": False},
                {"text": "A rate limiter that pauses processing when the input stream is too fast.", "is_correct": False},
                {"text": "A message that marks the boundary between two Kafka topic partitions.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is a 'stream-table join' and what problem does it solve?",
            "explanation": "A stream-table join enriches each stream event with data from a slowly-changing lookup table (e.g., joining a click-stream with user profiles). The processor keeps the table in local state and looks up each event locally, avoiding expensive remote database calls per event.",
            "choices": [
                {"text": "Enriching each stream event with data from a slowly-changing reference table kept in local processor state.", "is_correct": True},
                {"text": "Joining two high-throughput event streams on a common key in real time.", "is_correct": False},
                {"text": "Converting a batch table into a streaming format for incremental processing.", "is_correct": False},
                {"text": "Filtering stream events based on membership in a database table.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is CQRS (Command Query Responsibility Segregation) and why is it useful with event sourcing?",
            "explanation": "CQRS separates write operations (commands that mutate state) from read operations (queries over projections). Combined with event sourcing, the event log is the write model; multiple read models are derived asynchronously from events, each optimized for a different query pattern.",
            "choices": [
                {"text": "Separating write operations (commands) from read operations (queries), each with its own independently optimized model.", "is_correct": True},
                {"text": "Using a different physical database for read replicas versus the write primary.", "is_correct": False},
                {"text": "Caching query results to avoid re-querying the command database.", "is_correct": False},
                {"text": "A microservices pattern where one service handles reads and another handles writes.", "is_correct": False},
            ],
        },
    ],

    "future-of-data-systems": [
        {
            "prompt": "What is the 'lambda architecture' and what tension does it try to resolve?",
            "explanation": "Lambda architecture: a batch layer (accurate, slow — reprocesses all historical data) plus a speed layer (approximate, fast — handles recent data only). It resolves the tension between latency and correctness: the speed layer gives low-latency results; the batch layer corrects them over time.",
            "choices": [
                {"text": "A dual-layer design combining accurate batch processing and low-latency stream processing to balance freshness and correctness.", "is_correct": True},
                {"text": "A serverless architecture pattern using AWS Lambda for event-driven data processing.", "is_correct": False},
                {"text": "A three-tier architecture: ingestion, processing, and serving layers.", "is_correct": False},
                {"text": "A stream-only architecture that eliminates batch processing entirely.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does 'unbundling the database' mean in DDIA's final chapter?",
            "explanation": "Traditional databases bundle storage, indexing, caching, replication, transactions, and a query engine into one system. 'Unbundling' means using purpose-built tools for each function (Kafka for durable log, Elasticsearch for search, Redis for caching, Flink for stream processing) and wiring them together explicitly.",
            "choices": [
                {"text": "Using specialized tools (Kafka, Elasticsearch, Redis, Flink) for each database function and composing them explicitly.", "is_correct": True},
                {"text": "Breaking a monolithic application into microservices each with its own database.", "is_correct": False},
                {"text": "Separating the storage engine from the query engine for independent scaling.", "is_correct": False},
                {"text": "Removing ACID guarantees from a database to gain higher performance.", "is_correct": False},
            ],
        },
        {
            "prompt": "What is the distinction between 'system of record' and 'derived data'?",
            "explanation": "The system of record (source of truth) holds the authoritative version — what actually happened. Derived data (caches, search indexes, ML models, materialized views) is computed by transforming the source. Derived data can always be discarded and rebuilt from the system of record.",
            "choices": [
                {"text": "The system of record is authoritative; derived data is computed from it and can be rebuilt if lost.", "is_correct": True},
                {"text": "Derived data is more recent and accurate than the system of record.", "is_correct": False},
                {"text": "The system of record is always a relational database; derived data lives in NoSQL.", "is_correct": False},
                {"text": "They are the same — all data is ultimately derived from other data.", "is_correct": False},
            ],
        },
        {
            "prompt": "What does the 'end-to-end argument' suggest about where to enforce data correctness?",
            "explanation": "The end-to-end argument: guarantees provided by lower-level components (the network, the database) are insufficient on their own. The application must verify correctness at the endpoints (e.g., using idempotency keys for at-least-once delivery), because only the application understands its full correctness requirements.",
            "choices": [
                {"text": "Correctness must be verified at the application level; lower-level guarantees are necessary but not sufficient.", "is_correct": True},
                {"text": "End-to-end encryption provides sufficient data integrity for all applications.", "is_correct": False},
                {"text": "Every intermediate system should validate data independently before passing it downstream.", "is_correct": False},
                {"text": "Distributed transactions at the infrastructure level provide end-to-end correctness.", "is_correct": False},
            ],
        },
        {
            "prompt": "According to DDIA's conclusion, what is the relationship between 'reads' and 'writes' in the broader view of data systems?",
            "explanation": "DDIA's concluding insight: every read is a query over derived state; caches, indexes, and materialized views are all precomputed query results. The boundary between a 'database' and a 'stream processor' blurs — both transform inputs (writes) into derived outputs (read models).",
            "choices": [
                {"text": "Reads are queries over derived state; caches and indexes are precomputed results — the line between storage and streaming blurs.", "is_correct": True},
                {"text": "Writes are always more expensive than reads; systems should minimize writes.", "is_correct": False},
                {"text": "Reads and writes are independent; optimizing one doesn't affect the other.", "is_correct": False},
                {"text": "Writes create state permanently; reads are ephemeral and leave no trace.", "is_correct": False},
            ],
        },
    ],
}


def seed() -> None:
    conn = connect()
    init_schema(conn)

    for topic in TOPICS:
        conn.execute(
            """
            INSERT INTO sd_topics (slug, title, description, chapter_num, part_num, position_order, prerequisites)
            VALUES (:slug, :title, :description, :chapter_num, :part_num, :position_order, :prerequisites)
            ON CONFLICT(slug) DO UPDATE SET
                title = excluded.title,
                description = excluded.description,
                chapter_num = excluded.chapter_num,
                part_num = excluded.part_num,
                position_order = excluded.position_order,
                prerequisites = excluded.prerequisites
            """,
            topic,
        )
        conn.commit()

        topic_row = conn.execute(
            "SELECT id FROM sd_topics WHERE slug = ?", (topic["slug"],)
        ).fetchone()
        topic_id = topic_row["id"]

        # Remove old questions/choices for this topic so re-running is idempotent
        conn.execute("DELETE FROM sd_questions WHERE topic_id = ?", (topic_id,))
        conn.commit()

        for q in QUESTIONS.get(topic["slug"], []):
            cur = conn.execute(
                "INSERT INTO sd_questions (topic_id, prompt, explanation) VALUES (?, ?, ?)",
                (topic_id, q["prompt"], q["explanation"]),
            )
            question_id = cur.lastrowid
            for c in q["choices"]:
                conn.execute(
                    "INSERT INTO sd_choices (question_id, text, is_correct) VALUES (?, ?, ?)",
                    (question_id, c["text"], 1 if c["is_correct"] else 0),
                )
        conn.commit()

    conn.close()
    print(f"Seeded {len(TOPICS)} topics with {sum(len(v) for v in QUESTIONS.values())} questions.")


if __name__ == "__main__":
    seed()
