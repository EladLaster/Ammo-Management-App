// Users
export const usersMock = [
  { id: 1, name: "Lior", role: "User", unit_id: 101, location: "Base A" },
  { id: 2, name: "Guy", role: "User", unit_id: 102, location: "Base B" },
  { id: 3, name: "Elad", role: "Admin", unit_id: 101, location: "Base A" },
];

// Units
export const unitsMock = [
  { id: 101, name: "Unit Alpha", location: "Base A" },
  { id: 102, name: "Unit Bravo", location: "Base B" },
];

// Items
export const itemsMock = [
  { id: 1, item_name: "5.56mm", category: "Ammo" },
  { id: 2, item_name: "9mm", category: "Ammo" },
  { id: 3, item_name: "Ear Plugs", category: "General" },
  { id: 4, item_name: "Helmet", category: "Equipment" },
];

// Inventory
export const inventoryMock = [
  {
    item_id: 1,
    quantity: 120,
    unit_id: 101,
    user_id: 1,
    last_updated: "2025-08-18T10:30:00Z",
  },
  {
    item_id: 2,
    quantity: 8,
    unit_id: 101,
    user_id: 1,
    last_updated: "2025-08-19T08:10:00Z",
  },
  {
    item_id: 3,
    quantity: 25,
    unit_id: 101,
    user_id: 1,
    last_updated: "2025-08-20T06:00:00Z",
  },
  {
    item_id: 4,
    quantity: 2,
    unit_id: 102,
    user_id: 2,
    last_updated: "2025-08-20T09:00:00Z",
  },
];

// Requests
export const requestsMock = [
  {
    id: 1,
    users_id: 1,
    item_id: 1,
    unit_id: 101,
    quantity: 30,
    status: "pending",
    created_at: "2025-08-19T12:00:00Z",
    last_updated: "2025-08-19T12:00:00Z",
  },
  {
    id: 2,
    users_id: 2,
    item_id: 4,
    unit_id: 102,
    quantity: 1,
    status: "approved",
    created_at: "2025-08-18T10:00:00Z",
    last_updated: "2025-08-18T11:00:00Z",
  },
  {
    id: 3,
    users_id: 1,
    item_id: 2,
    unit_id: 101,
    quantity: 10,
    status: "rejected",
    created_at: "2025-08-17T09:00:00Z",
    last_updated: "2025-08-17T10:00:00Z",
  },
];
