import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { PortfolioItem } from './portfolio-item';

type PortfolioDict = {
  nav: { portfolio: string };
  portfolio?: { subtitle?: string; empty?: string };
};

export async function PortfolioFeed({ lang, dict }: { lang: string; dict: PortfolioDict }) {
  const items = await db.query.portfolioItems.findMany({
    orderBy: [desc(portfolioItems.createdAt)],
    with: {
      likes: true,
    },
  });

  const formattedItems = items.map((item) => ({
    ...item,
    likesCount: item.likes?.likesCount ?? 0,
  }));

  const subtitle =
    dict.portfolio?.subtitle ??
    (lang === 'en'
      ? 'A selection of our recent framing work.'
      : 'Uma seleção dos nossos trabalhos recentes.');

  const emptyLabel =
    dict.portfolio?.empty ??
    (lang === 'en' ? 'No portfolio items yet — check back soon.' : 'Ainda sem trabalhos publicados — volte em breve.');

  return (
    <section id="portfolio" className="w-full py-16 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 mb-8 sm:mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{dict.nav.portfolio}</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {formattedItems.map((item) => (
            <PortfolioItem key={item.id} item={item} lang={lang} />
          ))}
        </div>
        {formattedItems.length === 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">{emptyLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}
