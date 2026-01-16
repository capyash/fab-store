import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Sparkles, Lock, ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function FabStoreLogin({ onBack, onLoginSuccess }) {
  const { login } = useAuth();
  const [email] = useState("vinod@tp.ai");
  const [password] = useState("vkvs_nbt");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: email.trim(), password, remember });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/fab-login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability on top of photo */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Animated background elements on top of image */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-1/4 w-[520px] h-[520px] bg-[rgba(109,53,207,0.3)] blur-[220px]" />
        <div className="absolute bottom-[-60px] right-1/5 w-[540px] h-[540px] bg-[rgba(87,198,255,0.25)] blur-[240px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] bg-[rgba(255,208,233,0.22)] blur-[260px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(114,103,255,0.07) 1px, transparent 1px),
                            linear-gradient(0deg, rgba(114,103,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="absolute -top-16 left-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-pinkTP bg-white/95 border border-[stroke01] shadow-[0_10px_30px_rgba(92,54,200,0.12)] hover:-translate-x-[2px] transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Store
          </motion.button>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-text01"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[stroke01] bg-white text-pinkTP font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-[alert02]" />
                TP.ai FAB
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Unlock every experience
                <br />
                <span className="bg-gradient-to-r from-[tertiary] via-[tertiary] to-[neutral01] bg-clip-text text-transparent">
                  with one identity
                </span>
              </h1>
              <p className="text-lg text-text02 max-w-md">
                Access Cogniclaim, Assist, Collect, Banking Command, and all TP.ai solutions from a single secure login.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: Zap, text: "Instant access to all FAB solutions" },
                { icon: Shield, text: "Enterprise-grade security & compliance" },
                { icon: Globe, text: "Single sign-on across platforms" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-3 text-text02"
                  >
                    <div className="p-2 rounded-lg border border-pinkTP/10 bg-white text-pinkTP">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white rounded-[32px] border border-white/70 p-8 shadow-[0_35px_90px_rgba(34,22,95,0.17)]">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pinkTP to-[textLink] text-white shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-text01">Sign in to FAB</h2>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error03 bg-error01 border border-error01 rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text01">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white border border-stroke01 rounded-xl px-4 py-3 text-text01 placeholder-text03 focus:outline-none focus:ring-2 focus:ring-[tertiary]/60 focus:border-[tertiary]/60 transition-all"
                    value={email}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text01">Password</label>
                  <input
                    type="password"
                    className="w-full bg-white border border-stroke01 rounded-xl px-4 py-3 text-text01 placeholder-text03 focus:outline-none focus:ring-2 focus:ring-[tertiary]/60 focus:border-[tertiary]/60 transition-all"
                    value={password}
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-text02">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-stroke01 text-pinkTP focus:ring-[tertiary]/50"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-sm text-pinkTP font-semibold hover:text-[textLink] transition-colors"
                    onClick={() => alert("Contact IT helpdesk to reset your password.")}
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-pinkTP via-pinkTP to-[neutral02] text-white rounded-xl py-3.5 text-sm font-semibold hover:shadow-lg hover:shadow-/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-text01/30 border-t-text01 rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 text-center">
                  By continuing, you agree to TP.ai policies. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

