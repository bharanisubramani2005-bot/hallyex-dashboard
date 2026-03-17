import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { WidgetPalette } from "@/components/dashboard/WidgetPalette";
import { WidgetSettingsPanel } from "@/components/dashboard/WidgetSettingsPanel";
import { WidgetRenderer } from "@/components/dashboard/WidgetRenderer";
import { useOrders } from "@/hooks/useOrders";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { DashboardLayout, WidgetConfig, WidgetType } from "@/types";
import { v4Fallback } from "@/lib/id";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_SIZES: Record<WidgetType, { w: number; h: number }> = {
  "bar-chart": { w: 5, h: 5 },
  "line-chart": { w: 5, h: 5 },
  "area-chart": { w: 5, h: 5 },
  "scatter-plot": { w: 5, h: 5 },
  "pie-chart": { w: 4, h: 4 },
  table: { w: 4, h: 4 },
  kpi: { w: 2, h: 2 },
};

const TYPE_LABELS: Record<WidgetType, string> = {
  "bar-chart": "Bar Chart",
  "line-chart": "Line Chart",
  "area-chart": "Area Chart",
  "scatter-plot": "Scatter Plot",
  "pie-chart": "Pie Chart",
  table: "Table",
  kpi: "KPI",
};

export default function ConfigureDashboardPage() {
  const navigate = useNavigate();
  const { configQuery, saveConfig } = useDashboardConfig();
  const { ordersQuery } = useOrders();
  const [layout, setLayout] = useState<DashboardLayout[]>([]);
  const [widgets, setWidgets] = useState<Record<string, WidgetConfig>>({});
  const [settingsWidgetId, setSettingsWidgetId] = useState<string | null>(null);
  const [deleteWidgetId, setDeleteWidgetId] = useState<string | null>(null);

  useEffect(() => {
    if (configQuery.data) {
      console.log("Dashboard config loaded:", configQuery.data);
      setLayout(configQuery.data.layout || []);
      setWidgets(configQuery.data.widgets || {});
    }
  }, [configQuery.data]);

  useEffect(() => {
    console.log("Active settings widget ID:", settingsWidgetId);
    if (settingsWidgetId) {
      console.log("Active widget config:", widgets[settingsWidgetId]);
    }
  }, [settingsWidgetId, widgets]);

  const addWidget = useCallback(
    (type: WidgetType) => {
      console.log("Adding widget of type:", type);
      const id = v4Fallback();
      const size = DEFAULT_SIZES[type];
      
      const defaultSettings: any = {};
      if (["bar-chart", "line-chart", "area-chart", "scatter-plot"].includes(type)) {
        defaultSettings.xAxis = "Product";
        defaultSettings.yAxis = "Total amount";
        defaultSettings.chartColor = "#54bd95";
        defaultSettings.showDataLabel = true;
      } else if (type === "pie-chart") {
        defaultSettings.chartData = "Product";
        defaultSettings.showLegend = true;
      } else if (type === "table") {
        defaultSettings.columns = ["Product", "Quantity", "Total amount", "Status"];
        defaultSettings.pagination = 5;
      } else if (type === "kpi") {
        defaultSettings.metric = "Total amount";
        defaultSettings.aggregation = "Sum";
        defaultSettings.dataFormat = "Currency";
      }

      const newLayout: DashboardLayout = {
        i: id,
        x: 0,
        y: Infinity,
        w: size.w,
        h: size.h,
      };
      const newWidget: WidgetConfig = {
        id,
        type,
        title: `New ${TYPE_LABELS[type]}`,
        width: size.w,
        height: size.h,
        settings: defaultSettings,
      };
      setLayout((prev) => [...prev, newLayout]);
      setWidgets((prev) => ({ ...prev, [id]: newWidget }));
    },
    []
  );

  const deleteWidget = useCallback((id: string) => {
    setLayout((prev) => prev.filter((l) => l.i !== id));
    setWidgets((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setDeleteWidgetId(null);
  }, []);

  const handleLayoutChange = useCallback((newLayout: any[]) => {
    const mapped = newLayout.map((l) => ({
      i: l.i,
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
    }));
    setLayout(mapped);
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    console.log("Updating widget:", id, updates);
    setWidgets((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
    // Also update layout if width/height changed
    if (updates.width !== undefined || updates.height !== undefined) {
      setLayout((prev) =>
        prev.map((l) =>
          l.i === id
            ? {
                ...l,
                w: updates.width ?? l.w,
                h: updates.height ?? l.h,
              }
            : l
        )
      );
    }
  }, []);

  const handleSave = () => {
    saveConfig.mutate(
      {
        id: configQuery.data?.id,
        layout,
        widgets,
      },
      { onSuccess: () => navigate("/") }
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold">Configure Dashboard</h1>
        </div>
        <Button onClick={handleSave} disabled={saveConfig.isPending}>
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Widget Palette */}
        <WidgetPalette onAddWidget={addWidget} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-muted/30">
          {layout.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Drag widgets from the sidebar to start building your dashboard</p>
            </div>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout, md: layout, sm: layout }}
              breakpoints={{ lg: 1024, md: 768, sm: 0 }}
              cols={{ lg: 12, md: 8, sm: 4 }}
              rowHeight={60}
              onLayoutChange={handleLayoutChange}
              isDraggable
              isResizable
              compactType="vertical"
              draggableHandle=".widget-drag-handle"
            >
              {layout.map((item) => {
                const widget = widgets[item.i];
                if (!widget) return <div key={item.i} />;
                return (
                  <div
                    key={item.i}
                    className="group relative bg-card border border-border rounded-lg overflow-hidden"
                  >
                    {/* Drag handle + actions */}
                    <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-3 z-20 bg-card/60 backdrop-blur-sm border-b border-border/50">
                      <div className="widget-drag-handle flex-1 h-full cursor-move flex items-center overflow-hidden">
                        <span className="text-xs text-muted-foreground font-semibold truncate">
                          {widget.title}
                        </span>
                      </div>
                      <div className="flex gap-1.5 ml-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            setSettingsWidgetId(item.i); 
                          }}
                        >
                          <SettingsIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            setDeleteWidgetId(item.i); 
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="h-full p-3 pt-2">
                      <WidgetRenderer widget={widget} orders={ordersQuery.data ?? []} />
                    </div>
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          )}
        </div>

        <Sheet 
          open={!!settingsWidgetId} 
          onOpenChange={(open) => !open && setSettingsWidgetId(null)}
        >
          <SheetContent side="right" className="w-[350px] sm:w-[480px] p-0 border-l border-border bg-card shadow-xl overflow-y-auto">
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="sr-only">
                <SheetHeader>
                  <SheetTitle>Widget Settings</SheetTitle>
                  <SheetDescription>Configure your dashboard widget properties</SheetDescription>
                </SheetHeader>
              </div>
              {settingsWidgetId && widgets[settingsWidgetId] && (
                <WidgetSettingsPanel
                  widget={widgets[settingsWidgetId]}
                  onUpdate={(updates) => updateWidget(settingsWidgetId, updates)}
                  onDelete={(id) => {
                    setDeleteWidgetId(id);
                    setSettingsWidgetId(null);
                  }}
                  onClose={() => setSettingsWidgetId(null)}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteWidgetId} onOpenChange={() => setDeleteWidgetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this widget from the dashboard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteWidgetId && deleteWidget(deleteWidgetId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
