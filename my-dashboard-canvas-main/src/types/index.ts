export interface CustomerOrder {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  created_by: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export interface OrderFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  created_by: string;
}

export const COUNTRIES = [
  "United States",
  "Canada",
  "Australia",
  "Singapore",
  "Hong Kong",
] as const;

export interface MenuItem {
  id?: string;
  name: string;
  price: string;
  category: string;
  theme: string;
  img: string;
  desc: string;
  tag?: string;
}

export const PRODUCTS = [
  "Fiber Internet 300 Mbps",
  "5G Unlimited Mobile Plan",
  "Fiber Internet 1 Gbps",
  "Business Internet 500 Mbps",
  "VoIP Corporate Package",
] as const;

export const STATUSES = ["Pending", "In progress", "Completed"] as const;

export const CREATED_BY_OPTIONS = [
  "Mr. Michael Harris",
  "Mr. Ryan Cooper",
  "Ms. Olivia Carter",
  "Mr. Lucas Martin",
] as const;

export const DATE_FILTER_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
] as const;

export type WidgetType =
  | "bar-chart"
  | "line-chart"
  | "pie-chart"
  | "area-chart"
  | "scatter-plot"
  | "table"
  | "kpi";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  width: number;
  height: number;
  settings: Record<string, any>;
}

export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardConfig {
  id: string;
  name: string;
  layout: DashboardLayout[];
  widgets: Record<string, WidgetConfig>;
  created_at: string;
  updated_at: string;
}

export const AXIS_OPTIONS = [
  "Product",
  "Quantity",
  "Unit price",
  "Total amount",
  "Status",
  "Created by",
  "Duration",
] as const;

export const TABLE_COLUMN_OPTIONS = [
  "Customer ID",
  "Customer name",
  "Email id",
  "Phone number",
  "Address",
  "Order ID",
  "Order date",
  "Product",
  "Quantity",
  "Unit price",
  "Total amount",
  "Status",
  "Created by",
] as const;

export const KPI_METRIC_OPTIONS = [
  "Customer ID",
  "Customer name",
  "Email id",
  "Address",
  "Order date",
  "Product",
  "Created by",
  "Status",
  "Total amount",
  "Unit price",
  "Quantity",
] as const;

export const NUMERIC_FIELDS = ["Total amount", "Unit price", "Quantity"];
