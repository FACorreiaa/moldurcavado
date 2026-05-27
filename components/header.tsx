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

  const toggleLang = () => {
    return pathname.replace(`/${lang}`, `/${lang === 'en' ? 'pt' : 'en'}`);
  };

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="font-bold">Moldurcavado</div>
        <nav className="flex gap-4 items-center">
          <Link href="#about">{dict.nav.about}</Link>
          <Link href="#services">{dict.nav.services}</Link>
          <Link href="#portfolio">{dict.nav.portfolio}</Link>
          <div className="flex items-center w-6 justify-center">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            ) : (
              <span className="invisible">🌙</span>
            )}
          </div>
          <Link href={toggleLang()} className="font-medium">
            {lang === 'en' ? 'PT' : 'EN'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
