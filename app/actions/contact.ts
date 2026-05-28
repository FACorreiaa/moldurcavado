'use server';
import { createHash } from 'crypto';
import { headers } from 'next/headers';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendContactEmail } from '@/lib/email';

export interface ContactState {
  success: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickLangError(lang: string | null, en: string, pt: string): string {
  return lang === 'en' ? en : pt;
}

async function hashedIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for') || h.get('x-real-ip') || 'unknown';
  const ip = fwd.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function sendContactMessage(
  _prev: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  const lang = (formData.get('lang') as string) || 'pt';

  const honeypot = (formData.get('company_url') as string) || '';
  if (honeypot.trim().length > 0) {
    return { success: true };
  }

  const name = ((formData.get('name') as string) || '').trim();
  const email = ((formData.get('email') as string) || '').trim();
  const phone = ((formData.get('phone') as string) || '').trim();
  const subject = ((formData.get('subject') as string) || '').trim();
  const message = ((formData.get('message') as string) || '').trim();

  if (name.length < 1 || name.length > 100) {
    return { success: false, error: pickLangError(lang, 'Please enter your name.', 'Por favor indique o seu nome.') };
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { success: false, error: pickLangError(lang, 'Please enter a valid email.', 'Por favor indique um email válido.') };
  }
  if (phone.length > 30) {
    return { success: false, error: pickLangError(lang, 'Phone is too long.', 'O telefone é demasiado longo.') };
  }
  if (subject.length > 200) {
    return { success: false, error: pickLangError(lang, 'Subject is too long.', 'O assunto é demasiado longo.') };
  }
  if (message.length < 10 || message.length > 2000) {
    return {
      success: false,
      error: pickLangError(lang, 'Message must be 10–2000 characters.', 'A mensagem deve ter entre 10 e 2000 caracteres.'),
    };
  }

  const ipHash = await hashedIp();
  const rate = checkRateLimit(`contact:${ipHash}`, 60_000);
  if (!rate.ok) {
    const seconds = Math.ceil((rate.retryAfterMs || 60_000) / 1000);
    return {
      success: false,
      error: pickLangError(
        lang,
        `Please wait ${seconds}s before sending another message.`,
        `Aguarde ${seconds}s antes de enviar outra mensagem.`
      ),
    };
  }

  try {
    await db.insert(contactMessages).values({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      ipHash,
    });
  } catch (error) {
    console.error('Failed to persist contact message:', error);
    return {
      success: false,
      error: pickLangError(lang, 'Could not save your message. Please try again.', 'Não foi possível guardar a sua mensagem. Tente novamente.'),
    };
  }

  const sent = await sendContactEmail({
    name,
    email,
    phone: phone || undefined,
    subject: subject || undefined,
    message,
  });

  if (!sent.ok) {
    return {
      success: false,
      error: pickLangError(
        lang,
        'We saved your message but could not send the email. We will follow up shortly.',
        'Guardámos a sua mensagem mas não foi possível enviar o email. Entraremos em contacto em breve.'
      ),
    };
  }

  return { success: true };
}
