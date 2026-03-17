import type { WidgetConfig, CustomerOrder } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";

interface Props {
  widget: WidgetConfig;
  orders: CustomerOrder[];
}

const COLORS = ["#54bd95", "#4a90d9", "#9b59b6", "#f39c12", "#e74c3c", "#1abc9c", "#34495e", "#e67e22"];

function getFieldValue(order: CustomerOrder, field: string): string {
  switch (field) {
    case "Product": return order.product;
    case "Quantity": return String(order.quantity);
    case "Unit price": return String(order.unit_price);
    case "Total amount": return String(order.total_amount);
    case "Status": return order.status;
    case "Created by": return order.created_by;
    default: return "";
  }
}

export function PieWidget({ widget, orders }: Props) {
  const { chartData, showLegend } = widget.settings;

  const data = useMemo(() => {
    if (!chartData) return [];
    const groups: Record<string, number> = {};
    orders.forEach((o) => {
      const val = getFieldValue(o, chartData);
      groups[val] = (groups[val] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [orders, chartData]);

  if (!chartData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">{widget.title}</p>
          <p className="text-xs text-muted-foreground">Configure data in settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <p className="text-sm font-medium mb-1 truncate">{widget.title}</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="70%"
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
