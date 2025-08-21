// =============================
// Mock data aligned with DB V1
// Schema: product_categories, products, locations, inventory, orders, order_items
// NOTE: We leave usersMock as-is (login handled elsewhere)
// =============================

// Users (leave as-is for now; someone else handles login/auth)
export const usersMock = [
  { id: 1, name: "Lior", role: "User", unit_id: 101, location: "Base A" },
  { id: 2, name: "Guy", role: "User", unit_id: 102, location: "Base B" },
  { id: 3, name: "Elad", role: "Admin", unit_id: 101, location: "Base A" },
];

// -----------------------------
// product_categories
// -----------------------------
export const productCategoriesMock = [
  { id: 1, name: "תחמושת", code: "AMMO", is_ammunition: true },
  { id: 2, name: "ציוד רפואי", code: "MED", is_ammunition: false },
  { id: 3, name: "ציוד", code: "EQP", is_ammunition: false },
];

// -----------------------------
// products (generic)
// -----------------------------
export const productsMock = [
  // Ammo
  {
    id: 11,
    category_id: 1,
    name: "5.56 NATO M855",
    sku: "AM-556-M855",
    description: "מחסנית 30",
    caliber: "5.56",
    low_threshold: 300,
    critical_threshold: 100,
  },
  {
    id: 12,
    category_id: 1,
    name: "9mm Ball",
    sku: "AM-9-BALL",
    description: "מחסנית 17",
    caliber: "9mm",
    low_threshold: 200,
    critical_threshold: 50,
  },
  // Medical
  {
    id: 21,
    category_id: 2,
    name: "ערכת חבישה אישית",
    sku: "MED-IFAK",
    description: "ערכת עזרה ראשונה",
    caliber: null,
    low_threshold: 50,
    critical_threshold: 10,
  },
  // Equipment
  {
    id: 31,
    category_id: 3,
    name: "קסדה",
    sku: "EQP-HELMET",
    description: "קסדה תקנית",
    caliber: null,
    low_threshold: 20,
    critical_threshold: 5,
  },
];

// -----------------------------
// locations (instead of units)
// -----------------------------
export const locationsMock = [
  { id: 101, name: "Base A", code: "12" },
  { id: 102, name: "Base B", code: "5" },
  { id: 103, name: "Warehouse North", code: "W-NORTH" },
];

// -----------------------------
// inventory (Location × Product)
// -----------------------------
export const inventoryMock = [
  // Base A
  {
    id: 1001,
    location_id: 101,
    product_id: 11,
    quantity: 450,
    updated_at: "2025-08-20T10:30:00Z",
  },
  {
    id: 1002,
    location_id: 101,
    product_id: 12,
    quantity: 8,
    updated_at: "2025-08-20T11:00:00Z",
  },
  {
    id: 1003,
    location_id: 101,
    product_id: 21,
    quantity: 25,
    updated_at: "2025-08-20T11:05:00Z",
  },
  // Base B
  {
    id: 1004,
    location_id: 102,
    product_id: 31,
    quantity: 2,
    updated_at: "2025-08-20T09:00:00Z",
  },
  // Warehouse North
  {
    id: 1005,
    location_id: 103,
    product_id: 11,
    quantity: 1200,
    updated_at: "2025-08-18T08:00:00Z",
  },
  {
    id: 1006,
    location_id: 103,
    product_id: 21,
    quantity: 120,
    updated_at: "2025-08-18T08:10:00Z",
  },
];

// -----------------------------
// orders (customer requests) – header
// status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled'
// -----------------------------
export const ordersMock = [
  {
    id: 5001,
    customer_location_id: 101, // Base A
    status: "submitted",
    priority: "גבוהה",
    requested_date: "2025-08-25",
    created_at: "2025-08-20T12:00:00Z",
    updated_at: "2025-08-20T12:00:00Z",
  },
  {
    id: 5002,
    customer_location_id: 102, // Base B
    status: "approved",
    priority: "בינונית",
    requested_date: "2025-08-24",
    created_at: "2025-08-19T10:00:00Z",
    updated_at: "2025-08-19T11:00:00Z",
  },
  {
    id: 5003,
    customer_location_id: 101, // Base A
    status: "rejected",
    priority: "נמוכה",
    requested_date: "2025-08-23",
    created_at: "2025-08-18T09:00:00Z",
    updated_at: "2025-08-18T10:00:00Z",
  },
];

// -----------------------------
// order_items – lines per order
// -----------------------------
export const orderItemsMock = [
  // Order 5001 (submitted)
  {
    id: 7001,
    order_id: 5001,
    product_id: 11,
    quantity: 100,
    notes: "לתרגיל יום שני",
  },
  { id: 7002, order_id: 5001, product_id: 12, quantity: 20, notes: "לנשק קצר" },

  // Order 5002 (approved)
  { id: 7003, order_id: 5002, product_id: 31, quantity: 2, notes: null },

  // Order 5003 (rejected)
  {
    id: 7004,
    order_id: 5003,
    product_id: 12,
    quantity: 10,
    notes: "מלאי לא זמין",
  },
];

// -----------------------------
// (Optional) helper: join inventory to human-readable rows like the DB view
// -----------------------------
export const inventoryViewMock = inventoryMock.map((row) => {
  const loc = locationsMock.find((l) => l.id === row.location_id);
  const prod = productsMock.find((p) => p.id === row.product_id);

  // compute stock status from thresholds (like the SQL view)
  let stock_status = "מלאי תקין";
  if (prod) {
    if (row.quantity <= (prod.critical_threshold ?? 0))
      stock_status = "מלאי קריטי";
    else if (row.quantity <= (prod.low_threshold ?? 0))
      stock_status = "מלאי נמוך";
  }

  return {
    id: row.id,
    location_id: row.location_id,
    location_name: loc?.name ?? "?",
    location_code: loc?.code ?? null,
    product_id: row.product_id,
    product_name: prod?.name ?? "?",
    sku: prod?.sku ?? null,
    description: prod?.description ?? null,
    caliber: prod?.caliber ?? null,
    low_threshold: prod?.low_threshold ?? null,
    critical_threshold: prod?.critical_threshold ?? null,
    quantity: row.quantity,
    stock_status,
    updated_at: row.updated_at,
  };
});
