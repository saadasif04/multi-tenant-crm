# Multi-Tenant CRM System

A minimal multi-tenant CRM system focused on **architecture, isolation, concurrency safety, and production-grade thinking** over feature complexity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Frontend | Next.js |
| Language | TypeScript (strict) |

---

## Architecture

The system follows a layered architecture with clear separation of concerns.

```
src/
├── auth/
├── customers/
├── users/
├── activity-logs/
├── prisma/
└── shared/
```

**Key design principles:**

- Controller → Service separation; business logic lives in services
- Prisma handles the DB access layer
- DTOs enforce input validation
- JWT-based authentication

---

## Multi-Tenancy

**Strategy: Row-Level Isolation**

Every core table includes an `organizationId` column, enforced across Customers, Users, Notes, and Activity Logs.

```ts
where: {
  organizationId: user.organizationId
}
```

**Isolation guarantee:** Users can only ever access their own organization's data. This is enforced at two layers:

1. The JWT token contains `organizationId`
2. Every query filters by `organizationId` — no global queries are permitted

---

## Concurrency Safety

**Problem:** Each user can have a maximum of 5 active customers assigned. Under simultaneous requests, a naive count-check can be bypassed.

**Solution:** Transaction-based assignment.

```ts
await this.prisma.$transaction(async (tx) => {
  const count = await tx.customer.count({
    where: { assignedToId }
  });

  if (count >= 5) throw new Error('Limit reached');

  return tx.customer.update(...);
});
```

> **⚠️ Limitation:** The `count → check → update` sequence is not fully atomic, so this reduces race risk but doesn't eliminate it under extreme concurrency.

**Production-grade improvement:** Use row-level locking (`SELECT ... FOR UPDATE`) or enforce the constraint via an atomic DB counter.

---

## Performance

### Indexing

Critical indexes are applied on:

- `organizationId`
- `email`
- `deletedAt`
- Composite columns used in frequent filters

### Query Optimization

- Direct Prisma joins to avoid N+1 queries
- `findMany` with filters instead of nested loops
- Only required fields are selected where possible

### Pagination

Cursor-based pagination is used throughout:

```ts
take: limit,
cursor: { id },
skip: 1
```

This outperforms offset pagination on large datasets (100k+ records) and remains stable as data grows.

---

## Soft Deletes

Customers use a `deletedAt` timestamp rather than hard deletion.

- Soft-deleted records are filtered out of normal queries
- Data is never physically removed
- Records can be restored at any time
- Provides a natural audit trail

---

## Logging & Error Monitoring

A global logging middleware provides production observability:

- Logs every API request (path, method, `userId`)
- Captures errors with full stack traces
- Provides a centralized audit trail for debugging

---

## Scaling Strategy

| Concern | Approach |
|---------|---------|
| Horizontal scaling | Stateless NestJS instances behind a load balancer |
| Database reads | Read replicas; partition by `organizationId` if needed |
| Caching | Redis for customer lists, user sessions, and org data |
| Background work | Queue-based processing for activity logs and notifications |

---

## Trade-offs

| Decision | Pro | Con |
|----------|-----|-----|
| Prisma transactions | Simple to use | Not fully atomic under extreme concurrency |
| Row-level isolation (vs. schema-per-tenant) | Easy migrations, simpler maintenance | Slightly weaker isolation |
| Soft deletes | Data safety, audit-friendly | Increases query complexity |

---

## Testing Strategy

**Frontend:** Parallel API calls with `Promise.allSettled` to simulate race conditions.

**Backend:** Transaction-based assignment tested under simultaneous requests.

---

## Key Outcomes

This system demonstrates:

- Multi-tenant architecture with row-level data isolation
- Safe concurrency handling via database transactions
- Scalable, modular backend structure
- Production-grade observability and error monitoring