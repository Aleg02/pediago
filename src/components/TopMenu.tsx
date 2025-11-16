"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const MENU_ITEMS = [
  {
    label: "À propos de PediaGo",
    description: "Présentation, objectifs et conditions d'utilisation",
    href: "/a-propos",
  },
  {
    label: "Mon compte / Abonnement",
    description: "Gestion de l'accès et des formules",
    href: "/mon-compte",
  },
  {
    label: "Support / Contact",
    description: "Signaler un problème ou poser une question",
    href: "/support-contact",
  },
];

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonId = "global-menu-button";
  const panelId = "global-menu-panel";

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!isOpen) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 flex justify-end sm:right-6 sm:top-6">
      <div ref={menuRef} className="pointer-events-auto">
        <button
          id={buttonId}
          aria-haspopup="true"
          aria-controls={panelId}
          aria-expanded={isOpen}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md shadow-slate-900/5 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span className="sr-only">Ouvrir le menu</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>
        {isOpen && (
          <div
            id={panelId}
            role="menu"
            aria-labelledby={buttonId}
            className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200/80 bg-white/95 p-3 text-left shadow-xl shadow-slate-900/10 backdrop-blur"
          >
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Menu PediaGo
            </p>
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
