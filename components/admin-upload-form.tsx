'use client';

import { useActionState } from 'react';
import { uploadPortfolioItem } from '@/app/actions/admin';

const initialState = {
  success: false,
  error: '',
};

export function AdminUploadForm() {
  const [state, action, isPending] = useActionState(uploadPortfolioItem, initialState);

  return (
    <form action={action} className="flex flex-col gap-4 p-4 border rounded-lg bg-card text-card-foreground">
      <h2 className="text-xl font-bold">Upload New Work</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="font-medium">Image</label>
        <input 
          type="file" 
          id="image" 
          name="image" 
          accept="image/*" 
          required 
          className="p-2 border rounded bg-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="descriptionPt" className="font-medium">Description (PT)</label>
        <textarea 
          id="descriptionPt" 
          name="descriptionPt" 
          required 
          className="p-2 border rounded bg-background min-h-[100px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="descriptionEn" className="font-medium">Description (EN)</label>
        <textarea 
          id="descriptionEn" 
          name="descriptionEn" 
          required 
          className="p-2 border rounded bg-background min-h-[100px]"
        />
      </div>

      {state.error && <p className="text-destructive text-sm font-medium">{state.error}</p>}
      {state.success && <p className="text-green-600 text-sm font-medium">Successfully uploaded!</p>}

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 p-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : 'Upload Item'}
      </button>
    </form>
  );
}
