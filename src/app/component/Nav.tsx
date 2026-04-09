import { Link, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NAV } from "../utils/constants";

function Nav({ activeSection }: { activeSection: string }) {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col justify-between px-8 lg:px-10 pt-12 pb-10 border-r border-[#161616]">
      {/* Identity + nav */}
      <div className="space-y-10">
        <div>
          {/* Monogram */}
          <div
            className="inline-flex items-center justify-center w-9 h-9 border border-[#222] mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-[#555] text-xs tracking-wider">SA</span>
          </div>

          <h1 className="text-xl font-semibold text-[color:var(--color-text-bright)] tracking-tight leading-snug">
            Suleman Ali
          </h1>
          <p
            className="text-[color:var(--color-text-muted)] text-xs mt-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Full-Stack Engineer
          </p>
          <p
            className="text-[color:var(--color-text-label)] text-xs mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            3+ yrs · Lahore, PK
          </p>
        </div>

        <p className="text-[color:var(--color-text-body)] text-sm leading-relaxed max-w-[220px]">
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
                className="flex items-center gap-3 py-2 group transition-colors duration-200"
              >
                <span
                  className="block h-px transition-all duration-300"
                  style={{
                    width: isActive ? "2rem" : "1rem",
                    backgroundColor: isActive
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    transition: "width 300ms, background-color 300ms",
                  }}
                />
                <span
                  className="text-xs transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-text-muted)",
                  }}
                >
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
            className="text-[color:var(--color-text-label)] hover:text-[color:var(--color-accent)] transition-colors duration-200"
          >
            <FaGithub size={15} />
          </a>
          <Link
            href="/contact"
            aria-label="Contact"
            className="text-[color:var(--color-text-label)] hover:text-[color:var(--color-accent)] transition-colors duration-200"
          >
            <Mail className="w-[15px] h-[15px]" />
          </Link>
        </div>
        <p
          className="text-[color:var(--color-text-faint)] text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © 2025
        </p>
      </div>
    </aside>
  );
}

export default Nav;
