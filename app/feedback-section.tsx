'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { CheckCircle2, MessageSquareText, Send } from 'lucide-react';

const MAX_WORDS = 500;
const formEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() ?? '';
export const feedbackConfigured = Boolean(formEndpoint);

function wordsIn(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function keepFirstWords(value: string, limit: number) {
  const words = value.match(/\S+/g) ?? [];
  return words.slice(0, limit).join(' ');
}

export function FeedbackSection() {
  const [feedback, setFeedback] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const mountedAt = useRef(Date.now());
  const wordCount = useMemo(() => wordsIn(feedback), [feedback]);

  const updateFeedback = (value: string) => {
    setStatus('idle');
    setMessage('');
    setFeedback(wordsIn(value) > MAX_WORDS ? keepFirstWords(value, MAX_WORDS) : value);
  };

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanFeedback = feedback.trim();
    const count = wordsIn(cleanFeedback);

    if (!cleanFeedback) {
      setStatus('error');
      setMessage('Please enter your feedback before submitting.');
      return;
    }
    if (count > MAX_WORDS) {
      setStatus('error');
      setMessage('Please keep your feedback within 500 words.');
      return;
    }
    if (honeypot || Date.now() - mountedAt.current < 1500) {
      setStatus('error');
      setMessage('Please wait a moment and try again.');
      return;
    }
    if (!formEndpoint) {
      setStatus('error');
      setMessage('The feedback service is temporarily unavailable. Please try again later.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanFeedback,
          _subject: 'New Feedback – NBFC Regulatory Repository',
          submitted_at: new Date().toISOString(),
          page_url: window.location.href,
          _gotcha: honeypot,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setFeedback('');
      setStatus('success');
      setMessage('Thank you for your feedback! Your suggestions will help us improve the repository.');
      mountedAt.current = Date.now();
    } catch {
      setStatus('error');
      setMessage('We could not submit your feedback. Please try again—your message has been kept.');
    }
  };

  return (
    <section id="feedback" className="scroll-mt-24 border-t border-border bg-slate-50/70">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><MessageSquareText className="size-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Help improve this repository</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Feedback &amp; Suggestions</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">Your feedback matters! Share your thoughts, suggestions or corrections to help us improve the NBFC Regulatory Repository and make it more useful for everyone.</p>
            </div>
          </div>

          <form onSubmit={submitFeedback} className="mt-7">
            <label htmlFor="feedback-message" className="sr-only">Your feedback</label>
            <textarea
              id="feedback-message"
              value={feedback}
              onChange={(event) => updateFeedback(event.target.value)}
              placeholder="Share a suggestion, correction or idea…"
              rows={9}
              aria-describedby="feedback-counter feedback-status"
              className="min-h-52 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-4 text-[15px] leading-7 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="feedback-company">Company</label>
              <input id="feedback-company" name="_gotcha" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p id="feedback-counter" className={`text-sm font-medium ${wordCount === MAX_WORDS ? 'text-amber-700' : 'text-slate-500'}`} aria-live="polite">{wordCount} / {MAX_WORDS} words</p>
              <button type="submit" disabled={status === 'submitting'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="size-4" />{status === 'submitting' ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </div>
            <div id="feedback-status" aria-live="polite" className="mt-4 min-h-6">
              {status === 'success' && <p className="flex items-start gap-2 text-sm font-medium leading-6 text-emerald-700"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{message}</p>}
              {status === 'error' && <p className="text-sm font-medium leading-6 text-red-700">{message}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

