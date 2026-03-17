import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import DashboardPage from "./pages/DashboardPage";
import ConfigureDashboardPage from "./pages/ConfigureDashboardPage";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Helper to get cookie
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

// Auth Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Allow bypass via URL for debugging
      const params = new URLSearchParams(window.location.search);
      if (params.get('bypassAuth') === 'true') {
        setIsAuthenticated(true);
        return;
      }

      // Prevent Vite SPA redirect loops in local development mode
      // Dev mode automatically acts as logged in
      if (import.meta.env.DEV) {
        setIsAuthenticated(true);
        return;
      }

      const loginUrl = "../admin-login.html";
      const token = getCookie("admin_session_token");
      
      if (!token) {
        window.location.href = loginUrl;
        return;
      }

      // Verify token with Supabase
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('id')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        // Invalid session
        document.cookie = "admin_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = loginUrl;
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
          <span className="text-xl">🛡️</span>
        </div>
        <p className="text-sm font-medium text-slate-500">Verifying access...</p>
        <button 
          onClick={() => setIsAuthenticated(true)}
          className="text-xs text-slate-400 underline"
        >
          Skip verification (Debug)
        </button>
      </div>
    </div>
  );
  
  if (!isAuthenticated) return null; // Should be handled by redirects above
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthGuard>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <MobileNav />
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/configure" element={<ConfigureDashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </AuthGuard>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
