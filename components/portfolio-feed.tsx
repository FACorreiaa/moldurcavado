import { db } from '@/db';
import { portfolioItems, comments } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { PortfolioItem } from './portfolio-item';

export async function PortfolioFeed({ lang, dict }: { lang: string, dict: { nav: { portfolio: string } } }) {
  const items = await db.query.portfolioItems.findMany({
    orderBy: [desc(portfolioItems.createdAt)],
    with: {
      comments: {
        orderBy: [desc(comments.createdAt)],
      },
      likes: true,
    }
  });

  // Map data to include likesCount
  const formattedItems = items.map(item => ({
    ...item,
    likesCount: item.likes?.likesCount ?? 0,
  }));

  return (
    <section id="portfolio" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{dict.nav.portfolio}</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {formattedItems.map(item => (
              <PortfolioItem key={item.id} item={item} lang={lang} />
            ))}
          </div>
          {formattedItems.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">No portfolio items found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
