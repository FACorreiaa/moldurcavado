import Image from "next/image";
import { getDictionary } from '@/lib/dictionary';
import { PortfolioFeed } from '@/components/portfolio-feed';
import { ContactSection } from '@/components/contact-section';

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'pt' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main id="main" tabIndex={-1} className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center py-16 sm:py-24 overflow-hidden rounded-2xl mt-8 border border-border">
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner.jpg"
              alt=""
              role="presentation"
              fill
              className="object-cover opacity-25 dark:opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-8 px-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground max-w-2xl">
              {dict.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="#portfolio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {dict.hero.cta}
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {lang === 'en' ? 'Our Services' : 'Nossos Serviços'}
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-16 sm:py-24">
          <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{dict.nav.about}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {lang === 'en'
                ? "With decades of experience in the framing industry, Moldurcavado Molduras, Lda is dedicated to preserving and enhancing your most precious memories and artworks through high-quality wood frames and expert craftsmanship."
                : "Com décadas de experiência na indústria de molduras, a Moldurcavado Molduras, Lda dedica-se a preservar e realçar as suas memórias e obras de arte mais preciosas através de molduras de madeira de alta qualidade e perícia artesanal."}
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-16 sm:py-24 border-t border-border">
          <div className="flex flex-col gap-8 sm:gap-12">
            <div className="flex flex-col gap-3 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{dict.nav.services}</h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                {lang === 'en'
                  ? 'What we do — three crafts under one roof.'
                  : 'O que fazemos — três ofícios sob o mesmo teto.'}
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {[
                {
                  src: '/services/molduras.svg',
                  category: lang === 'en' ? 'Wood craftsmanship' : 'Artesanato em madeira',
                  title: lang === 'en' ? 'Molduras' : 'Molduras',
                  desc:
                    lang === 'en'
                      ? 'Artisan wood frames for every style — from classical mouldings to clean contemporary lines.'
                      : 'Molduras de madeira artesanais para qualquer estilo — do clássico ao contemporâneo.',
                },
                {
                  src: '/services/telas.svg',
                  category: lang === 'en' ? 'Canvas & stretchers' : 'Telas e grades',
                  title: lang === 'en' ? 'Telas' : 'Telas',
                  desc:
                    lang === 'en'
                      ? 'Custom canvas stretchers built to the exact dimensions your work needs, with stable, durable construction.'
                      : 'Grades para esticar tela feitas à medida exata, com construção estável e duradoura.',
                },
                {
                  src: '/services/vidros.svg',
                  category: lang === 'en' ? 'Glass & finishing' : 'Vidros e acabamentos',
                  title: lang === 'en' ? 'Vidros' : 'Vidros',
                  desc:
                    lang === 'en'
                      ? 'Cut-to-size glass — clear, anti-reflective, and museum-grade — to protect and showcase your art.'
                      : 'Vidros cortados à medida — transparente, antirreflexo ou de museu — para proteger e valorizar a sua arte.',
                },
              ].map((s) => (
                <article
                  key={s.title}
                  className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:border-accent/60 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    <Image
                      src={s.src}
                      alt=""
                      role="presentation"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-5 sm:p-6">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {s.category}
                    </span>
                    <h3 className="text-xl font-bold text-card-foreground">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{s.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PortfolioFeed lang={lang} dict={dict} />

        <ContactSection lang={lang} dict={dict} />
      </main>
    </div>
  );
}
