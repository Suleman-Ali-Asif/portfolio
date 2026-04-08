export function getConstants(theme: string) {
  const projects = [
    {
      question: "Commodity Price API",
      image:
        theme === "dark"
          ? "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop"
          : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      description:
        "A comprehensive REST API providing real-time and historical prices for 130+ commodities including gold, oil, silver, wheat, and natural gas.",
      tags: [
        "Node.js",
        "Express",
        "MongoDB",
        "REST API",
        "Next.js",
        "TypeScript",
        "Tailwind",
      ],
      url: "https://commoditypriceapi.com",
    },
    {
      question: "TweetStorm.ai",
      image:
        theme === "dark"
          ? "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop"
          : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      description:
        "An AI-powered tweet generator that creates engaging content for X with customizable tone selection and keyword inclusion.",
      tags: [
        "Next.js",
        "Puppeteer",
        "mySql",
        "REST API",
        "OpenAI",
        "Plasmo",
        "Tailwind",
      ],
      url: "https://tweetstorm.ai",
    },
    {
      question: "Netus.ai",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      description:
        "AI-powered content platform that redefines how users rewrite and summarize text.",
      stack: [
        "Go",
        "SQL",
        "React",
        "Vite",
        "React Router",
        "Tailwind CSS",
        "Astro",
      ],
      url: "https://netus.ai",
    },
    {
      question: "API-Freaks",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop",
      description:
        "ApiFreaks.com is a resource hub for developers exploring APIs across different technologies. It offers curated tutorials, public API listings, and testing guides to help developers build faster.",
      stack: [
        "Node.js",
        "Express",
        "MongoDB",
        "REST API",
        "Next.js",
        "TypeScript",
        "Tailwind",
      ],
      url: "https://apifreaks.com",
    },
  ];
  return { projects };
}

export const NAV = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

export const EXPERTISE = [
  {
    area: "Backend Engineering",
    stack: "Node.js · Go · Express · REST · GraphQL",
    desc: "High-throughput services, API design, and data modelling at scale.",
  },
  {
    area: "Frontend Development",
    stack: "Next.js · React · TypeScript · Tailwind CSS",
    desc: "Performant, accessible UIs built for long-term maintainability.",
  },
  {
    area: "Data & Infrastructure",
    stack: "MongoDB · PostgreSQL · MySQL · Redis · Docker",
    desc: "Schema design, query optimisation, and containerised deployments.",
  },
];
