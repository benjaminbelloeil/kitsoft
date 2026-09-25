"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, FlaskConical, Check } from "lucide-react";
import {
  DEFAULT_DEMO_ROLE,
  DEMO_ROLES,
  DEMO_ROLE_COOKIE,
  DEMO_ROLE_ORDER,
  isDemoMode,
  type DemoRoleKey,
} from "@/lib/demo/config";

const ACCENTURE_PURPLE = "#A100FF";

function readRoleCookie(): DemoRoleKey {
  if (typeof document === "undefined") return DEFAULT_DEMO_ROLE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${DEMO_ROLE_COOKIE}=([^;]*)`));
  const value = match?.[1];
  return value && value in DEMO_ROLES ? (value as DemoRoleKey) : DEFAULT_DEMO_ROLE;
}

export default function DemoRoleSwitcher() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<DemoRoleKey>(DEFAULT_DEMO_ROLE);

  // Read on the client only: the cookie is not available during SSR here, and
  // rendering a guessed role first would cause a hydration mismatch.
  useEffect(() => {
    setRole(readRoleCookie());
    setMounted(true);
  }, []);

  if (!isDemoMode() || !mounted || pathname === "/login") return null;

  const selectRole = (next: DemoRoleKey) => {
    if (next === role) {
      setOpen(false);
      return;
    }
    document.cookie = `${DEMO_ROLE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    // Full reload so server components and the user context both re-resolve.
    window.location.reload();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-72 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-900">Modo demostración</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Datos de ejemplo. Cambia de rol para ver los distintos paneles.
              </p>
            </div>
            <ul className="py-1">
              {DEMO_ROLE_ORDER.map((key) => {
                const option = DEMO_ROLES[key];
                const active = key === role;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => selectRole(key)}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 transition-colors flex items-start gap-2.5"
                    >
                      <span className="mt-0.5 w-4 shrink-0">
                        {active && <Check size={16} style={{ color: ACCENTURE_PURPLE }} />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block text-sm font-medium"
                          style={{ color: active ? ACCENTURE_PURPLE : "#111827" }}
                        >
                          {option.titulo}
                        </span>
                        <span className="block text-xs text-gray-500 leading-snug">
                          {option.descripcion}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Cambiar rol de demostración"
        className="flex items-center gap-2 rounded-full pl-3.5 pr-3 py-2.5 text-white shadow-lg hover:shadow-xl transition-shadow"
        style={{ background: `linear-gradient(135deg, ${ACCENTURE_PURPLE} 0%, #7F00FF 100%)` }}
      >
        <FlaskConical size={16} />
        <span className="text-sm font-medium">Demo · {DEMO_ROLES[role].titulo}</span>
        <ChevronUp
          size={16}
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
    </div>
  );
}
