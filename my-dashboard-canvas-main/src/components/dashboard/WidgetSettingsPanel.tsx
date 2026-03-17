import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X, Trash2 } from "lucide-react";
import type { WidgetConfig } from "@/types";
import {
  AXIS_OPTIONS,
  TABLE_COLUMN_OPTIONS,
  KPI_METRIC_OPTIONS,
  NUMERIC_FIELDS,
} from "@/types";

interface Props {
  widget: WidgetConfig;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  "bar-chart": "Bar Chart",
  "line-chart": "Line Chart",
  "area-chart": "Area Chart",
  "scatter-plot": "Scatter Plot",
  "pie-chart": "Pie Chart",
  table: "Table",
  kpi: "KPI",
};

export function WidgetSettingsPanel({ widget, onUpdate, onDelete, onClose }: Props) {
  const s = widget.settings;

  const updateSetting = (key: string, value: any) => {
    onUpdate({ settings: { ...s, [key]: value } });
  };

  const isChartType = ["bar-chart", "line-chart", "area-chart", "scatter-plot"].includes(widget.type);

  return (
    <div className="flex flex-col bg-card p-6 space-y-6 pb-24 h-fit">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Widget Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Common fields */}
      <div className="space-y-3">
        <div>
          <Label>Widget title *</Label>
          <Input
            value={widget.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
        <div>
          <Label>Widget type</Label>
          <Input value={TYPE_LABELS[widget.type]} readOnly className="bg-muted" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={widget.description ?? ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Widget Size */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Widget Size</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Width (Columns)</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={widget.width}
              onChange={(e) => onUpdate({ width: Math.max(1, Number(e.target.value)) })}
            />
          </div>
          <div>
            <Label>Height (Rows)</Label>
            <Input
              type="number"
              min={1}
              value={widget.height}
              onChange={(e) => onUpdate({ height: Math.max(1, Number(e.target.value)) })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* KPI Settings */}
      {widget.type === "kpi" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Data Setting</p>
          <div>
            <Label>Select metric *</Label>
            <Select value={s.metric ?? ""} onValueChange={(v) => updateSetting("metric", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {KPI_METRIC_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Aggregation *</Label>
            <Select
              value={s.aggregation ?? ""}
              onValueChange={(v) => updateSetting("aggregation", v)}
              disabled={!s.metric || !NUMERIC_FIELDS.includes(s.metric)}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sum">Sum</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Count">Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Data format *</Label>
            <Select value={s.dataFormat ?? "Number"} onValueChange={(v) => updateSetting("dataFormat", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Currency">Currency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Decimal Precision</Label>
            <Input
              type="number"
              min={0}
              value={s.decimalPrecision ?? 0}
              onChange={(e) => updateSetting("decimalPrecision", Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>
      )}

      {/* Chart Settings (Bar, Line, Area, Scatter) */}
      {isChartType && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Data Setting</p>
          <div>
            <Label>Choose X-Axis data *</Label>
            <Select value={s.xAxis ?? ""} onValueChange={(v) => updateSetting("xAxis", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {AXIS_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Choose Y-Axis data *</Label>
            <Select value={s.yAxis ?? ""} onValueChange={(v) => updateSetting("yAxis", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {AXIS_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <p className="text-sm font-semibold text-muted-foreground">Styling</p>
          <div>
            <Label>Chart color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={s.chartColor ?? "#54bd95"}
                onChange={(e) => updateSetting("chartColor", e.target.value)}
                className="h-10 w-10 rounded border border-input cursor-pointer"
              />
              <Input
                value={s.chartColor ?? "#54bd95"}
                onChange={(e) => updateSetting("chartColor", e.target.value)}
                placeholder="#54bd95"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={s.showDataLabel ?? false}
              onCheckedChange={(v) => updateSetting("showDataLabel", !!v)}
            />
            <Label className="cursor-pointer">Show data label</Label>
          </div>
        </div>
      )}

      {/* Pie Chart Settings */}
      {widget.type === "pie-chart" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Data Setting</p>
          <div>
            <Label>Choose chart data *</Label>
            <Select value={s.chartData ?? ""} onValueChange={(v) => updateSetting("chartData", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {AXIS_OPTIONS.filter((a) => a !== "Duration").map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={s.showLegend ?? false}
              onCheckedChange={(v) => updateSetting("showLegend", !!v)}
            />
            <Label className="cursor-pointer">Show legend</Label>
          </div>
        </div>
      )}

      {/* Table Settings */}
      {widget.type === "table" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Data Setting</p>
          <div>
            <Label>Choose columns *</Label>
            <div className="space-y-1 max-h-40 overflow-y-auto border rounded-md p-2">
              {TABLE_COLUMN_OPTIONS.map((col) => (
                <div key={col} className="flex items-center gap-2">
                  <Checkbox
                    checked={(s.columns ?? []).includes(col)}
                    onCheckedChange={(checked) => {
                      const cols = s.columns ?? [];
                      updateSetting(
                        "columns",
                        checked ? [...cols, col] : cols.filter((c: string) => c !== col)
                      );
                    }}
                  />
                  <span className="text-sm">{col}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Sort by</Label>
            <Select value={s.sortBy ?? ""} onValueChange={(v) => updateSetting("sortBy", v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Ascending">Ascending</SelectItem>
                <SelectItem value="Descending">Descending</SelectItem>
                <SelectItem value="Order date">Order date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pagination</Label>
            <Select value={String(s.pagination ?? "")} onValueChange={(v) => updateSetting("pagination", Number(v))}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={s.applyFilter ?? false}
              onCheckedChange={(v) => updateSetting("applyFilter", !!v)}
            />
            <Label className="cursor-pointer">Apply filter</Label>
          </div>
          <Separator />
          <p className="text-sm font-semibold text-muted-foreground">Styling</p>
          <div>
            <Label>Font size</Label>
            <Input
              type="number"
              min={12}
              max={18}
              value={s.fontSize ?? 14}
              onChange={(e) =>
                updateSetting("fontSize", Math.min(18, Math.max(12, Number(e.target.value))))
              }
            />
          </div>
          <div>
            <Label>Header background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={s.headerBackground ?? "#54bd95"}
                onChange={(e) => updateSetting("headerBackground", e.target.value)}
                className="h-10 w-10 rounded border border-input cursor-pointer"
              />
              <Input
                value={s.headerBackground ?? "#54bd95"}
                onChange={(e) => updateSetting("headerBackground", e.target.value)}
                placeholder="#54bd95"
              />
            </div>
          </div>
        </div>
      )}
      <Separator />

      {/* Delete Section */}
      <div className="pt-2">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDelete(widget.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Widget
        </Button>
      </div>
    </div>
  );
}
