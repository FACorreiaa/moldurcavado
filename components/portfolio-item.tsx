'use client';
import { startTransition, useState } from 'react';
import { toggleLike } from '@/app/actions/portfolio';
import Image from 'next/image';

interface PortfolioItemData {
  id: string;
  imageUrl: string;
  descriptionPt: string;
  descriptionEn: string;
  likesCount: number;
}

export function PortfolioItem({ item, lang }: { item: PortfolioItemData; lang: string }) {
  const desc = lang === 'en' ? item.descriptionEn : item.descriptionPt;
  const altText = desc || (lang === 'en' ? 'Framed artwork by Moldurcavado' : 'Trabalho da Moldurcavado');

  const [optimisticLikes, setOptimisticLikes] = useState(item.likesCount);
  const [justLiked, setJustLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const likesLabel =
    optimisticLikes === 1
      ? lang === 'en' ? '1 like' : '1 gosto'
      : lang === 'en' ? `${optimisticLikes} likes` : `${optimisticLikes} gostos`;

  const handleLike = () => {
    setLikeError(null);
    setOptimisticLikes((n) => n + 1);
    setJustLiked(true);
    window.setTimeout(() => setJustLiked(false), 350);

    startTransition(async () => {
      const result = await toggleLike(item.id);
      if (!result.success) {
        setOptimisticLikes((n) => Math.max(0, n - 1));
        setLikeError(result.error || (lang === 'en' ? 'Failed to like' : 'Não foi possível registar o gosto'));
      }
    });
  };

  return (
    <article className="group border border-border rounded-2xl overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative aspect-[4/5] bg-muted">
        <Image
          src={item.imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={false}
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3">
        <button
          type="button"
          onClick={handleLike}
          aria-label={`${likesLabel}. ${lang === 'en' ? 'Click to like' : 'Clique para gostar'}`}
          className="group/like inline-flex items-center gap-2 rounded-full px-3 py-1.5 -ml-3 hover:bg-muted active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={[
              'h-6 w-6 transition-all duration-200',
              justLiked ? 'scale-125 fill-destructive text-destructive' : 'fill-none text-muted-foreground group-hover/like:text-destructive group-hover/like:fill-destructive/20',
            ].join(' ')}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-sm font-semibold tabular-nums">{likesLabel}</span>
        </button>

        {likeError && <span className="text-destructive text-xs">{likeError}</span>}
      </div>
    </article>
  );
}
