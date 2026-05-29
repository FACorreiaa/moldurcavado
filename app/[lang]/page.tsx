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
        <section className="relative flex flex-col items-center py-20 sm:py-32 overflow-hidden rounded-[2rem] mt-8 border border-border/50 shadow-sm">
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner.jpg"
              alt=""
              role="presentation"
              fill
              className="object-cover opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-lighten"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-8 sm:gap-10 px-4">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground max-w-3xl leading-tight">
              {dict.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mt-4">
              <a
                href="#portfolio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {dict.hero.cta}
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border/60 bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-all hover:bg-muted/80 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {lang === 'en' ? 'Our Services' : 'Nossos Serviços'}
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-20 sm:py-32">
          <div className="flex flex-col gap-6 max-w-3xl mx-auto text-center items-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary/80 uppercase text-sm tracking-widest">{dict.nav.about}</h2>
            <p className="text-foreground text-xl sm:text-2xl leading-relaxed font-medium">
              {lang === 'en'
                ? "With decades of experience in the framing industry, Moldurcavado Molduras, Lda is dedicated to preserving and enhancing your most precious memories and artworks through high-quality wood frames and expert craftsmanship."
                : "Com décadas de experiência na indústria de molduras, a Moldurcavado Molduras, Lda dedica-se a preservar e realçar as suas memórias e obras de arte mais preciosas através de molduras de madeira de alta qualidade e perícia artesanal."}
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-20 sm:py-32 border-t border-border/40">
          <div className="flex flex-col gap-10 sm:gap-16">
            <div className="flex flex-col gap-4 max-w-2xl text-center mx-auto items-center">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{dict.nav.services}</h2>
              <p className="text-muted-foreground text-lg">
                {lang === 'en'
                  ? 'What we do — three crafts under one roof.'
                  : 'O que fazemos — três ofícios sob o mesmo teto.'}
              </p>
            </div>
            <div className="grid gap-6 sm:gap-10 md:grid-cols-3">
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
                  className="group flex flex-col rounded-2xl bg-card border border-border/30 overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] bg-muted/50 overflow-hidden">
                    <Image
                      src={s.src}
                      alt=""
                      role="presentation"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-screen"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-6 sm:p-8">
                    <span className="text-xs uppercase tracking-widest text-primary/70 font-semibold">
                      {s.category}
                    </span>
                    <h3 className="text-2xl font-semibold text-foreground">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{s.desc}</p>
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
