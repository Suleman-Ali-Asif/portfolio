"use client";

import Nav from "@/components/Nav";
import { Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 bg-[#565448] ">
      <Nav />
      {/* Subtle background elements */}
      <div className="absolute inset-0 mt-10">
        <div
          className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#d8d0bc " }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "#d8d0bc " }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: "#d8d0bc " }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#d8d0bc " }}
          >
            Contact Me
          </h1>
          <p
            className="text-lg opacity-80 max-w-2xl mx-auto"
            style={{ color: "#d8d0bc " }}
          >
            Have a question or want to work together? I&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="backdrop-blur-md bg-white/20 rounded-2xl p-8 border border-white/30 shadow-xl">
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ color: "#d8d0bc " }}
              >
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full backdrop-blur-md bg-white/30 border border-white/40">
                    <Mail className="w-6 h-6" style={{ color: "#d8d0bc " }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: "#d8d0bc " }}>
                      Email
                    </h3>
                    <p className="opacity-75" style={{ color: "#d8d0bc " }}>
                      hello@example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full backdrop-blur-md bg-white/30 border border-white/40">
                    <Phone className="w-6 h-6" style={{ color: "#d8d0bc " }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: "#d8d0bc " }}>
                      Phone
                    </h3>
                    <p className="opacity-75" style={{ color: "#d8d0bc " }}>
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full backdrop-blur-md bg-white/30 border border-white/40">
                    <MapPin className="w-6 h-6" style={{ color: "#d8d0bc " }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: "#d8d0bc " }}>
                      Location
                    </h3>
                    <p className="opacity-75" style={{ color: "#d8d0bc " }}>
                      New York, NY
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="backdrop-blur-md bg-white/15 rounded-2xl p-6 border border-white/25 shadow-lg">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "#d8d0bc " }}
              >
                Response Time
              </h3>
              <p className="opacity-75" style={{ color: "#d8d0bc " }}>
                I typically respond to emails within 24 hours during business
                days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-8 border border-white/30 shadow-xl">
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: "#d8d0bc " }}
            >
              Send a Message
            </h2>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
              <div className="relative">
                <User
                  className="absolute left-3 top-3 w-5 h-5 opacity-60"
                  style={{ color: "#d8d0bc " }}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  style={{ color: "#d8d0bc " }}
                  required
                />
              </div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 w-5 h-5 opacity-60"
                  style={{ color: "#d8d0bc " }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  style={{ color: "#d8d0bc " }}
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare
                  className="absolute left-3 top-3 w-5 h-5 opacity-60"
                  style={{ color: "#d8d0bc " }}
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  style={{ color: "#d8d0bc " }}
                  required
                />
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Your Message"
                  rows={6}
                  className="w-full p-4 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 resize-none"
                  style={{ color: "#d8d0bc " }}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 font-medium transition-all duration-300 hover:bg-white/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center space-x-2"
                style={{ color: "#d8d0bc " }}
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
