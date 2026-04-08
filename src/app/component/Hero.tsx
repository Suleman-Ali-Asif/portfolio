function Hero() {
  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes expand {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(14deg);
          }
          20%, 40% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(14deg);
          }
          60% {
            transform: rotate(0deg);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-wave {
          display: inline-block;
          animation: wave 2s ease-in-out 1;
          transform-origin: 70% 70%;
        }

        .shimmer-line {
          overflow: hidden;
        }

        .shimmer-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(216, 208, 188, 0.5), transparent);
          animation: shimmer 3s infinite;
        }

        .expand-line {
          animation: expand 1.2s ease-out forwards;
        }
      `}</style>

      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#565448] dark:text-slate-100 leading-tight mb-6 sm:mb-8 animate-fade-in-up"
        style={{
          animationDelay: "0.1s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        Hello there<span className="animate-wave">👋</span> <br />I am{" "}
        <span className="italic font-light text-[#3f3d34] dark:text-slate-300 relative inline-block">
          Suleman Ali.
          <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#565448] dark:via-slate-400 to-transparent shimmer-line" />
        </span>{" "}
        <br /> I make websites.
      </h1>

      <p
        className="text-base sm:text-lg md:text-xl text-[#565448]/80 dark:text-slate-300 mb-6 sm:mb-8 animate-fade-in-up"
        style={{
          animationDelay: "0.3s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        One line of code at a time
      </p>

      <div
        className="h-1.5 sm:h-2 bg-gradient-to-r from-[#565448] via-[#6b685a] to-transparent dark:from-slate-400 dark:via-slate-500 dark:to-transparent rounded-full w-24 sm:w-32 expand-line"
        style={{
          animationDelay: "0.5s",
          width: 0,
          animationFillMode: "forwards",
        }}
      />
    </div>
  );
}

export default Hero;
