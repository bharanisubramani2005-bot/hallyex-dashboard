import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomerOrder, OrderFormData } from "@/types";
import { toast } from "sonner";

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["customer-orders"],
    queryFn: async (): Promise<CustomerOrder[]> => {
      console.log("Fetching orders from Supabase...");
      const { data, error } = await supabase
        .from("customer_orders")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("Orders response:", { data, error });
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      console.log("Orders fetched successfully:", data?.length ?? 0, "items");
      return (data ?? []) as CustomerOrder[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async (order: OrderFormData) => {
      const { data, error } = await supabase
        .from("customer_orders")
        .insert([order])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast.success("Order created successfully");
    },
    onError: (e) => toast.error("Failed to create order: " + e.message),
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...order }: OrderFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("customer_orders")
        .update(order)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast.success("Order updated successfully");
    },
    onError: (e) => toast.error("Failed to update order: " + e.message),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("customer_orders")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (e) => toast.error("Failed to delete order: " + e.message),
  });

  return { ordersQuery, createOrder, updateOrder, deleteOrder };
}
