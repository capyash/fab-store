import { useState } from "react";
import { Icon } from "./Icon";
import { useDemoMode } from "../contexts/DemoModeContext";

const DEFAULT_NAV_ITEMS = [
  { key: "store", label: "FAB Store", iconName: "Store" },
  { key: "home", label: "Home", iconName: "Home" },
  { key: "worklist", label: "Worklist", iconName: "ClipboardList" },
  { key: "executive", label: "Executive", iconName: "TrendingUp" },
  { key: "reports", label: "Reports", iconName: "BarChart3" },
  { key: "knowledge", label: "Knowledge Base", iconName: "BookOpen" },
  { key: "pitch", label: "Product Hub", iconName: "Sparkles" },
];

export default function Sidebar({
  active = "home",
  onNavigate = () => {},
  navItems,
  showSettings = true,
}) {
  const [collapsed, setCollapsed] = useState(true);
  const { isDemoMode } = useDemoMode();

  const items = navItems && navItems.length ? navItems : DEFAULT_NAV_ITEMS;

  return (
    <aside
      className={`h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {items.map(({ key, label, iconName }) => {
          const isActive = key === active;
          return (
            <button
              type="button"
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                isActive
                  ? "bg-primary/10 dark:bg-primary/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={collapsed ? label : ""}
            >
              <Icon 
                name={iconName} 
                size="24" 
                state={isActive ? "selected" : "default"} 
              />
              {!collapsed && (
                <span className={`text-sm font-medium ${
                  isActive 
                    ? "text-primary dark:text-primary" 
                    : "text-gray-600 dark:text-gray-400"
                }`}>{label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section with Demo Mode, Settings (optional) and Collapse Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        {/* Demo Mode Toggle */}
        <button
          type="button"
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all group relative ${
            isDemoMode
              ? "bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title={collapsed ? (isDemoMode ? "Demo Mode: Frontend" : "Demo Mode: Backend") : ""}
        >
          <div className="w-full flex items-center gap-3 px-2">
            <Icon 
              name="Monitor" 
              size="24" 
              state={isDemoMode ? "selected" : "default"} 
            />
            {!collapsed && (
              <span className={`text-sm font-medium ${
                isDemoMode 
                  ? "text-primary dark:text-primary" 
                  : "text-gray-600 dark:text-gray-400"
              }`}>
                {isDemoMode ? "Frontend Mode" : "Backend Mode"}
              </span>
            )}
          </div>
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              {isDemoMode ? "Demo Mode: Frontend" : "Demo Mode: Backend"}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
            </div>
          )}
        </button>

        {/* Settings Button (optional) */}
        {showSettings && (
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all group relative ${
              active === "settings"
                ? "bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={collapsed ? "Settings" : ""}
          >
            <div className="w-full flex items-center gap-3 px-2">
              <Icon 
                name="Settings" 
                size="24" 
                state={active === "settings" ? "selected" : "default"} 
              />
              {!collapsed && (
                <span className={`text-sm font-medium ${
                  active === "settings"
                    ? "text-primary dark:text-primary"
                    : "text-gray-600 dark:text-gray-400"
                }`}>Settings</span>
              )}
            </div>
            
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                Settings
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
              </div>
            )}
          </button>
        )}

        {/* Help/Support Button */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group relative"
          title={collapsed ? "Help & Support" : ""}
        >
          <div className="w-full flex items-center gap-3 px-2">
            <Icon name="MessageSquare" size="24" state="default" />
            {!collapsed && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Help & Support
              </span>
            )}
          </div>
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              Help & Support
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
            </div>
          )}
        </button>

        {/* Collapse/Expand Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group relative"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="w-full flex items-center gap-3 px-2">
            {collapsed ? (
              <Icon name="ChevronRight" size="24" state="default" />
            ) : (
              <>
                <Icon name="ChevronLeft" size="24" state="default" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Collapse
                </span>
              </>
            )}
          </div>
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              Expand sidebar
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
