import type { WidgetConfig, CustomerOrder } from "@/types";
import { NUMERIC_FIELDS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  widget: WidgetConfig;
  orders: CustomerOrder[];
}

function getFieldValue(order: CustomerOrder, metric: string): number {
  switch (metric) {
    case "Total amount": return Number(order.total_amount);
    case "Unit price": return Number(order.unit_price);
    case "Quantity": return order.quantity;
    default: return 0;
  }
}

export function KpiWidget({ widget, orders }: Props) {
  const { metric, aggregation, dataFormat, decimalPrecision } = widget.settings;
  const precision = decimalPrecision ?? 0;

  let value: number | string = 0;

  if (!metric) {
    return (
      <Card className="h-full flex flex-col justify-center">
        <CardContent className="pt-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">{widget.title}</p>
          <p className="text-xs text-muted-foreground mt-1">Configure metric in settings</p>
        </CardContent>
      </Card>
    );
  }

  const isNumeric = NUMERIC_FIELDS.includes(metric);

  if (!isNumeric || aggregation === "Count") {
    value = orders.length;
  } else {
    const values = orders.map((o) => getFieldValue(o, metric));
    if (aggregation === "Sum") {
      value = values.reduce((a, b) => a + b, 0);
    } else if (aggregation === "Average") {
      value = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    } else {
      value = values.reduce((a, b) => a + b, 0);
    }
  }

  const formatted =
    dataFormat === "Currency"
      ? `$${Number(value).toFixed(precision)}`
      : Number(value).toFixed(precision);

  return (
    <Card className="h-full flex flex-col justify-center border-0 shadow-none">
      <CardContent className="pt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-1">{widget.title}</p>
        <p className="text-3xl font-bold">{formatted}</p>
        {widget.description && (
          <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
