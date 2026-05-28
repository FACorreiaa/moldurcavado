'use client';
import { useActionState, useEffect, useRef } from 'react';
import { sendContactMessage, type ContactState } from '@/app/actions/contact';

export interface ContactFormDict {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submit: string;
  submitting: string;
  success: string;
}

const initialState: ContactState = { success: false };

export function ContactForm({ lang, dict }: { lang: string; dict: ContactFormDict }) {
  const [state, action, isPending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const inputClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50';

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="lang" value={lang} />

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company_url">Company URL</label>
        <input
          type="text"
          id="company_url"
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium">
            {dict.name} <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium">
            {dict.email} <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className="text-sm font-medium">{dict.phone}</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-subject" className="text-sm font-medium">{dict.subject}</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={200}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          {dict.message} <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          disabled={isPending}
          className={`${inputClass} resize-y min-h-32`}
        />
      </div>

      <div aria-live="polite" className="min-h-5">
        {state.error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="text-sm font-medium text-primary">
            {dict.success}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background self-start"
      >
        {isPending ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
