"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type ItemNav = { href: string; label: string };

export function Nav({ items }: { items: ItemNav[] }) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  if (!items.length) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 md:hidden"
      >
        <span aria-hidden>{abierto ? "✕" : "☰"}</span>
        Menú
      </button>

      <nav
        className={`${abierto ? "flex" : "hidden"} flex-col gap-1 border-b border-slate-200 bg-white px-3 py-2 md:flex md:w-56 md:flex-col md:border-b-0 md:border-r md:py-4`}
      >
        {items.map((item) => {
          const activo = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAbierto(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                activo
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
