import { useMemo, useState } from "react";
import type { WidgetConfig, CustomerOrder } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  widget: WidgetConfig;
  orders: CustomerOrder[];
}

function getColumnValue(order: CustomerOrder, col: string): string {
  switch (col) {
    case "Customer ID": return order.id.slice(0, 8);
    case "Customer name": return `${order.first_name} ${order.last_name}`;
    case "Email id": return order.email;
    case "Phone number": return order.phone;
    case "Address": return `${order.street_address}, ${order.city}, ${order.state}`;
    case "Order ID": return order.id.slice(0, 8);
    case "Order date": return new Date(order.order_date).toLocaleDateString();
    case "Product": return order.product;
    case "Quantity": return String(order.quantity);
    case "Unit price": return `$${Number(order.unit_price).toFixed(2)}`;
    case "Total amount": return `$${Number(order.total_amount).toFixed(2)}`;
    case "Status": return order.status;
    case "Created by": return order.created_by;
    default: return "";
  }
}

export function TableWidget({ widget, orders }: Props) {
  const { columns, sortBy, pagination, applyFilter, fontSize, headerBackground } =
    widget.settings;
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState("");

  const cols: string[] = columns ?? [];

  const sortedOrders = useMemo(() => {
    let sorted = [...orders];
    if (sortBy === "Ascending") {
      sorted.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sortBy === "Descending") {
      sorted.sort((a, b) => b.first_name.localeCompare(a.first_name));
    } else if (sortBy === "Order date") {
      sorted.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
    }
    return sorted;
  }, [orders, sortBy]);

  const filteredOrders = useMemo(() => {
    if (!applyFilter || !filterText) return sortedOrders;
    const lower = filterText.toLowerCase();
    return sortedOrders.filter((o) =>
      cols.some((c) => getColumnValue(o, c).toLowerCase().includes(lower))
    );
  }, [sortedOrders, applyFilter, filterText, cols]);

  const pageSize = pagination || filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pagedOrders = pagination
    ? filteredOrders.slice(page * pageSize, (page + 1) * pageSize)
    : filteredOrders;

  if (cols.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">{widget.title}</p>
          <p className="text-xs text-muted-foreground">Select columns in settings</p>
        </div>
      </div>
    );
  }

  const fs = fontSize ?? 14;
  const hdrBg = headerBackground ?? "#54bd95";

  return (
    <div className="h-full flex flex-col gap-2" style={{ fontSize: `${fs}px` }}>
      <p className="text-sm font-medium truncate">{widget.title}</p>
      {applyFilter && (
        <Input
          placeholder="Filter..."
          value={filterText}
          onChange={(e) => { setFilterText(e.target.value); setPage(0); }}
          className="h-8 text-xs"
        />
      )}
      <div className="flex-1 overflow-auto rounded border border-border">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: hdrBg }}>
              {cols.map((col) => (
                <TableHead key={col} style={{ color: "white", fontSize: `${fs}px` }}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={cols.length} className="text-center text-muted-foreground">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              pagedOrders.map((order) => (
                <TableRow key={order.id}>
                  {cols.map((col) => (
                    <TableCell key={col} style={{ fontSize: `${fs}px` }}>
                      {getColumnValue(order, col)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
