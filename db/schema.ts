import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageUrl: text('image_url').notNull(),
  descriptionPt: text('description_pt').notNull(),
  descriptionEn: text('description_en').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolioItemsRelations = relations(portfolioItems, ({ many, one }) => ({
  comments: many(comments),
  likes: one(likes, {
    fields: [portfolioItems.id],
    references: [likes.itemId],
  }),
}));

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

export const commentsRelations = relations(comments, ({ one }) => ({
  item: one(portfolioItems, {
    fields: [comments.itemId],
    references: [portfolioItems.id],
  }),
}));

export const likes = pgTable('likes', {
  itemId: uuid('item_id').references(() => portfolioItems.id, { onDelete: 'cascade' }).primaryKey(),
  likesCount: integer('likes_count').default(0).notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  item: one(portfolioItems, {
    fields: [likes.itemId],
    references: [portfolioItems.id],
  }),
}));
