import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NAV } from "../utils/constants";

function Nav({ activeSection }: { activeSection: string }) {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col justify-between px-8 lg:px-10 pt-12 pb-10 border-r border-edge">
      {/* Identity + nav */}
      <div className="space-y-10">
        <div>
          {/* Monogram */}
          <div className="inline-flex items-center justify-center w-9 h-9 border border-edge mb-8 font-mono">
            <span className="text-secondary text-xs tracking-wider">SA</span>
          </div>

          <h1 className="text-xl font-semibold text-bright tracking-tight leading-snug">
            Suleman Ali
          </h1>
          <p className="text-muted text-xs mt-1 font-mono">
            Full-Stack Engineer
          </p>
          <p className="text-label text-xs mt-0.5 font-mono">
            3+ yrs · Lahore, PK
          </p>
        </div>

        <p className="text-body text-sm leading-relaxed max-w-[220px]">
          APIs, platforms, and the web UIs on top of them. Backend-leaning,
          full-stack in practice.
        </p>

        {/* Navigation */}
        <nav className="space-y-1">
          {NAV.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-3 py-2 transition-colors duration-200"
              >
                <span
                  className={`block h-px transition-all duration-300 ${isActive ? "bg-accent" : "bg-edge"}`}
                  style={{ width: isActive ? "2rem" : "1rem" }}
                />
                <span className={`text-xs font-mono transition-colors duration-200 ${isActive ? "text-accent" : "text-muted"}`}>
                  {label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Socials + copyright */}
      <div>
        <div className="flex items-center gap-5 mb-5">
          <a
            href="https://github.com/Suleman-Ali-Asif"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-label hover:text-accent transition-colors duration-200"
          >
            <FaGithub size={15} />
          </a>
          <Link
            href="/contact"
            aria-label="Contact"
            className="text-label hover:text-accent transition-colors duration-200"
          >
            <Mail className="w-[15px] h-[15px]" />
          </Link>
        </div>
        <p className="text-faint text-xs font-mono">© 2025</p>
      </div>
    </aside>
  );
}

export default Nav;
