"use client";
import Nav from "@/components/Nav";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Disc3,
  Heart,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function BentolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Simulate loading time - you can adjust this duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  const accordionData = [
    {
      question: "Commodity Price API",
      image:
        currentTheme === "dark"
          ? "/commodity-dark.png"
          : "/commodity-light.png",
      alt: "CommodityPriceAPI dashboard interface showing real-time commodity prices with charts and JSON API endpoints",
      description:
        "A comprehensive REST API providing real-time and historical prices for 130+ commodities including gold, oil, silver, wheat, and natural gas. Features multi-currency support for 175+ currencies, reliable data from trusted exchanges, and easy integration with complete documentation.",
    },
    {
      question: "TweetStorm.ai",
      image:
        currentTheme === "dark"
          ? "/tweetstorm-dark.png"
          : "/tweetstorm-light.png",
      alt: "TweetStorm.ai AI-powered tweet generator interface with tone selection, keyword inclusion, and browser extension features",
      description:
        "An AI-powered tweet generator that creates engaging content for X (Twitter) with customizable tone selection, keyword inclusion, and emoji/hashtag options. Includes browser extension for Chrome and Firefox, tweet history tracking, and reply generation capabilities.",
    },
    {
      question: "Birthday Parties",
      image: "/birthday-1.jpg", // Replace with your actual image path
      alt: "Vibrant birthday party with colorful lighting",
      description:
        "High-energy celebrations with age-appropriate music and interactive entertainment.",
    },
    {
      question: "Anniversary Celebrations",
      image: "/anniversary-1.jpg", // Replace with your actual image path
      alt: "Elegant anniversary celebration",
      description:
        "Romantic ambiance with carefully selected songs that tell your love story.",
    },
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 overflow-x-hidden transition-colors duration-500">
      {/* Loading Screen with Hero Image - Enhanced dark mode */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-gray-900 dark:to-black overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              {/* Hero Image with Animation - Enhanced dark mode ring */}
              <motion.div
                className="relative w-[min(500px,80vw)] h-[min(500px,80vw)] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#d8d0bc]/30 dark:ring-slate-400/20"
                initial={{ scale: 0.7, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2,
                }}
              >
                <Image
                  src="/hero.png"
                  alt="DJ Hero Image"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#565448]/60 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
              </motion.div>

              {/* Loading Text/Animation - Enhanced dark mode */}
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-8"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div className="flex items-center gap-3 text-white dark:text-slate-200">
                  <div className="flex gap-2">
                    <motion.div
                      className="w-3 h-3 bg-gradient-to-r from-[#d8d0bc] to-[#e8e3d9] dark:from-slate-300 dark:to-slate-100 rounded-full shadow-lg"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.3, 1],
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-gradient-to-r from-[#d8d0bc] to-[#e8e3d9] dark:from-slate-300 dark:to-slate-100 rounded-full shadow-lg"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.3, 1],
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-[#d8d0bc] dark:bg-slate-300 rounded-full shadow-lg"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.3, 1],
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                  </div>
                  <motion.span
                    className="text-lg font-medium ml-2 tracking-wide text-white dark:text-slate-200"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    Loading...
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="flex flex-col min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
      >
        {/* Header */}
        <Nav />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 flex-1">
          {/* Left Column - Content Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            {/* Hero Card - Enhanced with dark mode */}
            <motion.div
              className="bg-gradient-to-br from-[#d8d0bc] via-[#e8e3d9] to-[#d8d0bc] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl p-8 sm:p-10 lg:p-12 relative flex flex-col justify-center h-[450px] shadow-xl hover:shadow-2xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-700 group overflow-hidden"
              variants={cardVariants}
            >
              {/* Decorative Background Elements - Enhanced dark mode */}
              <div className="absolute inset-0 opacity-10 dark:opacity-20">
                <motion.div
                  className="absolute top-10 right-10 w-32 h-32 bg-[#565448]/20 dark:bg-slate-400/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
                <motion.div
                  className="absolute bottom-10 left-10 w-24 h-24 bg-[#565448]/15 dark:bg-slate-400/15 rounded-full blur-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.15, 0.2, 0.15],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 2,
                  }}
                />
              </div>

              {/* Decorative Flower - Enhanced dark mode */}
              <div className="relative z-10">
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 mb-6 ml-auto cursor-pointer"
                  initial={{ rotate: -180, scale: 0.6, opacity: 0 }}
                  animate={{
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    rotate: {
                      duration: 1.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.4,
                    },
                    scale: {
                      duration: 1.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.4,
                    },
                    opacity: {
                      duration: 1.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.4,
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 360],
                    transition: {
                      rotate: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      },
                    },
                  }}
                >
                  <Image
                    src="/oneliner.svg"
                    alt="Decorative Flower"
                    width={144}
                    height={144}
                    className="w-full mt-10 h-full object-contain drop-shadow-lg dark:drop-shadow-[0_4px_12px_rgba(148,163,184,0.3)]"
                  />
                </motion.div>
              </div>

              <div className="relative z-10">
                <motion.h2
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#565448] dark:text-slate-100 leading-tight mb-2 drop-shadow-sm dark:drop-shadow-md"
                  variants={textVariants}
                >
                  Let&apos;s turn{" "}
                  <motion.span
                    className="italic font-light text-[#3f3d34] dark:text-slate-300 drop-shadow-md"
                    animate={{
                      textShadow: [
                        "0 0 0 rgba(63, 61, 52, 0.5)",
                        "0 2px 4px rgba(63, 61, 52, 0.3)",
                        "0 0 0 rgba(63, 61, 52, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    ideas
                  </motion.span>{" "}
                  into digital reality — one line of code at a time.{" "}
                </motion.h2>
                <motion.div
                  className="h-1 bg-[#565448] dark:bg-slate-300 mt-6 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.8,
                  }}
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About DJ Card - Enhanced dark mode */}
              <motion.div
                className="bg-gradient-to-br from-[#f5f3ef] to-[#ede9e1] dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-lg hover:shadow-xl dark:shadow-slate-900/30 dark:hover:shadow-slate-900/50 transition-all duration-700 border border-[#d8d0bc]/40 dark:border-slate-600/50"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
              >
                {/* Enhanced Vinyl Record Icon - Dark mode */}
                <div className="w-16 h-16 border-3 border-[#565448] dark:border-slate-300 rounded-full relative mb-8 bg-gradient-to-br from-[#565448] to-[#6b685a] dark:from-slate-600 dark:to-slate-500 shadow-lg">
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#d8d0bc] dark:bg-slate-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
                  <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-[#d8d0bc] dark:border-slate-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Disc3 className="w-full h-full text-[#d8d0bc] dark:text-slate-200 opacity-30" />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.h3
                    className="text-2xl font-bold text-[#565448] dark:text-slate-100 mb-3"
                    variants={textVariants}
                  >
                    Meet Suleman
                  </motion.h3>
                  <motion.p
                    className="text-[#565448] dark:text-slate-300 text-base leading-relaxed"
                    variants={textVariants}
                  >
                    A passionate software engineer, known for building scalable
                    backend systems and intuitive full-stack apps with precision
                    and creativity. Based in Pakistan, he blends logic with
                    innovation to turn complex ideas into clean, functional, and
                    impactful digital experiences.
                  </motion.p>
                </div>
              </motion.div>

              {/* Contact Card - Enhanced dark mode */}
              <motion.div
                className="bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-700 group"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <motion.p
                      className="text-[#d8d0bc] dark:text-slate-200 text-base font-medium"
                      variants={textVariants}
                    >
                      Have some questions?
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-2 text-[#e8e3d9] dark:text-slate-300"
                      variants={textVariants}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                      </motion.div>
                      <span className="text-sm">Let&apos;s talk!</span>
                    </motion.div>
                  </div>
                  <motion.div
                    className="p-3 bg-[#d8d0bc] dark:bg-slate-200 rounded-full shadow-lg cursor-pointer"
                    variants={textVariants}
                    whileHover={{
                      scale: 1.15,
                      rotate: 45,
                      transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/contact">
                      {" "}
                      <ArrowUpRight className="w-6 h-6 text-[#565448] dark:text-slate-800" />
                    </Link>
                  </motion.div>
                </div>

                <div>
                  <motion.h3
                    className="text-4xl sm:text-5xl lg:text-6xl font-light text-white dark:text-slate-100 leading-tight"
                    variants={textVariants}
                  >
                    Contact{" "}
                    <span className="italic font-light text-[#d8d0bc] dark:text-slate-300">
                      me
                    </span>
                  </motion.h3>
                  <motion.div
                    className="h-1 bg-[#d8d0bc] dark:bg-slate-300 mt-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.6,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Enhanced FAQ Accordion Card + Bottom Section */}
          <div className="flex flex-col gap-6">
            {/* FAQ Accordion Card - Enhanced dark mode */}
            <motion.div
              className="bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 flex flex-col flex-1 shadow-xl border border-[#7a7863]/50 dark:border-slate-600/50"
              variants={cardVariants}
            >
              <motion.div
                className="flex items-center gap-3 mb-8"
                variants={textVariants}
              >
                <Briefcase className="w-6 h-6 text-[#d8d0bc] dark:text-slate-200" />
                <h3 className="text-white dark:text-slate-100 text-2xl font-bold">
                  Projects
                </h3>
              </motion.div>

              <div
                className="space-y-4 flex-1 overflow-y-auto scrollbar-hide pr-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {accordionData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-[#6b685a] to-[#7a7863] dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-[#8a8775]/30 dark:border-slate-600/30 transition-all duration-500 shadow-lg dark:shadow-slate-900/30"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.2 + index * 0.1,
                    }}
                    whileHover={{
                      scale: 1,
                    }}
                    layoutId={`accordion-${index}`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left p-5 flex justify-between items-center text-white dark:text-slate-100 transition-colors duration-300 cursor-pointer"
                    >
                      <span className="text-base font-semibold pr-4 text-[#e8e3d9] dark:text-slate-200">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openAccordion === index ? 180 : 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="p-1 bg-[#d8d0bc]/20 dark:bg-slate-400/20 rounded-full"
                      >
                        <ChevronDown className="w-5 h-5 text-[#d8d0bc] dark:text-slate-200 flex-shrink-0" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openAccordion === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 space-y-4 max-w-sm mx-auto">
                            <motion.div
                              initial={{ y: -30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                delay: 0.1,
                                duration: 0.5,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              className="relative rounded-xl overflow-hidden shadow-lg group"
                            >
                              <div className="relative">
                                <Image
                                  src={item.image}
                                  alt={item.alt}
                                  width={300}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />

                                {/* Mask that reveals image from top to bottom */}
                                <div
                                  className="absolute inset-0 bg-white dark:bg-gray-900 group-hover:translate-y-full transition-transform duration-500 ease-out"
                                  style={{
                                    clipPath:
                                      "polygon(0 60%, 100% 60%, 100% 100%, 0 100%)",
                                  }}
                                />

                                {/* Grainy overlay with #565448 hue */}
                                <div className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                                  {/* Color overlay */}
                                  <div
                                    className="absolute inset-0 mix-blend-overlay"
                                    style={{ backgroundColor: "#565448" }}
                                  />

                                  {/* Grain texture */}
                                  <div
                                    className="absolute inset-0 opacity-40"
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                                      backgroundSize: "100px 100px",
                                    }}
                                  />
                                </div>

                                {/* Original gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#565448]/60 via-[#565448]/20 to-transparent dark:from-black/70 dark:via-black/30 dark:to-transparent group-hover:opacity-0 transition-opacity duration-500" />

                                {/* Text that disappears on hover */}
                                <div className="absolute bottom-0 left-0 right-0 group-hover:opacity-0 transition-opacity duration-500">
                                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-3 border-t border-gray-200/20">
                                    <p className="text-[#565448] dark:text-slate-100 text-sm font-semibold">
                                      <strong>{item.alt}</strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            <motion.p
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                delay: 0.2,
                                duration: 0.5,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              className="text-[#d8d0bc] dark:text-slate-300 text-sm leading-relaxed group-hover:opacity-0 transition-opacity duration-500"
                            >
                              {item.description}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Section - Enhanced Social Links with dark mode */}
            <motion.div
              className="bg-gradient-to-r from-[#565448] via-[#6b685a] to-[#565448] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl dark:shadow-slate-900/50"
              variants={cardVariants}
            >
              <div className="flex justify-between items-center">
                <motion.div
                  className="flex items-center gap-3"
                  variants={textVariants}
                >
                  <motion.div
                    className="w-2 h-2 bg-[#d8d0bc] dark:bg-slate-300 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                  <span className="text-[#d8d0bc] dark:text-slate-200 text-sm font-medium">
                    Connect with me
                  </span>
                </motion.div>
                <motion.div className="flex gap-8" variants={textVariants}>
                  {[
                    { name: "Figma", href: "#" },
                    { name: "Instagram", href: "#" },
                    { name: "Github", href: "#" },
                  ].map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="text-white dark:text-slate-100 text-sm font-medium uppercase tracking-wider hover:text-[#d8d0bc] dark:hover:text-slate-300 transition-colors duration-400 relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.5 + index * 0.1,
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {social.name}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-[#d8d0bc] dark:bg-slate-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .border-3 {
          border-width: 3px;
        }

        /* Enhanced dark mode transitions */
        * {
          transition-property: color, background-color, border-color,
            text-decoration-color, fill, stroke, opacity, box-shadow, transform,
            filter, backdrop-filter;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default BentolioPage;
