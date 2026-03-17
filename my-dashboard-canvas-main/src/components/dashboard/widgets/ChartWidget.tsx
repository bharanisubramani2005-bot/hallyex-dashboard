import type { WidgetConfig, CustomerOrder } from "@/types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useMemo } from "react";

interface Props {
  widget: WidgetConfig;
  orders: CustomerOrder[];
}

function getFieldValue(order: CustomerOrder, field: string): string | number {
  switch (field) {
    case "Product": return order.product;
    case "Quantity": return order.quantity;
    case "Unit price": return Number(order.unit_price);
    case "Total amount": return Number(order.total_amount);
    case "Status": return order.status;
    case "Created by": return order.created_by;
    case "Duration": return Math.floor((Date.now() - new Date(order.order_date).getTime()) / 86400000);
    default: return "";
  }
}

function aggregateData(orders: CustomerOrder[], xField: string, yField: string) {
  const groups: Record<string, { sum: number; count: number }> = {};
  orders.forEach((o) => {
    const xVal = String(getFieldValue(o, xField));
    const yVal = Number(getFieldValue(o, yField)) || 0;
    if (!groups[xVal]) groups[xVal] = { sum: 0, count: 0 };
    groups[xVal].sum += yVal;
    groups[xVal].count += 1;
  });
  return Object.entries(groups).map(([name, { sum, count }]) => ({
    name,
    value: sum,
    count,
  }));
}

export function ChartWidget({ widget, orders }: Props) {
  const { xAxis, yAxis, chartColor, showDataLabel } = widget.settings;
  const color = chartColor || "#54bd95";

  const data = useMemo(() => {
    if (!xAxis || !yAxis) return [];
    return aggregateData(orders, xAxis, yAxis);
  }, [orders, xAxis, yAxis]);

  if (!xAxis || !yAxis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">{widget.title}</p>
          <p className="text-xs text-muted-foreground">Configure axes in settings</p>
        </div>
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 15, right: 15, left: 5, bottom: 5 },
  };

  const renderChart = () => {
    switch (widget.type) {
      case "bar-chart":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} label={showDataLabel ? { position: "top", fontSize: 10 } : undefined} />
          </BarChart>
        );
      case "line-chart":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot label={showDataLabel ? { position: "top", fontSize: 10 } : undefined} />
          </LineChart>
        );
      case "area-chart":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} label={showDataLabel ? { position: "top", fontSize: 10 } : undefined} />
          </AreaChart>
        );
      case "scatter-plot":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis dataKey="value" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Scatter data={data} fill={color} />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <p className="text-sm font-medium mb-1 truncate">{widget.title}</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()!}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
