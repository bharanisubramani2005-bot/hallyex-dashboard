import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, BarChart3, LineChart, PieChart, AreaChart, ScatterChart as ScatterIcon, Table2, Activity } from "lucide-react";
import { useState } from "react";
import type { WidgetType } from "@/types";

interface Props {
  onAddWidget: (type: WidgetType) => void;
}

const categories = [
  {
    label: "Charts",
    items: [
      { type: "bar-chart" as WidgetType, label: "Bar Chart", icon: BarChart3 },
      { type: "line-chart" as WidgetType, label: "Line Chart", icon: LineChart },
      { type: "pie-chart" as WidgetType, label: "Pie Chart", icon: PieChart },
      { type: "area-chart" as WidgetType, label: "Area Chart", icon: AreaChart },
      { type: "scatter-plot" as WidgetType, label: "Scatter Plot", icon: ScatterIcon },
    ],
  },
  {
    label: "Tables",
    items: [
      { type: "table" as WidgetType, label: "Table", icon: Table2 },
    ],
  },
  {
    label: "KPIs",
    items: [
      { type: "kpi" as WidgetType, label: "KPI Value", icon: Activity },
    ],
  },
];

export function WidgetPalette({ onAddWidget }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Charts: true,
    Tables: true,
    KPIs: true,
  });

  return (
    <div className="w-56 border-r border-border bg-card p-3 overflow-y-auto hidden md:block">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Widgets
      </p>
      {categories.map((cat) => (
        <Collapsible
          key={cat.label}
          open={openSections[cat.label]}
          onOpenChange={(open) =>
            setOpenSections((prev) => ({ ...prev, [cat.label]: open }))
          }
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-sm font-medium hover:text-primary transition-colors">
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${
                openSections[cat.label] ? "rotate-90" : ""
              }`}
            />
            {cat.label}
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-5 space-y-0.5">
            {cat.items.map((item) => (
              <button
                key={item.type}
                onClick={() => onAddWidget(item.type)}
                className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
