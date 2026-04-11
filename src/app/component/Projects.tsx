"use client";
import { Briefcase, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getConstants } from "../utils/constants";

function Projects({ isVisible }: { isVisible: boolean }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };
  return (
    <div className="lg:col-span-4">
      <div
        className={`bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#7a7863]/50 dark:border-slate-600/50 transition-all duration-700 flex flex-col ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } h-[600px] lg:h-full`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2.5 sm:p-3 bg-[#d8d0bc]/20 dark:bg-slate-700/50 rounded-lg">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#d8d0bc] dark:text-slate-200" />
          </div>
          <h3 className="text-white dark:text-slate-100 text-xl sm:text-2xl font-bold">
            Experience & Projects
          </h3>
        </div>

        <div
          className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-1 sm:pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(216, 208, 188, 0.3) transparent",
          }}
        >
          {getConstants("light").projects.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-[#6b685a] to-[#7a7863] dark:from-slate-800 dark:to-slate-700 rounded-xl sm:rounded-2xl border border-[#8a8775]/30 dark:border-slate-600/30 overflow-hidden transition-all duration-500 hover:border-[#d8d0bc]/50 dark:hover:border-slate-500/50"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left p-4 sm:p-5 flex justify-between items-center group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#e8e3d9] dark:text-slate-200 group-hover:text-white transition-colors duration-300">
                  {item.name}
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
                <div className="px-4 pb-1 sm:px-5 sm:pb-2 pt-0 space-y-3 sm:space-y-4">
                  <div className="relative rounded-xl overflow-hidden shadow-lg group/img">
                    <Image
                      src={item.image}
                      alt={item.name}
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

                <div className="px-4 sm:px-5 pb-4 mb-2 sm:pb-5 pt-0 flex flex-wrap">
                  {item.stack?.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-block shadow bg-[#d8d0bc]/20 dark:bg-slate-400/20 text-[#d8d0bc] dark:text-slate-300 text-xs sm:text-sm font-medium rounded-full px-2 py-1 mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
