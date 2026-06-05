"use client";

import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

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
  { icon: Mail, label: "Email", value: "a.suleman3757@gmail.com" },
  { icon: Phone, label: "Phone", value: "+92 321 6611645" },
  { icon: MapPin, label: "Location", value: "Lahore, PK" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [error, setError] = useState<string | null>(null);

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
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again.",
      );
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-bright">
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-16 py-14">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-secondary hover:text-muted text-xs transition-colors duration-200 mb-16"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-label text-[10px] tracking-[0.25em] uppercase mb-5">
            Contact
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-bright tracking-tight leading-tight">
            Say hello.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-label text-sm leading-relaxed">
              I&apos;m available for freelance projects and open to full-time
              opportunities. I typically respond within 24 hours.
            </p>

            <div className="space-y-7 pt-8 border-t border-edge">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-label text-[10px] uppercase tracking-[0.18em] mb-1">
                      {label}
                    </p>
                    {label === "Email" ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-muted text-sm"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-muted text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {(["name", "email"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label
                    htmlFor={field}
                    className="block font-mono text-label text-[10px] uppercase tracking-[0.2em]"
                  >
                    {field === "name" ? "Name" : "Email"}
                  </label>
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      field === "name" ? "Your name" : "you@example.com"
                    }
                    className="w-full bg-transparent border-b border-edge py-3 text-faint text-sm placeholder:text-secondary focus:outline-none focus:border-accent transition-colors duration-200"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block font-mono text-label text-[10px] uppercase tracking-[0.2em]"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="What's this about?"
                className="w-full bg-transparent border-b border-edge py-3 text-faint text-sm placeholder:text-secondary focus:outline-none focus:border-accent transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block font-mono text-label text-[10px] uppercase tracking-[0.2em]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full bg-transparent border-b border-edge py-3 text-faint text-sm placeholder:text-secondary focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <button
                type="submit"
                disabled={status !== "idle"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-canvas text-sm font-semibold hover:bg-accent-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {status === "sending" && "Sending..."}
                {status === "sent" && "Sent!"}
                {status === "idle" && (
                  <>
                    Send message
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {status === "sent" && (
                <span className="font-mono text-secondary text-xs">
                  I&apos;ll be in touch soon.
                </span>
              )}
            </div>

            {error && (
              <p className="font-mono text-red-400 text-xs mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
