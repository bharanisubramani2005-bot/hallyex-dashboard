import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Loader } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderFormDialog } from "@/components/orders/OrderFormDialog";
import type { CustomerOrder, OrderFormData } from "@/types";

export default function OrdersPage() {
  const { ordersQuery, createOrder, updateOrder, deleteOrder } = useOrders();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<CustomerOrder | null>(null);

  console.log("OrdersPage render - query state:", {
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    dataLength: ordersQuery.data?.length ?? 0,
    error: ordersQuery.error?.message
  });

  const handleSubmit = (data: OrderFormData) => {
    if (editOrder) {
      updateOrder.mutate({ ...data, id: editOrder.id }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditOrder(null);
        },
      });
    } else {
      createOrder.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleEdit = (order: CustomerOrder) => {
    setEditOrder(order);
    setDialogOpen(true);
  };

  // Handle loading state
  if (ordersQuery.isLoading) {
    console.log("OrdersPage: showing loading state");
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (ordersQuery.isError) {
    console.log("OrdersPage: showing error state", ordersQuery.error);
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-lg font-bold text-red-900">Failed to Load Orders</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {ordersQuery.error instanceof Error 
                ? ordersQuery.error.message 
                : "Unable to fetch orders from the database. Please check your connection and try again."}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => ordersQuery.refetch()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  console.log("OrdersPage: showing content with", ordersQuery.data?.length ?? 0, "orders");
  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer orders and track their status.
          </p>
        </div>
        <Button onClick={() => { setEditOrder(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <OrdersTable
        orders={ordersQuery.data ?? []}
        onEdit={handleEdit}
        onDelete={(id) => deleteOrder.mutate(id)}
      />

      <OrderFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditOrder(null);
        }}
        onSubmit={handleSubmit}
        editOrder={editOrder}
        isLoading={createOrder.isPending || updateOrder.isPending}
      />
    </div>
  );
}
