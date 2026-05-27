'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export function Header({ dict, lang }: { dict: { nav: { portfolio: string } }; lang: string }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleLang = () => {
    return pathname.replace(`/${lang}`, `/${lang === 'en' ? 'pt' : 'en'}`);
  };

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="font-bold">Moldurcavado</div>
        <nav className="flex gap-4 items-center">
          <Link href="#portfolio">{dict.nav.portfolio}</Link>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <Link href={toggleLang()} className="font-medium">
            {lang === 'en' ? 'PT' : 'EN'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
