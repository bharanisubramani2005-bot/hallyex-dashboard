import type { CustomerOrder, DashboardConfig, WidgetConfig, DashboardLayout } from "@/types";

const PRODUCTS = [
  "Fiber Internet 300 Mbps",
  "5G Unlimited Mobile Plan",
  "Fiber Internet 1 Gbps",
  "Business Internet 500 Mbps",
  "VoIP Corporate Package",
];

const FIRST_NAMES = [
  "John", "Sarah", "Michael", "Emma", "David", "Jessica", "Robert", "Jennifer",
  "William", "Patricia", "James", "Linda", "Charles", "Barbara", "Daniel",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
];

const STATES = ["NY", "CA", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA"];

const SALES_REPS = ["Mr. Michael Harris", "Mr. Ryan Cooper", "Ms. Olivia Carter", "Mr. Lucas Martin"];

const STATUSES = ["Pending", "In progress", "Completed"];

export function generateDummyOrders(count: number = 50): CustomerOrder[] {
  const orders: CustomerOrder[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const unitPrice = 29 + Math.floor(Math.random() * 271);
    const totalAmount = unitPrice * quantity;
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const state = STATES[Math.floor(Math.random() * STATES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const createdBy = SALES_REPS[Math.floor(Math.random() * SALES_REPS.length)];

    orders.push({
      id: `order-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      street_address: `${Math.floor(Math.random() * 10000) + 1} Maple St`,
      city,
      state,
      postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: "United States",
      product,
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      status,
      created_by: createdBy,
      order_date: orderDate.toISOString(),
      created_at: orderDate.toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return orders;
}

export function generateDefaultDashboard(): DashboardConfig {
  const widgets: Record<string, WidgetConfig> = {
    kpi1: {
      id: "kpi1",
      type: "kpi",
      title: "Total Revenue",
      description: "Sum of all orders",
      width: 4,
      height: 2,
      settings: {
        metric: "Total amount",
        aggregation: "Sum",
        dataFormat: "Currency",
        decimalPrecision: 2,
      },
    },
    kpi2: {
      id: "kpi2",
      type: "kpi",
      title: "Total Orders",
      description: "Number of orders",
      width: 4,
      height: 2,
      settings: {
        metric: "Product",
        aggregation: "Count",
        dataFormat: "Number",
        decimalPrecision: 0,
      },
    },
    kpi3: {
      id: "kpi3",
      type: "kpi",
      title: "Average Order Value",
      description: "Average total amount",
      width: 4,
      height: 2,
      settings: {
        metric: "Total amount",
        aggregation: "Average",
        dataFormat: "Currency",
        decimalPrecision: 2,
      },
    },
    barChart: {
      id: "barChart",
      type: "bar-chart",
      title: "Orders by Product",
      description: "Total revenue per product",
      width: 6,
      height: 4,
      settings: {
        xAxis: "Product",
        yAxis: "Total amount",
        chartColor: "#54bd95",
        showDataLabel: true,
      },
    },
    lineChart: {
      id: "lineChart",
      type: "line-chart",
      title: "Revenue Trend",
      description: "Revenue by sales rep",
      width: 6,
      height: 4,
      settings: {
        xAxis: "Created by",
        yAxis: "Total amount",
        chartColor: "#3b82f6",
        showDataLabel: false,
      },
    },
    pieChart: {
      id: "pieChart",
      type: "pie-chart",
      title: "Orders by Status",
      description: "Distribution of order statuses",
      width: 4,
      height: 4,
      settings: {
        dataKey: "Status",
        valueKey: "Total amount",
      },
    },
    areaChart: {
      id: "areaChart",
      type: "area-chart",
      title: "Quantity by Product",
      description: "Units sold per product",
      width: 6,
      height: 4,
      settings: {
        xAxis: "Product",
        yAxis: "Quantity",
        chartColor: "#f59e0b",
        showDataLabel: false,
      },
    },
    table: {
      id: "table",
      type: "table",
      title: "Recent Orders",
      description: "Latest customer orders",
      width: 12,
      height: 5,
      settings: {
        columns: [
          "Customer name",
          "Email id",
          "Product",
          "Quantity",
          "Total amount",
          "Status",
          "Order date",
        ],
        rowsPerPage: 10,
      },
    },
  };

  const layout: DashboardLayout[] = [
    { i: "kpi1", x: 0, y: 0, w: 4, h: 2 },
    { i: "kpi2", x: 4, y: 0, w: 4, h: 2 },
    { i: "kpi3", x: 8, y: 0, w: 4, h: 2 },
    { i: "barChart", x: 0, y: 2, w: 6, h: 4 },
    { i: "lineChart", x: 6, y: 2, w: 6, h: 4 },
    { i: "pieChart", x: 0, y: 6, w: 4, h: 4 },
    { i: "areaChart", x: 4, y: 6, w: 6, h: 4 },
    { i: "table", x: 0, y: 10, w: 12, h: 5 },
  ];

  return {
    id: "default-dashboard",
    name: "Default Dashboard",
    layout,
    widgets,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
