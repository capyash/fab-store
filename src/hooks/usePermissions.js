import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";

/**
 * Permission hook for role-based access control
 * 
 * Roles:
 * - admin: Full platform access
 * - developer: Can build and edit applications
 * - user: Can only use published applications
 */
export function usePermissions() {
  const { user } = useAuth();

  const role = user?.role || "user";

  const permissions = useMemo(() => {
    const isAdmin = role === "admin";
    const isDeveloper = role === "developer";
    const isUser = role === "user";

    return {
      // Role checks
      isAdmin,
      isDeveloper,
      isUser,
      role,

      // AppBuilder permissions
      canBuildApps: isAdmin || isDeveloper,
      canEditApps: isAdmin || isDeveloper,
      canEditAnyApp: isAdmin, // Only admin can edit others' apps
      canAccessAppBuilder: isAdmin || isDeveloper,

      // Publishing permissions
      canPublishApps: isAdmin, // Direct publish (no approval)
      canSubmitApps: isAdmin || isDeveloper, // Submit for review
      canPublishModels: isAdmin,
      canPublishPlatformComponents: isAdmin,
      canPublishPlatforms: isAdmin,

      // Platform management
      canManagePlatforms: isAdmin,
      canManageUsers: isAdmin,
      canViewAnalytics: isAdmin,

      // My Space access
      canAccessMySpace: isAdmin || isDeveloper,

      // Store access
      canViewStore: true, // Everyone can view
      canLaunchApps: true, // Everyone can launch
      canCloneTemplates: isAdmin || isDeveloper,
    };
  }, [role]);

  return permissions;
}

