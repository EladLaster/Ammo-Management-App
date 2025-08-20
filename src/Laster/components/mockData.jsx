// src/mocks/mockData.js
export const mockRequests = [
  {
    requester: "מטוס A",
    unitNumber: "12",
    ammoType: "מטוס קרב",
    quantity: 500,
    priority: "גבוהה",
    requestDate: "15/08/2025",
    status: "ממתינה"
  },
  {
    requester: "מטוס B",
    unitNumber: "5 מטוס B",
    ammoType: "מטוס קרב",
    quantity: 800,
    priority: "גבוהה", 
    requestDate: "17/08/2025",
    status: "ממתינה"
  },
  {
    requester: "מטוס C",
    unitNumber: "2 מטוס C",
    ammoType: "מטוס קרב",
    quantity: 200,
    priority: "גבוהה",
    requestDate: "18/08/2025",
    status: "אושרה"
  },
  {
    requester: "מטוס D",
    unitNumber: "1",
    ammoType: "נפילות",
    quantity: 100,
    priority: "גבוהה",
    requestDate: "19/08/2025",
    status: "נדחתה"
  },
  {
    requester: "מטוס D",
    unitNumber: "1",
    ammoType: "מטוס קרב",
    quantity: 50,
    priority: "בינונית",
    requestDate: "18/08/2025",
    status: "נדחתה"
  },
  {
    requester: "מטוס E", 
    unitNumber: "1",
    ammoType: "נפילות",
    quantity: 100,
    priority: "גבוהה",
    requestDate: "17/08/2025",
    status: "ממתינה"
  },
  {
    requester: "מטוס E",
    unitNumber: "1", 
    ammoType: "נפילות",
    quantity: 60,
    priority: "בינונית",
    requestDate: "16/08/2025",
    status: "ממתינה"
  }
];

export const mockInventoryItems = [
  {
    date: "16/08/2025",
    itemName: "מטוס A",
    itemCode: "מדרג 13", 
    status: "מלאי תקין",
    quantity: 300,
    unit: "יחידות",
    totalStock: 450,
    statusIcon: "🛡️",
    statusColor: "green",
    details: "7.62 מ\"מ"
  },
  {
    date: "17/08/2025", 
    itemName: "מטוס B",
    itemCode: "מדרג 5",
    status: "מלאי תקין", 
    quantity: 800,
    unit: "יחידות",
    totalStock: 2000,
    statusIcon: "🛡️", 
    statusColor: "green",
    details: "9 מ\"מ"
  },
  {
    date: "18/08/2025",
    itemName: "מטוס C", 
    itemCode: "מדרג 2",
    status: "מלאי תקין",
    quantity: 200,
    unit: "יחידות", 
    totalStock: 700,
    statusIcon: "⚠️",
    statusColor: "orange", 
    details: "12.7 מ\"מ"
  },
  {
    date: "19/08/2025",
    itemName: "מטוס D",
    itemCode: "כסכות 1", 
    status: "מלאי נמוך",
    quantity: 100,
    unit: "יחידות",
    totalStock: 85, 
    statusIcon: "❌",
    statusColor: "red",
    details: "כסכות 120 מ\"מ"
  },
  {
    date: "18/08/2025",
    itemName: "מטוס D",
    itemCode: "כסכות 2",
    status: "מלאי קריטי", 
    quantity: 50,
    unit: "יחידות",
    totalStock: 32,
    statusIcon: "❌", 
    statusColor: "red",
    details: "פצצה 81 מ\"מ"
  },
  {
    date: "17/08/2025",
    itemName: "מטוס E",
    itemCode: "כסכות 3",
    status: "מלאי תקין",
    quantity: 100, 
    unit: "יחידות",
    totalStock: 180,
    statusIcon: "⚡",
    statusColor: "yellow",
    details: "רימון 40 מ\"מ" 
  },
  {
    date: "16/08/2025",
    itemName: "מטוס E", 
    itemCode: "כסכות 4",
    status: "מלאי נמוך",
    quantity: 60,
    unit: "יחידות",
    totalStock: 45,
    statusIcon: "🎯", 
    statusColor: "dark",
    details: "רימון יד"
  }
];

export const mockStatus = {
  ammoTypes: 3,
  unitsInStock: 4350,
  lowStockItems: 8,
  pendingRequests: 12
};