import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Menu,
  Utensils,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Menu Management", icon: Utensils },
  { to: "/orders", label: "Customer Orders", icon: ShoppingCart },
];

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export function MobileNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Optional: Delete session from Supabase
    const token = getCookie("admin_session_token");
    if (token) {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("admin_sessions").delete().eq("token", token);
    }
    
    // Clear cookie
    document.cookie = "admin_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    window.location.href = "../admin-login.html";
  };

  return (
    <header className="md:hidden flex h-14 items-center border-b border-border px-4 bg-card">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 flex flex-col">
          <div className="flex h-14 items-center border-b border-border px-4">
            <h1 className="text-lg font-bold tracking-tight">Admin Console</h1>
          </div>
          <nav className="space-y-1 p-3 flex-1 flex flex-col">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/" || location.pathname === "/configure"
                    : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Log out</span>
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
