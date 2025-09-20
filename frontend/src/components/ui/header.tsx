import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <header className="bg-background text-foreground shadow-md fixed w-full z-20 transition-colors duration-300">
      <div className="w-full flex justify-between items-center px-6 py-3">
        {/* Logo / Title */}
        <h1 className="text-2xl font-extrabold tracking-wide text-primary">
          JalSthar
        </h1>

        {/* Navigation */}
        <nav className="flex space-x-6 items-center  font-medium text-xl">
          <Link
            to="/"
            className="no-underline hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/GroundWaterDashboard"
            className="no-underline hover:text-primary transition-colors"
          >
            Dashboard
          </Link>

          {/* Map Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMapOpen(!isMapOpen)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Map <span className="text-xs">▼</span>
            </button>
            {isMapOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-popover text-popover-foreground rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                <Link
                  to="/states"
                  className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition"
                >
                  States
                </Link>
                <Link
                  to="/Districts"
                  className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition"
                >
                  Districts
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
          {/* ✅ Login button */}
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/80 transition no-underline"
          >
            Signup/Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
