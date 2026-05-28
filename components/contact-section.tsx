import { ContactForm, type ContactFormDict } from './contact-form';

interface ContactInfoEntry {
  label: string;
  value: string;
  href?: string;
}

export interface ContactDict {
  contact?: {
    title?: string;
    subtitle?: string;
    info?: {
      heading?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      address?: string;
      hours?: string;
      emailValue?: string;
      phoneValue?: string;
      mobileValue?: string;
      addressValue?: string;
      hoursValue?: string;
    };
    form?: ContactFormDict & { heading?: string };
  };
}

function buildInfo(lang: string, dict: ContactDict): ContactInfoEntry[] {
  const info = dict.contact?.info ?? {};
  const fallback = lang === 'en'
    ? {
        email: 'Email',
        phone: 'Phone',
        mobile: 'Mobile',
        address: 'Address',
        hours: 'Hours',
      }
    : {
        email: 'Email',
        phone: 'Telefone',
        mobile: 'Telemóvel',
        address: 'Morada',
        hours: 'Horário',
      };

  const emailValue = info.emailValue || 'info@moldurcavado.pt';
  const phoneValue = info.phoneValue || '+351 000 000 000';
  const mobileValue = info.mobileValue || '+351 900 000 000';
  const addressValue = info.addressValue || (lang === 'en' ? 'Address coming soon' : 'Morada em breve');
  const hoursValue =
    info.hoursValue ||
    (lang === 'en' ? 'Mon–Fri · 9:00–18:00' : 'Seg–Sex · 9:00–18:00');

  const telHref = (v: string) => `tel:${v.replace(/[^+\d]/g, '')}`;

  return [
    { label: info.email || fallback.email, value: emailValue, href: `mailto:${emailValue}` },
    { label: info.phone || fallback.phone, value: phoneValue, href: telHref(phoneValue) },
    { label: info.mobile || fallback.mobile, value: mobileValue, href: telHref(mobileValue) },
    { label: info.address || fallback.address, value: addressValue },
    { label: info.hours || fallback.hours, value: hoursValue },
  ];
}

const ICONS: Record<number, string> = {
  0: '✉️',
  1: '📞',
  2: '📱',
  3: '📍',
  4: '🕒',
};

export function ContactSection({ lang, dict }: { lang: string; dict: ContactDict }) {
  const title = dict.contact?.title || (lang === 'en' ? 'Contact' : 'Contactos');
  const subtitle =
    dict.contact?.subtitle ||
    (lang === 'en'
      ? 'Have a project in mind? Send us a message — we usually reply within one business day.'
      : 'Tem um projeto em mente? Envie-nos uma mensagem — respondemos normalmente em um dia útil.');

  const infoHeading = dict.contact?.info?.heading || (lang === 'en' ? 'Get in touch' : 'Como nos contactar');
  const formHeading = dict.contact?.form?.heading || (lang === 'en' ? 'Send a message' : 'Enviar mensagem');

  const formDict: ContactFormDict = {
    name: dict.contact?.form?.name || (lang === 'en' ? 'Name' : 'Nome'),
    email: dict.contact?.form?.email || 'Email',
    phone: dict.contact?.form?.phone || (lang === 'en' ? 'Phone (optional)' : 'Telefone (opcional)'),
    subject: dict.contact?.form?.subject || (lang === 'en' ? 'Subject (optional)' : 'Assunto (opcional)'),
    message: dict.contact?.form?.message || (lang === 'en' ? 'Message' : 'Mensagem'),
    submit: dict.contact?.form?.submit || (lang === 'en' ? 'Send message' : 'Enviar mensagem'),
    submitting: dict.contact?.form?.submitting || (lang === 'en' ? 'Sending…' : 'A enviar…'),
    success:
      dict.contact?.form?.success ||
      (lang === 'en'
        ? "Thanks — your message was sent. We'll reply soon."
        : 'Obrigado — a sua mensagem foi enviada. Responderemos em breve.'),
  };

  const entries = buildInfo(lang, dict);

  return (
    <section id="contact" className="w-full py-16 sm:py-24 border-t border-border">
      <div className="flex flex-col gap-3 mb-8 sm:mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">{subtitle}</p>
      </div>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-5">
        <aside className="lg:col-span-2 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 flex flex-col gap-6 h-fit">
          <h3 className="text-xl font-bold">{infoHeading}</h3>
          <ul className="flex flex-col gap-5">
            {entries.map((entry, i) => (
              <li key={entry.label} className="flex items-start gap-4">
                <span className="text-2xl leading-none mt-0.5" aria-hidden="true">
                  {ICONS[i]}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{entry.label}</span>
                  {entry.href ? (
                    <a
                      href={entry.href}
                      className="text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors break-words rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {entry.value}
                    </a>
                  ) : (
                    <span className="text-sm sm:text-base font-medium text-foreground break-words">{entry.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8">
          <h3 className="text-xl font-bold mb-6">{formHeading}</h3>
          <ContactForm lang={lang} dict={formDict} />
        </div>
      </div>
    </section>
  );
}
