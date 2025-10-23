import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggler from "./ThemeToggler";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-gradient-to-br from-[#565448] via-[#6b685a] to-[#3f3d34] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl px-5 py-6 shadow-xl dark:shadow-2xl dark:shadow-slate-900/50">
      {/* Desktop Navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-white dark:text-slate-100">
          Muhammad <span className="font-semibold">Suleman Ali</span> Asif
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex! gap-6 text-base items-center">
          <li className="text-[#d8d0bc] dark:text-slate-300">
            <ThemeToggler />
          </li>
          <li>
            <a
              href="#projects"
              className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden! items-center gap-3">
          <div className="text-[#d8d0bc] dark:text-slate-300">
            <ThemeToggler />
          </div>

          <button
            onClick={toggleMenu}
            className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 p-2 rounded-lg hover:bg-[#7a7863]/50 dark:hover:bg-slate-700/50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-6 pt-6 border-t border-[#7a7863]/50 dark:border-slate-700/50">
          <ul className="flex flex-col gap-4 text-base">
            <li>
              <a
                href="#projects"
                className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-[#d8d0bc] dark:text-slate-300 hover:text-white dark:hover:text-slate-100 transition-colors duration-300 cursor-pointer block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Nav;
