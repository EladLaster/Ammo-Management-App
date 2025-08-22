import { makeAutoObservable, runInAction } from "mobx";
import { supabase } from '../../data/supabase';
import { authProvider } from "../../AuthProvider/AuthProvider";

class StockStore {
  inventory = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ========== פונקציות API ========== //

  async fetchInventory(role, unitId = null) {
    const roleName = role === "Admin" ? "admins" : "users";
  let query = supabase.from(`inventory_${roleName}`).select(`
    unit_id,
    item_id,
    quantity,
    last_updated,
    items (
      item_name,
      category
    ),
    units (
      name
    )
  `);

  if (unitId) {
    query = query.eq('unit_id', unitId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data;
}

async load() {
  console.log(authProvider.getActiveUser());
  const user = authProvider.getActiveUser();
  if (!user) return;
  this.isLoading = true;
  this.error = null;
  try {
    const data = await this.fetchInventory(user.role, user.unit_id);
    runInAction(() => this.setInventory(data));
  } catch (e) {
    runInAction(() => this.error = "Failed to load inventory");
  } finally {
    runInAction(() => this.isLoading = false);
  }
}



  get myInventory() {
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
}

export const stockStore = new StockStore();