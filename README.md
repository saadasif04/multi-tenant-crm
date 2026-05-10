# 🧩 Multi-Tenant CRM System

A minimal **multi-tenant CRM system** built with:

- NestJS (Backend)
- Prisma ORM
- PostgreSQL (Neon)
- Next.js (Frontend)
- TypeScript (strict)

The system focuses on **architecture, isolation, concurrency safety, and production thinking** over feature complexity.

---

# 🏗️ Architecture Decisions

The system follows a **layered architecture**:

### Backend Structure

src/
├── auth/
├── customers/
├── users/
├── activity-logs/
├── prisma/
├── shared/


### Key Design Principles
- Controller → Service separation
- Business logic lives in services
- Prisma handles DB access layer
- DTOs enforce validation
- JWT-based authentication

### Why this architecture?
- Keeps code modular and testable
- Easy to scale per feature module
- Clean separation of concerns
- Suitable for production NestJS apps

---

# 🏢 Multi-Tenancy Isolation

## Strategy: Row-Level Isolation

Every core table includes:


organizationId


### Enforced in:
- Customers
- Users
- Notes
- Activity Logs

### Example rule:
```ts
where: {
  organizationId: user.organizationId
}
🔒 Isolation Guarantee

Users can ONLY access:

Their own organization’s data
Never cross-org records
Security enforcement layers:
JWT contains organizationId
Every query filters by organizationId
No global queries allowed without org filter
⚡ Concurrency Safety (Race Condition Handling)
Problem

Each user can have a maximum of 5 active customers assigned.

Risk

Multiple requests hitting simultaneously can bypass simple checks.

Solution Used
1. Transaction-based assignment
await this.prisma.$transaction(async (tx) => {
  const count = await tx.customer.count({
    where: { assignedToId }
  });

  if (count >= 5) throw new Error('Limit reached');

  return tx.customer.update(...)
});
⚠️ Limitation (Important)

This reduces race risk but is not fully bulletproof under extreme concurrency because:

count → check → update is not atomic
🧠 Production-grade improvement (recommended)

To make it fully race-proof:

Use row-level locking (SELECT ... FOR UPDATE)
Or enforce DB constraints / atomic counters
📊 Performance Strategy
1. Indexing

Critical indexes added:

organizationId
email
deletedAt
composite queries for filtering
2. Query optimization
Avoid N+1 queries by direct Prisma joins
Use findMany with filters instead of nested loops
Select only required fields where needed
3. Pagination

Cursor-based pagination:

take: limit,
cursor: { id },
skip: 1
Why?
Better performance than offset pagination
Stable under large datasets (100k+ records)
📦 Soft Delete Strategy

Customers use:

deletedAt
Behavior:
Soft deleted customers are hidden in normal queries
Data is never physically deleted
Can be restored anytime
🚀 Scaling Strategy

To scale this system:

1. Horizontal scaling
Stateless backend (NestJS)
Multiple API instances behind load balancer
2. Database scaling
Read replicas for heavy reads
Partitioning by organizationId if needed
3. Caching layer
Redis for:
customer lists
user sessions
frequently accessed org data
4. Queue system
Activity logs → background processing
Notifications → async workers
⚖️ Trade-offs Made
1. Prisma transactions

✔ Easy to use
❌ Not fully atomic under extreme concurrency

2. Row-level isolation (instead of DB schemas)

✔ Simple to maintain
✔ Easier migrations
❌ Slightly weaker isolation than schema-per-tenant

3. Soft delete

✔ Data safety
✔ Audit-friendly
❌ Increased query complexity

🚀 Production Improvement (Implemented Choice)
📌 Logging + Error Monitoring Middleware

A global logging layer was added to:

Track all API requests
Capture errors centrally
Improve debugging in production
Benefits:
Observability of system behavior
Easier production debugging
Audit trail for requests
Example:
Logs request path, method, userId
Logs errors with stack trace
🧪 Testing Strategy
Frontend Testing
Parallel API calls simulate race conditions
Promise.allSettled used for concurrency simulation
Backend Testing
Transaction-based assignment tested under simultaneous requests
🧠 Key Learning Outcome

This system demonstrates:

Multi-tenant architecture design
Safe concurrency handling
Scalable backend structure
Production-grade thinking in a minimal CRM system
]