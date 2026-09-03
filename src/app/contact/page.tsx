"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import Nav from "../component/Nav";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const CONTACT_INFO = [
  { label: "Email",    value: "a.suleman3757@gmail.com", href: "mailto:a.suleman3757@gmail.com" },
  { label: "Phone",    value: "+92 321 6611645",         href: "tel:+923216611645" },
  { label: "Location", value: "Lahore, Pakistan (UTC+5)" },
];

const FIELD_CLASS =
  "w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-[15.5px] text-text placeholder:text-faint transition-colors duration-200 hover:border-text-muted focus:border-text focus:outline-none";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      if (!window.grecaptcha || !RECAPTCHA_SITE_KEY) {
        throw new Error("reCAPTCHA failed to load. Please try again.");
      }
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window
            .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact" })
            .then(resolve)
            .catch(reject);
        });
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }
      setFormData({ name: "", email: "", subject: "", message: "" });
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-dvh bg-bg text-text">
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <Nav activeSection="contact" />

      <main className="mx-auto max-w-[1040px] px-5 py-12 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="link-muted inline-flex items-center gap-1.5 text-[14px]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-[340px_minmax(0,600px)] lg:gap-20">
          {/* Left: intro + details */}
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text">
              Contact
            </h1>
            <p className="mt-5 max-w-[420px] text-[16px] leading-[1.6] text-body">
              For freelance work, full-time roles, or questions about any of the
              projects. I reply within a day.
            </p>

            <dl className="mt-10 divide-y divide-border border-t border-border">
              {CONTACT_INFO.map(({ label, value, href }) => (
                <div key={label} className="grid grid-cols-[88px_1fr] gap-3 py-4">
                  <dt className="text-[13.5px] text-muted">{label}</dt>
                  <dd className="min-w-0 text-[14.5px] text-text">
                    {href ? (
                      <a
                        href={href}
                        className="link break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className=""
            noValidate={false}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-[14px] text-text">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-[14px] text-text">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="you@example.com"
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="subject" className="mb-2 block text-[14px] text-text">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Subject"
                className={FIELD_CLASS}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mb-2 block text-[14px] text-text">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="What you are building and when you need it"
                className={`${FIELD_CLASS} resize-y min-h-[140px]`}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status !== "idle"}
                className="inline-flex h-11 items-center rounded-md bg-text px-5 text-[15px] font-medium text-bg transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {status === "sending" && "Sending…"}
                {status === "sent" && "Sent"}
                {status === "idle" && "Send message"}
              </button>

              <p role="status" aria-live="polite" className="text-[13.5px] text-muted">
                {status === "sent" && "Message sent."}
              </p>
            </div>

            {error && (
              <p role="alert" className="mt-4 border-l-2 border-danger pl-3 text-[14px] text-danger">
                {error}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
