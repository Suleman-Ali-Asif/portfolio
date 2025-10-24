"use client";
import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Disc3,
  Figma,
  Github,
  Heart,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BentolioPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) return null;

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const projects = [
    {
      question: "Commodity Price API",
      image:
        theme === "dark"
          ? "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop"
          : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      description:
        "A comprehensive REST API providing real-time and historical prices for 130+ commodities including gold, oil, silver, wheat, and natural gas.",
    },
    {
      question: "TweetStorm.ai",
      image:
        theme === "dark"
          ? "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop"
          : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      description:
        "An AI-powered tweet generator that creates engaging content for X with customizable tone selection and keyword inclusion.",
    },
    {
      question: "Portfolio Website",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      description:
        "A stunning portfolio showcasing creative work with smooth animations and responsive design.",
    },
    {
      question: "E-Commerce Platform",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop",
      description:
        "Full-stack e-commerce solution with secure payment integration and inventory management.",
    },
  ];

  const socials = [
    { name: "Github", icon: Github },
    { name: "Instagram", icon: Instagram },
    { name: "Figma", icon: Figma },
  ];

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 transition-all duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 dark:bg-slate-700/20 rounded-full blur-3xl"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 dark:bg-slate-600/20 rounded-full blur-3xl"
          style={{ animation: "floatDelayed 8s ease-in-out infinite" }}
        />
      </div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-6 pt-8 pb-16">
        <nav
          className={`mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#565448] to-[#3f3d34] dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">
                  S
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#565448] dark:text-slate-100">
                Suleman
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 sm:p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl hover:scale-105 transition-transform duration-300 shadow-md"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div
              className={`bg-gradient-to-br from-[#d8d0bc] via-[#e8e3d9] to-[#d8d0bc] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.01] min-h-[400px] sm:min-h-[500px] ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-32 h-32 bg-[#565448]/30 dark:bg-slate-400/30 rounded-full blur-2xl animate-pulse" />
                <div
                  className="absolute bottom-10 left-10 w-40 h-40 bg-[#565448]/20 dark:bg-slate-400/20 rounded-full blur-2xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-end mb-6 sm:mb-8">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#565448]/10 dark:bg-slate-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    style={{ animation: "spinSlow 20s linear infinite" }}
                  >
                    <Disc3 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#565448] dark:text-slate-300" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#565448] dark:text-slate-100 leading-tight mb-6 sm:mb-8">
                    Let&apos;s turn{" "}
                    <span className="italic font-light text-[#3f3d34] dark:text-slate-300 relative">
                      ideas
                      <div
                        className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#565448] dark:via-slate-400 to-transparent"
                        style={{ animation: "shimmer 2s infinite" }}
                      />
                    </span>{" "}
                    into digital reality
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-[#565448]/80 dark:text-slate-300 mb-6 sm:mb-8">
                    One line of code at a time
                  </p>
                  <div
                    className="h-1.5 sm:h-2 bg-gradient-to-r from-[#565448] via-[#6b685a] to-transparent dark:from-slate-400 dark:via-slate-500 dark:to-transparent rounded-full w-24 sm:w-32"
                    style={{ animation: "expand 1s ease-out forwards" }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div
                className={`bg-gradient-to-br from-[#f5f3ef] to-[#ede9e1] dark:from-slate-800 dark:to-slate-700 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-[#d8d0bc]/40 dark:border-slate-600/50 min-h-[280px] sm:min-h-[300px] ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-8 sm:mb-10 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#565448] to-[#3f3d34] dark:from-slate-600 dark:to-slate-500 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-180" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#d8d0bc] dark:bg-slate-200 rounded-full shadow-inner" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#d8d0bc]/50 dark:border-slate-200/50 rounded-full" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#565448] dark:text-slate-100 mb-4 sm:mb-6">
                  Meet Suleman
                </h3>
                <p className="text-[#565448]/80 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                  A passionate software engineer, known for building scalable
                  backend systems and intuitive full-stack apps with precision
                  and creativity. Based in Pakistan, he blends logic with
                  innovation.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group min-h-[280px] sm:min-h-[300px] ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-[#d8d0bc] dark:text-slate-200 font-medium text-base sm:text-lg">
                      Have some questions?
                    </p>
                    <div className="flex items-center gap-2 text-[#e8e3d9] dark:text-slate-300">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
                      <span className="text-sm sm:text-base">
                        Let&apos;s talk!
                      </span>
                    </div>
                  </div>
                  <button className="p-3 sm:p-4 bg-[#d8d0bc] dark:bg-slate-200 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#565448] dark:text-slate-800" />
                  </button>
                </div>

                <div className="mt-6 sm:mt-8">
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-light text-white dark:text-slate-100 leading-tight mb-4 sm:mb-6">
                    Contact{" "}
                    <span className="italic font-light text-[#d8d0bc] dark:text-slate-300">
                      me
                    </span>
                  </h3>
                  <div className="h-1.5 sm:h-2 bg-[#d8d0bc] dark:bg-slate-300 rounded-full w-20 sm:w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Full Height Projects Card */}
          <div className="lg:col-span-4">
            <div
              className={`bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#7a7863]/50 dark:border-slate-600/50 transition-all duration-700 flex flex-col ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } h-[600px] lg:h-full`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                <div className="p-2.5 sm:p-3 bg-[#d8d0bc]/20 dark:bg-slate-700/50 rounded-lg">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#d8d0bc] dark:text-slate-200" />
                </div>
                <h3 className="text-white dark:text-slate-100 text-xl sm:text-2xl font-bold">
                  Projects
                </h3>
              </div>

              <div
                className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-1 sm:pr-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(216, 208, 188, 0.3) transparent",
                }}
              >
                {projects.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-[#6b685a] to-[#7a7863] dark:from-slate-800 dark:to-slate-700 rounded-xl sm:rounded-2xl border border-[#8a8775]/30 dark:border-slate-600/30 overflow-hidden transition-all duration-500 hover:border-[#d8d0bc]/50 dark:hover:border-slate-500/50"
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full text-left p-4 sm:p-5 flex justify-between items-center group"
                    >
                      <span className="text-sm sm:text-base font-semibold text-[#e8e3d9] dark:text-slate-200 group-hover:text-white transition-colors duration-300">
                        {item.question}
                      </span>
                      <div className="p-1.5 sm:p-2 bg-[#d8d0bc]/20 dark:bg-slate-400/20 rounded-lg group-hover:bg-[#d8d0bc]/30 transition-all duration-300 flex-shrink-0 ml-2">
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-[#d8d0bc] dark:text-slate-200 transition-transform duration-500 ${
                            openAccordion === idx ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    <div
                      className={`transition-all duration-500 ease-in-out ${
                        openAccordion === idx
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-4 sm:p-5 pt-0 space-y-3 sm:space-y-4">
                        <div className="relative rounded-xl overflow-hidden shadow-lg group/img">
                          <Image
                            src={item.image}
                            alt={item.question}
                            height={200}
                            width={400}
                            className="w-full h-40 sm:h-48 object-cover transition-transform duration-700 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                        </div>
                        <p className="text-[#d8d0bc] dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Footer */}
      <div
        className={`bg-gradient-to-r from-[#565448] via-[#6b685a] to-[#565448] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-700 mx-4 sm:mx-6 md:mx-8 lg:mx-16 xl:mx-24 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "500ms" }}
      >
        <div className="space-y-4 flex justify-between items-center sm:space-y-6">
          <div className="flex items-center gap-2 mb-0">
            <div className="w-2 h-2 bg-[#d8d0bc] dark:bg-slate-300 rounded-full animate-pulse" />
            <span className="text-[#d8d0bc] dark:text-slate-200 text-sm sm:text-base font-medium">
              Connect with me
            </span>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center gap-3 sm:gap-4 rounded-xl transition-all duration-300 group"
              >
                <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#d8d0bc] dark:text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white dark:text-slate-100 text-sm sm:text-base font-medium">
                  {social.name}
                </span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#d8d0bc] dark:text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes expand {
          0% { width: 0; }
          100% { width: 8rem; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom scrollbar styling */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(216, 208, 188, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(216, 208, 188, 0.5);
        }
      `}</style>
    </div>
  );
}
