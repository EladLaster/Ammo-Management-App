// src/stores/RequestStore.js
import { makeAutoObservable } from "mobx";
import stockStore from "../stores/stockStore";
import { fetchRequests, updateRequestStatus, createRequest } from "./requestsService";

class RequestStore {
  requests = [];
  status = {
    ammoTypes: 0,
    unitsInStock: 0,
    lowStockItems: 0,
    pendingRequests: 0
  };
  isLoading = false;
  isRequestsLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.loadData();
    this.loadRequests();
  }

  async loadData() {
    this.isLoading = true;
    this.error = null;
    try {
      await stockStore.load();
      this.updateStatus();
    } catch (error) {
      this.error = "Failed to load data";
      console.error("Error loading data:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadRequests() {
    this.isRequestsLoading = true;
    try {
      const requestsData = await fetchRequests();
      this.requests = requestsData.map(req => ({
        id: req.id,
        requester: req.users?.name || `משתמש ${req.user_id}`,
        unitNumber: req.units?.name || `יחידה ${req.unit_id}`,
        ammoType: req.items?.item_name || req.items?.category || 'תחמושת',
        quantity: req.quantity,
        priority: this.getPriorityFromStatus(req.status),
        requestDate: new Date(req.created_at).toLocaleDateString('he-IL'),
        status: this.translateStatus(req.status),
        originalStatus: req.status,
        unitLocation: req.units?.location
      }));
      this.updateStatus();
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      this.isRequestsLoading = false;
    }
  }

  translateStatus(status) {
    const statusMap = {
      'pending': 'ממתינה',
      'approved': 'אושרה', 
      'rejected': 'נדחתה',
      'completed': 'הושלמה'
    };
    return statusMap[status] || status;
  }

  getPriorityFromStatus(status) {
    // ניתן להוסיף לוגיקה מורכבת יותר
    if (status === 'pending') return 'גבוהה';
    return 'בינונית';
  }

  get inventoryItems() {
    return stockStore.inventory.map(item => ({
      date: new Date(item.last_updated).toLocaleDateString('he-IL'),
      itemName: item.units?.name || `יחידה ${item.unit_id}`,
      itemCode: `פריט ${item.item_id}`,
      status: this.getItemStatus(item.quantity),
      quantity: item.quantity,
      unit: "יחידות",
      totalStock: item.quantity,
      statusIcon: this.getStatusIcon(item.quantity),
      statusColor: this.getStatusColor(item.quantity),
      details: item.items?.item_name || `${item.items?.category || 'תחמושת'}`
    }));
  }

  getItemStatus(quantity) {
    if (quantity < 50) return "מלאי קריטי";
    if (quantity < 100) return "מלאי נמוך";
    return "מלאי תקין";
  }

  getStatusIcon(quantity) {
    if (quantity < 50) return "❌";
    if (quantity < 100) return "⚡";
    return "🛡️";
  }

  getStatusColor(quantity) {
    if (quantity < 50) return "red";
    if (quantity < 100) return "yellow";
    return "green";
  }

  updateStatus() {
    const inventory = stockStore.inventory;
    
    this.status = {
      ammoTypes: new Set(inventory.map(item => item.items?.category)).size || 3,
      unitsInStock: inventory.reduce((sum, item) => sum + (item.quantity || 0), 0),
      lowStockItems: inventory.filter(item => item.quantity < 100).length,
      pendingRequests: this.requests.filter(req => req.originalStatus === "pending").length
    };
  }

  async updateRequestStatus(requestId, newStatus) {
    try {
      await updateRequestStatus(requestId, newStatus);
      // עדכון מקומי
      const request = this.requests.find(r => r.id === requestId);
      if (request) {
        request.originalStatus = newStatus;
        request.status = this.translateStatus(newStatus);
      }
      this.updateStatus();
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  }

  async addRequest(requestData) {
    try {
      const newRequest = await createRequest(requestData);
      await this.loadRequests(); // רענון הנתונים
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  }

  filterRequestsByName(name) {
    return this.requests.filter(r => r.requester.includes(name));
  }

  getInventoryItems() {
    return this.inventoryItems;
  }

  async refreshData() {
    await Promise.all([this.loadData(), this.loadRequests()]);
  }
}

export const requestStore = new RequestStore();