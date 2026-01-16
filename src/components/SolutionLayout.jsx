import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "./Sidebar";
import RoleSwitcher from "./RoleSwitcher";
import AppLogo from "./AppLogo";

const AVATAR_DEFAULT = "/vkv.jpeg";

/**
 * Generic solution layout for SOP Executor–based applications.
 *
 * Shared shell (header, user menu, sidebar, footer) with configurable:
 * - productName: e.g. "Cogniclaim", "TP Resolve"
 * - tagline: e.g. "AI-Powered Claims Intelligence"
 * - navItems: array of { key, label, icon }
 * - storageKey: prefix for theme settings (e.g. "cogniclaim", "tp-resolve")
 */
export default function SolutionLayout({
  children,
  onNavigate,
  active,
  productName,
  tagline,
  navItems,
  storageKey = "app",
  footerText = "Powered by Teleperformance • SOP Executor",
  showSettings = true,
  extraHeaderRight = null,
}) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useDarkMode(`${storageKey}.darkMode`);
  const menuRef = useRef(null);
  const navMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setNavMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to open nav menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setNavMenuOpen(!navMenuOpen);
      }
      if (e.key === 'Escape' && navMenuOpen) {
        setNavMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navMenuOpen]);

  const filteredNavItems = navItems?.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-bg02 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg01/95 backdrop-blur-xl border-b border-stroke01/60 flex items-center shadow-drop z-50">
        {/* Hamburger Menu - aligned with sidebar (w-16 = 64px) */}
        <button
          onClick={() => setNavMenuOpen(!navMenuOpen)}
          className="h-full w-16 flex items-center justify-center hover:bg-hover transition-colors border-r border-stroke01 shrink-0"
          aria-label="Open navigation menu"
        >
          <Icon 
            name={navMenuOpen ? "Close" : "Menu"} 
            size="24" 
            state="default" 
          />
        </button>

        {/* Logo and tagline section */}
        <div className="flex items-center gap-3 h-full px-4 lg:px-6 flex-1 min-w-0">
          <div className="flex items-center shrink-0">
            <AppLogo appName={productName || "Retail"} className="h-9" />
          </div>
          {tagline && (
            <>
              <span className="hidden sm:block h-5 w-px bg-gradient-to-b from-transparent via-primary/30 dark:via-primary/40 to-transparent shrink-0" />
              <div className="hidden sm:flex items-center shrink-0">
                <span className="relative inline-flex items-center px-4 py-2 rounded-lg bg-bg01 border border-text01/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                  {/* Hover effect */}
                  <span className="absolute inset-0 rounded-lg bg-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Accent dot */}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-text01 opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                  {/* Text with perfect alignment and brand color */}
                  <span className="relative text-[11px] uppercase tracking-[0.3em] font-black text-text01 leading-tight whitespace-nowrap">
                    {tagline}
                  </span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 h-full px-4 lg:px-6 shrink-0">
          {/* Optional extra controls (e.g., Back to Store) */}
          {extraHeaderRight}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg transition-all hover:bg-hover"
            aria-label="Toggle dark mode"
          >
            <Icon 
              name={darkMode ? "LightMode" : "DarkMode"} 
              size="24" 
              state="default" 
            />
          </button>

          <div className="flex items-center" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg01 border-2 border-stroke01 hover:border-text03 transition-all shadow-sm hover:shadow-md"
              title={user?.name || "Vinod Kumar V"}
            >
              <img
                src={user?.avatar || AVATAR_DEFAULT}
                alt={user?.name || "User"}
                className="w-full h-full rounded-full object-cover"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 bg-bg01 rounded-full border-2 border-stroke01 shadow-sm transition-transform ${userMenuOpen ? "rotate-180" : ""}`}>
                <Icon name="ChevronDown" size="16" state="default" />
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-4 top-16 w-64 bg-bg01 rounded-2xl shadow-2xl border border-stroke01 py-2 z-50">
                <div className="px-4 py-3 border-b border-stroke01">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user?.avatar || AVATAR_DEFAULT}
                      alt={user?.name || "User"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-stroke01"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text01 truncate">
                        {user?.name || "Vinod Kumar V"}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-text03 truncate mt-0.5">{user.email}</p>
                      )}
                    </div>
                  </div>
                  {user?.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text03 uppercase tracking-wide">Role:</span>
                      <span className="text-xs text-primary font-semibold capitalize px-2 py-0.5 rounded-full bg-primary/10">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-b border-stroke01">
                  <RoleSwitcher />
                </div>
                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text01 hover:bg-error01 hover:text-error02 transition-colors rounded-lg"
                  >
                    <Icon name="Logout" size="16" state="default" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Menu Overlay */}
      {navMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setNavMenuOpen(false)} />
          <div
            ref={navMenuRef}
            className="fixed left-0 top-16 bottom-0 w-80 bg-bg01 border-r border-stroke01 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-left duration-200"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-stroke01">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Search" size="16" state="default" />
                </span>
                <input
                  type="text"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stroke01 bg-bg02 text-sm text-text01 placeholder-text03 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  autoFocus
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-text03">
                <Icon name="Settings" size="16" state="default" />
                <span>Press Cmd/Ctrl + K to open</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredNavItems.length > 0 ? (
                  filteredNavItems.map(({ key, label, icon, iconName }) => {
                    const isActive = key === active;
                    // Support both icon (component) and iconName (string) for backward compatibility
                    const iconToUse = iconName || (typeof icon === 'string' ? icon : null);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onNavigate(key);
                          setNavMenuOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text01 hover:bg-hover"
                        }`}
                      >
                        {iconToUse ? (
                          <Icon name={iconToUse} size="24" state={isActive ? "selected" : "default"} />
                        ) : null}
                        <span className="text-sm font-medium flex-1 text-left">{label}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                        <Icon 
                          name="ArrowForward" 
                          size="16" 
                          state="default"
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`}
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-text03 text-sm">
                    No results found
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-stroke01 p-4 space-y-2">
              <div className="text-xs font-semibold text-text03 uppercase tracking-wide mb-2">
                Quick Actions
              </div>
              <button
                onClick={() => {
                  onNavigate("store");
                  setNavMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text01 hover:bg-hover transition-colors"
              >
                <Icon name="Zap" size="16" state="default" />
                <span>Back to FAB Store</span>
              </button>
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text01 hover:bg-hover transition-colors"
              >
                <Icon
                  name={darkMode ? "LightMode" : "DarkMode"}
                  size="16"
                  state="default"
                />
                <span>Toggle {darkMode ? "Light" : "Dark"} Mode</span>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar
          onNavigate={onNavigate}
          active={active}
          navItems={navItems}
          showSettings={showSettings}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-auto bg-bg02 min-h-0">
            {children}
          </main>
          <footer className="shrink-0 text-xs text-text03 py-3 px-6 border-t border-stroke01 bg-bg01/95 backdrop-blur">
            {footerText}
          </footer>
        </div>
      </div>
    </div>
  );
}

function useDarkMode(storageKey) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const isDark = stored === "true";
        if (isDark) document.body.classList.add("dark");
        else document.body.classList.remove("dark");
        return isDark;
      }
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefers) document.body.classList.add("dark");
      return prefers;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem(storageKey, "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem(storageKey, "false");
    }
  }, [darkMode, storageKey]);

  return [darkMode, setDarkMode];
}

function usePageAuth() {
  const auth = useAuth();
  return auth;
}


