import 'server-only';

interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(payload: ContactEmailPayload): string {
  const rows: Array<[string, string]> = [
    ['Nome', payload.name],
    ['Email', payload.email],
  ];
  if (payload.phone) rows.push(['Telefone', payload.phone]);
  if (payload.subject) rows.push(['Assunto', payload.subject]);

  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#3c2a21;">${escapeHtml(k)}</td><td style="padding:6px 12px;color:#3c2a21;">${escapeHtml(v)}</td></tr>`
    )
    .join('');

  const messageHtml = escapeHtml(payload.message).replace(/\n/g, '<br/>');

  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;background:#fdfaf6;padding:24px;color:#3c2a21;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3d5c8;border-radius:12px;overflow:hidden;">
      <div style="padding:20px 24px;background:#8b4513;color:#fdfaf6;font-weight:700;font-size:18px;">Nova mensagem do site</div>
      <table style="width:100%;border-collapse:collapse;">${rowHtml}</table>
      <div style="padding:16px 24px;border-top:1px solid #e3d5c8;">
        <div style="font-weight:600;margin-bottom:8px;">Mensagem</div>
        <div style="line-height:1.55;">${messageHtml}</div>
      </div>
    </div>
  </body></html>`;
}

function buildText(payload: ContactEmailPayload): string {
  const lines = [
    'Nova mensagem do site',
    '',
    `Nome: ${payload.name}`,
    `Email: ${payload.email}`,
  ];
  if (payload.phone) lines.push(`Telefone: ${payload.phone}`);
  if (payload.subject) lines.push(`Assunto: ${payload.subject}`);
  lines.push('', 'Mensagem:', payload.message);
  return lines.join('\n');
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error('Email not configured: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL');
    return { ok: false, error: 'Email service not configured' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const subjectLine = `Nova mensagem do site — ${payload.name}`;

    const result = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: subjectLine,
      html: buildHtml(payload),
      text: buildText(payload),
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { ok: false, error: 'Email send failed' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { ok: false, error: 'Email send failed' };
  }
}
