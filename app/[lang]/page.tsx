import Image from "next/image";
import { getDictionary } from '@/lib/dictionary';
import { PortfolioFeed } from '@/components/portfolio-feed';

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'pt' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-24 px-4 bg-white dark:bg-zinc-950 sm:items-start sm:px-16">
        <div className="flex flex-col items-center gap-12 sm:items-start sm:gap-20 w-full mb-16">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              {dict.hero.title}
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {dict.hero.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
            >
              {dict.hero.cta}
            </button>
          </div>
        </div>
        
        <PortfolioFeed lang={lang} dict={dict} />
      </main>
    </div>
  );
}
