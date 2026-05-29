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
    <section id="portfolio" className="w-full py-20 sm:py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-10 sm:mb-16 text-center items-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{dict.nav.portfolio}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {formattedItems.map((item) => (
            <PortfolioItem key={item.id} item={item} lang={lang} />
          ))}
        </div>
        {formattedItems.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border/50 bg-muted/30 p-12 text-center shadow-sm">
            <p className="text-muted-foreground font-medium">{emptyLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}
