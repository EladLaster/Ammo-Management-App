// src/stores/RequestStore.js
import { makeAutoObservable } from "mobx";
import { mockRequests, mockStatus, mockInventoryItems } from "./mockData";

class RequestStore {
  requests = [];
  status = {};
  inventoryItems = [];

  constructor() {
    makeAutoObservable(this);
    this.requests = mockRequests;
    this.status = mockStatus;
    this.inventoryItems = mockInventoryItems;
  }

  addRequest(request) {
    this.requests.push({ ...request, status: "ממתינה" });
    this.updateStatus();
  }

  updateStatus() {
    this.status = {
      ammoTypes: new Set(this.requests.map(r => r.ammoType)).size,
      unitsInStock: this.requests.reduce((sum, r) => sum + r.quantity, 0),
      lowStockItems: this.requests.filter(r => r.quantity < 50).length,
      pendingRequests: this.requests.filter(r => r.status === "ממתינה").length
    };
  }

  filterRequestsByName(name) {
    return this.requests.filter(r => r.requester.includes(name));
  }

  getInventoryItems() {
    return this.inventoryItems;
  }
}

export const requestStore = new RequestStore();