import { makeAutoObservable } from "mobx";

import { fetchInventory } from "../services/inventoryService";

class StockStore {
  inventory = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  get myInventory() {
    // אפשר להוסיף כאן סינון לפי משתמש מחובר
    return this.inventory;
  }

  setInventory(items) {
    this.inventory = items;
  }

  addItem(item) {
    this.inventory.push(item);
  }

  updateItem(itemId, data) {
    const idx = this.inventory.findIndex((i) => i.id === itemId);
    if (idx > -1) {
      this.inventory[idx] = { ...this.inventory[idx], ...data };
    }
  }

  async load() {
    this.isLoading = true;
    this.error = null;
    try {
      const data = await fetchInventory();
      this.setInventory(data);
    } catch (e) {
      this.error = "Failed to load inventory";
    } finally {
      this.isLoading = false;
    }
  }
}

const stockStore = new StockStore();
export default stockStore;
