import { Link, useLocation } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, Code, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/coder", label: "Coder AI", icon: Code },
  { to: "/image", label: "Image Gen", icon: ImageIcon },
] as const;

export function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-semibold tracking-tight text-lg shrink-0">
          Neurix<span className="text-ink-soft">®</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-ink-soft hover:text-foreground hover:bg-cream"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
