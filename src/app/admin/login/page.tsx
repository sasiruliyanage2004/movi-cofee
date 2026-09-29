"use client";

import React, { useState } from "react";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { KeyRound, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await loginAction(password, email);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Authentication failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso text-warm-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-warm-cream/60 hover:text-muted-gold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Site
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-muted-gold/20 flex items-center justify-center mx-auto mb-4 text-muted-gold border border-muted-gold/40">
          <KeyRound className="w-6 h-6" />
        </div>
        <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted-gold font-medium">
          {siteConfig.name} • MANAGEMENT
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-warm-cream mt-2">
          Owner Portal Access
        </h2>
        <p className="font-sans text-xs text-warm-cream/60 mt-2 font-light">
          Sign in to manage live table reservations, guest inquiries, stock, and business analytics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#231A15] py-8 px-6 sm:px-10 border border-warm-cream/15 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-gold mb-1.5"
              >
                Owner Email (Optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@movicoffee.lk"
                className="w-full bg-espresso border border-warm-cream/20 px-3.5 py-2.5 text-sm text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold font-sans"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-gold mb-1.5"
              >
                Passkey / Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Default: movi2026"
                className="w-full bg-espresso border border-warm-cream/20 px-3.5 py-2.5 text-sm text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold font-sans"
              />
              <p className="text-[10px] text-warm-cream/40 mt-1.5">
                Default platform passkey: <code className="text-muted-gold font-mono">movi2026</code>
              </p>
            </div>

            <Button
              variant="gold"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-warm-cream/10 text-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-warm-cream/50">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-gold" />
              Secured Session • Role: Store Owner / Lead Barista
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
