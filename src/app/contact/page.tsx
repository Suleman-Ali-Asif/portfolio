"use client";

import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@example.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
  { icon: MapPin, label: "Location", value: "Karachi, PK" },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    // Replace with real submission logic
    await new Promise((r) => setTimeout(r, 900));
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div
      className="min-h-screen bg-[#0b0b0b] text-[#e8e3d9]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-16 py-14">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#333] hover:text-[#888] text-xs transition-colors duration-200 mb-16"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-16">
          <p
            className="text-[#2a2a2a] text-[10px] tracking-[0.25em] uppercase mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Contact
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#f5f2ed] tracking-tight leading-tight">
            Say hello.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-[#4a4a4a] text-sm leading-relaxed">
              I&apos;m available for freelance projects and open to full-time
              opportunities. I typically respond within 24 hours.
            </p>

            <div className="space-y-7 pt-8 border-t border-[#161616]">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon className="w-3.5 h-3.5 text-[#2a2a2a] mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="text-[#2a2a2a] text-[10px] uppercase tracking-[0.18em] mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </p>
                    <p className="text-[#777] text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {(["name", "email"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label
                    htmlFor={field}
                    className="block text-[#2a2a2a] text-[10px] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-mono)" }}
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
                    className="w-full bg-transparent border-b border-[#1c1c1c] py-3 text-[#d8d0bc] text-sm placeholder:text-[#242424] focus:outline-none focus:border-[#d8d0bc] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-sans)" }}
                  />
                </div>
              ))}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-[#2a2a2a] text-[10px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
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
                className="w-full bg-transparent border-b border-[#1c1c1c] py-3 text-[#d8d0bc] text-sm placeholder:text-[#242424] focus:outline-none focus:border-[#d8d0bc] transition-colors duration-200"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-[#2a2a2a] text-[10px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
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
                className="w-full bg-transparent border-b border-[#1c1c1c] py-3 text-[#d8d0bc] text-sm placeholder:text-[#242424] focus:outline-none focus:border-[#d8d0bc] transition-colors duration-200 resize-none"
                style={{ fontFamily: "var(--font-sans)" }}
              />
            </div>

            {/* Submit row */}
            <div className="flex items-center gap-6 pt-2">
              <button
                type="submit"
                disabled={status !== "idle"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d8d0bc] text-[#0b0b0b] text-sm font-semibold hover:bg-[#c9b99a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
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
                <span
                  className="text-[#444] text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  I&apos;ll be in touch soon.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
