import { useState } from "react";
import { ChevronDown, Shield, Code, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

/**
 * Role Switcher Component
 * Allows testing different personas (Admin, Developer, User)
 * Only visible in development/testing mode
 */
export default function RoleSwitcher() {
  const { user, updateRole } = useAuth();
  const { role } = usePermissions();
  const [open, setOpen] = useState(false);

  const roles = [
    { value: "admin", label: "Admin", icon: Shield, description: "Full platform access" },
    { value: "developer", label: "Developer", icon: Code, description: "Build and edit apps" },
    { value: "user", label: "User", icon: User, description: "Use published apps only" },
  ];

  const currentRole = roles.find((r) => r.value === role) || roles[0];
  const CurrentIcon = currentRole.icon;

  const handleRoleChange = (newRole) => {
    updateRole(newRole);
    setOpen(false);
    // Reload page to apply all permission changes
    window.location.reload();
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 border border-gray-200"
        title="Switch Role (Testing Only)"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-4 h-4" />
          <span>{currentRole.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Switch Role</p>
              <p className="text-xs text-gray-400 mt-0.5">For testing personas</p>
            </div>
            {roles.map((roleOption) => {
              const Icon = roleOption.icon;
              const isActive = role === roleOption.value;
              return (
                <button
                  key={roleOption.value}
                  onClick={() => handleRoleChange(roleOption.value)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[#F5F3FF] text-[#780096]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{roleOption.label}</span>
                      {isActive && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#780096] text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{roleOption.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

