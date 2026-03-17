import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateDummyOrders, generateDefaultDashboard } from "@/lib/dummyData";
import { toast } from "sonner";

export function useSeedDummyData() {
  const seedAll = useMutation({
    mutationFn: async () => {
      // Seed orders first
      const orders = generateDummyOrders(50);
      const { error: ordersError } = await supabase
        .from("customer_orders")
        .insert(orders);
      if (ordersError) {
        console.error("Supabase orders insert error:", ordersError);
        throw ordersError;
      }
      // Then seed dashboard
      const dashboard = generateDefaultDashboard();
      const { error: dashError } = await supabase
        .from("dashboard_configs")
        .insert({
          id: dashboard.id,
          name: dashboard.name,
          layout: dashboard.layout,
          widgets: dashboard.widgets,
        });
      if (dashError) {
        console.error("Supabase dashboard insert error:", dashError);
        throw dashError;
      }
    },
    onSuccess: () => {
      toast.success("✓ Dashboard populated with sample data!");
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (error) => {
      console.error("Seed dummy data error:", error);
      toast.error("Failed to seed data: " + (error && error.message ? error.message : JSON.stringify(error)));
    },
  });
  return { seedAll };
}
