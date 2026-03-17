import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { CustomerOrder } from "@/types";
import { format } from "date-fns";

interface Props {
  orders: CustomerOrder[];
  onEdit: (order: CustomerOrder) => void;
  onDelete: (id: string) => void;
}

export function OrdersTable({ orders, onEdit, onDelete }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusColor = (s: string) => {
    if (s === "Completed") return "default";
    if (s === "In progress") return "secondary";
    return "outline";
  };

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No orders yet. Click "Create Order" to add one.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <ContextMenu key={order.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow className="cursor-context-menu">
                      <TableCell className="font-medium">
                        {order.first_name} {order.last_name}
                      </TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="text-right">{order.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${Number(order.unit_price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${Number(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{order.created_by}</TableCell>
                      <TableCell>
                        {format(new Date(order.order_date), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => onEdit(order)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteId(order.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
