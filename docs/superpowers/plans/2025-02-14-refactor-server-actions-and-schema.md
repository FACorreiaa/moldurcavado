# Refactor Server Actions and Database Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve database performance with an index and harden server actions with validation, error handling, and standardized return types.

**Architecture:** Add a PostgreSQL index to the `comments` table. Refactor server actions in `app/actions/portfolio.ts` to use `try/catch`, validate input length, and return a consistent `{ success, data, error }` shape.

**Tech Stack:** Next.js Server Actions, Drizzle ORM, PostgreSQL.

---

### Task 1: Add Index to `comments.itemId`

**Files:**
- Modify: `db/schema.ts`

- [ ] **Step 1: Add index to `itemId` in `comments` table**

```typescript
import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core';

// ... (existing code)

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id').references(() => portfolioItems.id, { onDelete: 'cascade' }).notNull(),
  guestName: text('guest_name').default('Anonymous').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    itemIdIdx: index('item_id_idx').on(table.itemId),
  };
});
```

- [ ] **Step 2: Verify Drizzle schema**

Run: `pnpm drizzle-kit check` (or similar lint/check if available)

- [ ] **Step 3: Commit**

```bash
git add db/schema.ts
git commit -m "refactor(db): add index to comments.itemId"
```

---

### Task 2: Refactor `toggleLike` Server Action

**Files:**
- Modify: `app/actions/portfolio.ts`

- [ ] **Step 1: Update `toggleLike` with try/catch and standardized return**

```typescript
export async function toggleLike(itemId: string) {
  try {
    await db
      .insert(likes)
      .values({ itemId, likesCount: 1 })
      .onConflictDoUpdate({
        target: likes.itemId,
        set: { likesCount: sql`${likes.likesCount} + 1` },
      });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return { success: false, error: 'Failed to update like count' };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/actions/portfolio.ts
git commit -m "refactor(actions): improve toggleLike with error handling"
```

---

### Task 3: Refactor `addComment` Server Action

**Files:**
- Modify: `app/actions/portfolio.ts`

- [ ] **Step 1: Update `addComment` with validation, try/catch, and standardized return**

```typescript
export async function addComment(itemId: string, formData: FormData) {
  const content = formData.get('content') as string;
  const guestName = (formData.get('guestName') as string) || 'Anonymous';

  if (!content) {
    return { success: false, error: 'Content is required' };
  }

  if (content.length > 500) {
    return { success: false, error: 'Comment is too long (max 500 chars)' };
  }

  try {
    await db.insert(comments).values({ itemId, guestName, content });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error: 'Failed to post comment' };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/actions/portfolio.ts
git commit -m "refactor(actions): improve addComment with validation and error handling"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Build the project to ensure no type errors**

Run: `pnpm build` or `npx tsc --noEmit`

- [ ] **Step 2: Final Commit**

```bash
git add .
git commit --amend --no-edit # Or just verify git status is clean
```
