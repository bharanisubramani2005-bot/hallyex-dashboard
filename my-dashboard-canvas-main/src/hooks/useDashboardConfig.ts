import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardConfig, DashboardLayout, WidgetConfig } from "@/types";
import { toast } from "sonner";

export function useDashboardConfig() {
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: ["dashboard-config"],
    queryFn: async (): Promise<DashboardConfig | null> => {
      const { data, error } = await supabase
        .from("dashboard_configs")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        layout: (data.layout ?? []) as unknown as DashboardLayout[],
        widgets: (data.widgets ?? {}) as unknown as Record<string, WidgetConfig>,
      } as DashboardConfig;
    },
  });

  const saveConfig = useMutation({
    mutationFn: async (config: {
      id?: string;
      layout: DashboardLayout[];
      widgets: Record<string, WidgetConfig>;
    }) => {
      if (config.id) {
        const { error } = await supabase
          .from("dashboard_configs")
          .update({
            layout: config.layout as any,
            widgets: config.widgets as any,
          })
          .eq("id", config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("dashboard_configs").insert([
          {
            layout: config.layout as any,
            widgets: config.widgets as any,
          },
        ]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-config"] });
      toast.success("Dashboard configuration saved");
    },
    onError: (e) => toast.error("Failed to save: " + e.message),
  });

  return { configQuery, saveConfig };
}
