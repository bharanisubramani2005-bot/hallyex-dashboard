import type { WidgetConfig, CustomerOrder } from "@/types";
import { KpiWidget } from "./widgets/KpiWidget";
import { ChartWidget } from "./widgets/ChartWidget";
import { PieWidget } from "./widgets/PieWidget";
import { TableWidget } from "./widgets/TableWidget";

interface Props {
  widget: WidgetConfig;
  orders: CustomerOrder[];
}

export function WidgetRenderer({ widget, orders }: Props) {
  switch (widget.type) {
    case "kpi":
      return <KpiWidget widget={widget} orders={orders} />;
    case "bar-chart":
    case "line-chart":
    case "area-chart":
    case "scatter-plot":
      return <ChartWidget widget={widget} orders={orders} />;
    case "pie-chart":
      return <PieWidget widget={widget} orders={orders} />;
    case "table":
      return <TableWidget widget={widget} orders={orders} />;
    default:
      return <div className="p-4 text-muted-foreground text-sm">Unknown widget</div>;
  }
}
