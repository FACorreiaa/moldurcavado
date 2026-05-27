'use server';
import { db } from '@/db';
import { likes, comments } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

export async function addComment(itemId: string, formData: FormData) {
  const content = formData.get('content') as string;
  const guestName = (formData.get('guestName') as string) || 'Anonymous';

  if (!content) return { error: 'Content is required' };

  await db.insert(comments).values({ itemId, guestName, content });
  
  revalidatePath('/');
}
