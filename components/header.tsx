'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Header({
  dict,
  lang,
}: {
  dict: { nav: { about: string; services: string; portfolio: string; contact: string } };
  lang: string;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLangHref = () => pathname.replace(`/${lang}`, `/${lang === 'en' ? 'pt' : 'en'}`);

  const langSwitchLabel = lang === 'en' ? 'Mudar para português' : 'Switch to English';
  const themeLabel =
    theme === 'dark'
      ? lang === 'en' ? 'Switch to light mode' : 'Mudar para modo claro'
      : lang === 'en' ? 'Switch to dark mode' : 'Mudar para modo escuro';

  const navLinkClass =
    'text-sm sm:text-base hover:text-primary transition-colors rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <Link
          href={`/${lang}`}
          className="font-bold tracking-tight rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Moldurcavado
        </Link>
        <nav className="flex gap-3 sm:gap-5 items-center" aria-label={lang === 'en' ? 'Main navigation' : 'Navegação principal'}>
          <Link href="#about" className={navLinkClass}>{dict.nav.about}</Link>
          <Link href="#services" className={navLinkClass}>{dict.nav.services}</Link>
          <Link href="#portfolio" className={navLinkClass}>{dict.nav.portfolio}</Link>
          <Link href="#contact" className={navLinkClass}>{dict.nav.contact}</Link>
          <div className="flex items-center w-6 justify-center">
            {mounted ? (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="cursor-pointer rounded-md p-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={themeLabel}
              >
                <span aria-hidden="true">{theme === 'dark' ? '🌞' : '🌙'}</span>
              </button>
            ) : (
              <span className="invisible" aria-hidden="true">🌙</span>
            )}
          </div>
          <Link
            href={toggleLangHref()}
            className="font-medium text-sm rounded-md px-1 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={langSwitchLabel}
          >
            {lang === 'en' ? 'PT' : 'EN'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
