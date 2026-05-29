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
    'relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm';
  const underlineSpan = <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-5xl">
        <Link
          href={`/${lang}`}
          className="font-semibold tracking-wide text-lg text-foreground hover:opacity-80 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Moldurcavado
        </Link>
        <nav className="flex gap-4 sm:gap-6 items-center" aria-label={lang === 'en' ? 'Main navigation' : 'Navegação principal'}>
          <Link href="#about" className={navLinkClass}>
            {dict.nav.about}
            {underlineSpan}
          </Link>
          <Link href="#services" className={navLinkClass}>
            {dict.nav.services}
            {underlineSpan}
          </Link>
          <Link href="#portfolio" className={navLinkClass}>
            {dict.nav.portfolio}
            {underlineSpan}
          </Link>
          <Link href="#contact" className={navLinkClass}>
            {dict.nav.contact}
            {underlineSpan}
          </Link>
          <div className="flex items-center w-6 justify-center ml-2 border-l border-border/50 pl-6 h-6">
            {mounted ? (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1"
                aria-label={themeLabel}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
              </button>
            ) : (
              <span className="invisible" aria-hidden="true">☾</span>
            )}
          </div>
          <Link
            href={toggleLangHref()}
            className="font-medium text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1 ml-1"
            aria-label={langSwitchLabel}
          >
            {lang === 'en' ? 'PT' : 'EN'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
