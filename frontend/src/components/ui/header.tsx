import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
        <header className="bg-white dark:bg-black text-black dark:text-white  shadow-md fixed w-full z-10 transition-colors">
      <div className="w-full flex justify-between items-center px-6 py-3">
        {/* Logo / Title */}
        {/* <img src="/favicon.ico" alt="icon" /> */}
        <h1 className="text-xl font-bold">JalSthar</h1>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <Link 
            to="/" 
            className="no-underline text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <Link 
            to="/GroundWaterDashboard" 
            className="no-underline text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
          >
            Dashboard
          </Link>

          {/* Map Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMapOpen(!isMapOpen)}
              className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
            >
              Map ▼
            </button>
            {isMapOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white text-black dark:bg-gray-800 dark:text-white rounded shadow-lg">
                <Link 
                  to="/states" 
                  className="no-underline block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  States
                </Link>
                <Link 
                  to="/Districts" 
                  className="no-underline block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Districts
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>

  );
};

export default Header;
