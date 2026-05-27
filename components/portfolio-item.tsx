'use client';
import { useActionState, startTransition } from 'react';
import { toggleLike, addComment } from '@/app/actions/portfolio';
import Image from 'next/image';

interface Comment {
  id: string;
  guestName: string;
  content: string;
}

interface PortfolioItemData {
  id: string;
  imageUrl: string;
  descriptionPt: string;
  descriptionEn: string;
  likesCount: number;
  comments: Comment[];
}

export function PortfolioItem({ item, lang, dict }: { item: PortfolioItemData, lang: string, dict: any }) {
  const desc = lang === 'en' ? item.descriptionEn : item.descriptionPt;

  const [, commentAction, isPending] = useActionState(
    async (_prev: any, formData: FormData) => {
      return await addComment(item.id, formData);
    },
    null
  );
  
  return (
    <article className="max-w-xl mx-auto border rounded-xl overflow-hidden bg-card mb-8 shadow-sm">
      <div className="relative aspect-square">
        <Image 
          src={item.imageUrl} 
          alt={desc} 
          fill 
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover" 
          priority={false}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-2">
           <button 
             onClick={() => startTransition(async () => {
                await toggleLike(item.id);
             })}
             className="text-2xl hover:scale-110 transition-transform active:scale-95"
             aria-label="Like"
           >
             ❤️
           </button>
           <span className="font-bold">{item.likesCount} likes</span>
        </div>
        
        <p className="mb-4">
          <span className="font-bold">moldurcavado</span> {desc}
        </p>

        <div className="space-y-1 mb-4 text-sm max-h-40 overflow-y-auto">
          {item.comments.map((c: any) => (
            <div key={c.id}>
              <span className="font-bold">{c.guestName}</span> {c.content}
            </div>
          ))}
        </div>

        <form action={commentAction} className="flex gap-2 border-t pt-2">
          <input 
            name="guestName" 
            placeholder="Name (opt)" 
            className="bg-transparent text-sm focus:outline-none w-20 border-b border-transparent focus:border-muted-foreground"
            disabled={isPending}
          />
          <input 
            name="content" 
            placeholder="Add a comment..." 
            required 
            className="bg-transparent text-sm focus:outline-none flex-1"
            disabled={isPending}
          />
          <button 
            type="submit" 
            className="text-blue-500 font-bold text-sm hover:text-blue-600 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? '...' : 'Post'}
          </button>
        </form>
      </div>
    </article>
  );
}
