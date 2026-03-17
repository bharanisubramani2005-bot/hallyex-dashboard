import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function AppSidebar() {
  const location = useLocation();

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
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
          Admin Console
        </h1>
      </div>
      <nav className="flex-1 space-y-1 p-3 flex flex-col justify-between">
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
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
        <div className="pt-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-red-500">Log out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
