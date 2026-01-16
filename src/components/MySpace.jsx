import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Rocket, Code, Sparkles, Edit, Trash2, Eye, Copy } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { usePermissions } from "../hooks/usePermissions";

export default function MySpace({ onLaunchBuilder, onEditApp, onViewApp }) {
  const { user, isAuthenticated } = useAuth();
  const permissions = usePermissions();

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <div className="px-4 md:px-10 py-8">
        <div className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_45px_85px_rgba(15,10,45,0.15)] p-6 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-text01 mb-2">Sign In Required</h2>
          <p className="text-text02">Please sign in to access My Space.</p>
        </div>
      </div>
    );
  }

  // Redirect if no access
  if (!permissions.canAccessMySpace) {
    return (
      <div className="px-4 md:px-10 py-8">
        <div className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_45px_85px_rgba(15,10,45,0.15)] p-6 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-text01 mb-2">Access Restricted</h2>
          <p className="text-text02">You need Developer or Admin access to view My Space.</p>
        </div>
      </div>
    );
  }
  const [filter, setFilter] = useState("all"); // "all", "published", "workspace"

  // Load user's apps from localStorage (in real app, this would be from backend)
  const [userApps, setUserApps] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fabStore.userApps");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const filteredApps = useMemo(() => {
    if (filter === "all") return userApps;
    if (filter === "published") return userApps.filter((app) => app.status === "Published");
    if (filter === "workspace") return userApps.filter((app) => app.status === "Workspace");
    return userApps;
  }, [userApps, filter]);

  const publishedCount = userApps.filter((app) => app.status === "Published").length;
  const workspaceCount = userApps.filter((app) => app.status === "Workspace").length;

  const handleDeleteApp = (appId) => {
    if (confirm("Are you sure you want to delete this app?")) {
      const updated = userApps.filter((app) => app.id !== appId);
      setUserApps(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("fabStore.userApps", JSON.stringify(updated));
      }
    }
  };

  return (
    <div className="px-4 md:px-10 py-8">
      <div className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_45px_85px_rgba(15,10,45,0.15)] p-6 md:p-10 space-y-6 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-pinkTP">My Space</div>
            <h1 className="text-3xl font-bold text-text01 mt-2">Your Applications</h1>
            <p className="text-sm text-text02 mt-1">
              Manage your published solutions and apps under development
            </p>
          </div>
          {permissions.canAccessAppBuilder && (
            <button
              onClick={onLaunchBuilder}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pinkTP to-pinkTP text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New App
            </button>
          )}
        </div>

        {/* Stats & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg03">
            <Rocket className="w-4 h-4 text-success03" />
            <span className="text-sm font-semibold text-text01">
              {publishedCount} Published
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg03">
            <Code className="w-4 h-4 text-neutral02" />
            <span className="text-sm font-semibold text-text01">
              {workspaceCount} In Development
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-pinkTP text-white"
                  : "bg-bg03 text-text01 hover:bg-stroke01"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "published"
                  ? "bg-pinkTP text-white"
                  : "bg-bg03 text-text01 hover:bg-stroke01"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter("workspace")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "workspace"
                  ? "bg-pinkTP text-white"
                  : "bg-bg03 text-text01 hover:bg-stroke01"
              }`}
            >
              In Development
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pinkTP to-pinkTP mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text01 mb-2">
              {filter === "all" ? "No apps yet" : filter === "published" ? "No published apps" : "No apps in development"}
            </h3>
            <p className="text-text02 mb-6">
              {filter === "all"
                ? "Create your first app using the AI-powered builder"
                : filter === "published"
                ? "Publish an app to see it here"
                : "Start building an app to see it here"}
            </p>
            {filter === "all" && (
              <button
                onClick={permissions.canAccessAppBuilder ? onLaunchBuilder : undefined}
                disabled={!permissions.canAccessAppBuilder}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pinkTP to-pinkTP text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Create Your First App
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-stroke01 bg-white p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text01">{app.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          app.status === "Published"
                            ? "bg-success01 text-success02"
                            : "bg-neutral01 text-neutral02"
                        }`}
                      >
                        {app.status === "Published" ? (
                          <>
                            <Rocket className="w-3 h-3 inline mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Code className="w-3 h-3 inline mr-1" />
                            In Development
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-text02">{app.tagline || app.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-text03">
                    <span className="font-medium">Platform:</span>
                    <span>{app.platformName || "SOP Executor"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text03">
                    <span className="font-medium">Industry:</span>
                    <span>{app.industry || "Cross-Industry"}</span>
                  </div>
                  {app.lastModified && (
                    <div className="flex items-center gap-2 text-xs text-text03">
                      <span className="font-medium">Last modified:</span>
                      <span>{new Date(app.lastModified).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-bg03">
                  {app.status === "Workspace" ? (
                    <>
                      <button
                        onClick={() => onEditApp?.(app)}
                        className="flex-1 px-3 py-2 rounded-lg bg-pinkTP text-white text-sm font-medium hover:bg-pinkTP transition-colors"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Continue Building
                      </button>
                      <button
                        onClick={() => onViewApp?.(app)}
                        className="px-3 py-2 rounded-lg border border-stroke01 text-text01 text-sm font-medium hover:bg-bg02 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onViewApp?.(app)}
                        className="flex-1 px-3 py-2 rounded-lg bg-pinkTP text-white text-sm font-medium hover:bg-pinkTP transition-colors"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Launch App
                      </button>
                      <button
                        onClick={() => onEditApp?.(app)}
                        className="px-3 py-2 rounded-lg border border-stroke01 text-text01 text-sm font-medium hover:bg-bg02 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteApp(app.id)}
                    className="px-3 py-2 rounded-lg border border-error01 text-error02 text-sm font-medium hover:bg-error01 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

