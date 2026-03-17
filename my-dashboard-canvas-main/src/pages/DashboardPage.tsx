import { useNavigate } from "react-router-dom";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, LayoutGrid } from "lucide-react";
import { useState, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { DATE_FILTER_OPTIONS } from "@/types";
import { WidgetRenderer } from "@/components/dashboard/WidgetRenderer";
import {
  subDays,
  startOfDay,
  isAfter,
} from "date-fns";
import type { CustomerOrder } from "@/types";
import { useSeedDummyData } from "@/hooks/useSeedDummyData";
import { Sparkles } from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

function filterOrders(orders: CustomerOrder[], filter: string): CustomerOrder[] {
  if (filter === "all") return orders;
  const now = new Date();
  let cutoff: Date;
  switch (filter) {
    case "today":
      cutoff = startOfDay(now);
      break;
    case "7days":
      cutoff = subDays(now, 7);
      break;
    case "30days":
      cutoff = subDays(now, 30);
      break;
    case "90days":
      cutoff = subDays(now, 90);
      break;
    default:
      return orders;
  }
  return orders.filter((o) => isAfter(new Date(o.order_date), cutoff));
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { configQuery } = useDashboardConfig();
  const { ordersQuery } = useOrders();
  const { seedAll } = useSeedDummyData();
  const [dateFilter, setDateFilter] = useState("all");

  const config = configQuery.data;
  const hasWidgets = config && config.layout && config.layout.length > 0;

  const filteredOrders = useMemo(
    () => filterOrders(ordersQuery.data ?? [], dateFilter),
    [ordersQuery.data, dateFilter]
  );

  if (!hasWidgets) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">No Dashboard Configured</h2>
          <p className="text-muted-foreground">
            Create a personalized dashboard by adding widgets like charts, tables, and KPI cards.
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="lg" onClick={() => navigate("/configure")}>
              <Settings2 className="mr-2 h-4 w-4" /> Configure Dashboard
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => seedAll.mutate()}
              disabled={seedAll.isPending}
            >
              <Sparkles className="mr-2 h-4 w-4" />{" "}
              {seedAll.isPending ? "Loading..." : "Load Sample Data"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-4 overflow-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Show data for</span>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FILTER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => navigate("/configure")}>
            <Settings2 className="mr-2 h-4 w-4" /> Configure Dashboard
          </Button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: config.layout, md: config.layout, sm: config.layout }}
        breakpoints={{ lg: 1024, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 8, sm: 4 }}
        rowHeight={60}
        isDraggable={false}
        isResizable={false}
        compactType="vertical"
      >
        {config.layout.map((item) => {
          const widget = config.widgets[item.i];
          if (!widget) return <div key={item.i} />;
          return (
            <div key={item.i} className="overflow-hidden">
              <WidgetRenderer widget={widget} orders={filteredOrders} />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
