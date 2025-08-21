import { makeAutoObservable } from "mobx";

import { inventoryMock } from "../components/inventory";

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

  load() {
    this.isLoading = true;
    this.error = null;
    setTimeout(() => {
      try {
        this.setInventory(inventoryMock);
        this.isLoading = false;
      } catch (e) {
        this.error = "Failed to load inventory";
        this.isLoading = false;
      }
    }, 700); // סימולציית טעינה
  }
}

const stockStore = new StockStore();
export default stockStore;
