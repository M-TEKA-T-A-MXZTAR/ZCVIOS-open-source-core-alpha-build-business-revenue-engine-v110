"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Daily Command" },
  { href: "/revenue", label: "Weekly Revenue" },
  { href: "/logs", label: "Manual Logs" },
  { href: "/reports/weekly", label: "Weekly Report" },
  { href: "/reports/monthly", label: "Monthly Report" },
  { href: "/settings", label: "Settings" },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-10 text-sm text-zinc-400">Loading workspace...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500" data-testid="app-version-label">
              ZC-VIOS Core v1.1.0-alpha
            </p>
            <h1 className="font-heading text-xl font-black tracking-tight" data-testid="app-title-heading">
              Command Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-zinc-400" data-testid="session-user-email">
              {session.user.email}
            </p>
            <Button
              variant="ghost"
              data-testid="logout-button"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
        <div className="border-t border-zinc-800 bg-zinc-900/70 px-6 py-2 md:px-10" data-testid="alpha-disclaimer-banner">
          <p className="text-xs text-zinc-400" data-testid="alpha-disclaimer-text">
            Alpha template: core engine for testing and iteration. External integrations are optional add-ons.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 md:grid-cols-[260px_1fr] md:px-10">
        <aside className="border border-zinc-800 bg-zinc-900/70 p-4" data-testid="main-nav-panel">
          <nav className="flex flex-col gap-2" data-testid="main-nav-list">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  style={active ? { color: "#09090b" } : undefined}
                  className={`block border px-3 py-2 text-sm uppercase tracking-wider transition-colors duration-200 ${
                    active
                      ? "border-zinc-300 bg-zinc-200 text-black"
                      : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-8" data-testid="main-content-panel">
          {children}
        </main>
      </div>
    </div>
  );
};
