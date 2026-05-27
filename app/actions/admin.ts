'use server';

import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function uploadPortfolioItem(formData: FormData) {
  const imageFile = formData.get('image') as File;
  const descriptionPt = formData.get('descriptionPt') as string;
  const descriptionEn = formData.get('descriptionEn') as string;

  if (!imageFile || !descriptionPt || !descriptionEn) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    });

    await db.insert(portfolioItems).values({
      imageUrl: blob.url,
      descriptionPt,
      descriptionEn,
    });

    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to upload portfolio item:', error);
    return { success: false, error: 'Failed to upload portfolio item' };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    const item = await db.query.portfolioItems.findFirst({
      where: eq(portfolioItems.id, id),
    });

    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    // Delete from Vercel Blob
    await del(item.imageUrl);

    // Delete from DB
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    return { success: false, error: 'Failed to delete portfolio item' };
  }
}
