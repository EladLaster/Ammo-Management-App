// src/stores/RequestStore.js
import { makeAutoObservable, runInAction } from "mobx";
import { stockStore } from "./stockStore";
import { supabase } from "../../data/supabase";
import { authProvider } from "../../AuthProvider/AuthProvider";

class RequestStore {
  requests = [];
  status = {
    ammoTypes: 0,
    unitsInStock: 0,
    lowStockItems: 0,
    pendingRequests: 0,
  };
  isLoading = false;
  isRequestsLoading = false;
  error = null;
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
    this.currentUser = authProvider.getActiveUser();
    this.loadData();
    // לא טוען בקשות אוטומטית כאן - רק בקומפוננטות ספציפיות
  }

  // ========== פונקציות API ========== //

  async fetchRequests(unitId = null) {
    let query = supabase.from("requests").select(`
      id,
      user_id,
      unit_id,
      item_id,
      quantity,
      status,
      created_at,
      last_updated,
      items:item_id (
        item_name,
        category
      ),
      units:unit_id (
        name,
        location
      ),
      users:user_id (
        name,
        role
      )
    `);

    // סינון לפי unit_id אם נדרש
    if (unitId) {
      query = query.eq("unit_id", unitId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async updateRequestStatus(requestId, status) {
    const { data, error } = await supabase
      .from("requests")
      .update({
        status,
        last_updated: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select();

    if (error) throw error;
    return data;
  }

  // async createRequest(requestData) {
  //   const { data, error } = await supabase
  //     .from("requests")
  //     .insert([{
  //       ...requestData,
  //       created_at: new Date().toISOString(),
  //       last_updated: new Date().toISOString()
  //     }])
  //     .select(`
  //       id,
  //       user_id,
  //       unit_id,
  //       item_id,
  //       quantity,
  //       status,
  //       created_at,
  //       last_updated,
  //       items:item_id (
  //         item_name,
  //         category
  //       ),
  //       units:unit_id (
  //         name,
  //         location
  //       ),
  //       users:user_id (
  //         name,
  //         role
  //       )
  //     `);

  //   if (error) throw error;
  //   return data;
  // }

  // async deleteRequest(requestId) {
  //   const { data, error } = await supabase
  //     .from("requests")
  //     .delete()
  //     .eq("id", requestId)
  //     .select();

  //   if (error) throw error;
  //   return data;
  // }

  // ========== פונקציות Store ========== //

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
      runInAction(() => {
      this.isLoading = false;
      })
    }
  }

  async loadRequests(unitId = null) {
    runInAction(() => {
      this.isRequestsLoading = true;
      this.error = null;
    });
    try {
      const requestsData = await this.fetchRequests(unitId);
      runInAction(() => {
      this.requests = requestsData.map((req) => ({
        id: req.id,
        requester: req.users?.name || `משתמש ${req.user_id}`,
        unitNumber: req.units?.name || `יחידה ${req.unit_id}`,
        ammoType: req.items?.item_name || req.items?.category || "תחמושת",
        quantity: req.quantity,
        priority: this.getPriorityFromStatus(req.status),
        requestDate: new Date(req.created_at).toLocaleDateString("he-IL"),
        status: this.translateStatus(req.status),
        originalStatus: req.status,
        unitLocation: req.units?.location,
        // שמירת המידע המקורי לצורך עדכונים
        rawData: req,
      }));
      this.updateStatus();
    })
    } catch (error) {
      runInAction(() => {
      console.error("Error loading requests:", error);
      this.error = "שגיאה בטעינת בקשות";
      })
    } finally {
      runInAction(() => {
      this.isRequestsLoading = false;
      })
    }
  }

  async loadRequestsByUnit(unitId) {
    return await this.loadRequests(unitId);
  }

  // async loadRequestsByUser(userId) {
  //   this.isRequestsLoading = true;
  //   try {
  //     let query = supabase.from("requests").select(`
  //       id,
  //       user_id,
  //       unit_id,
  //       item_id,
  //       quantity,
  //       status,
  //       created_at,
  //       last_updated,
  //       items:item_id (
  //         item_name,
  //         category
  //       ),
  //       units:unit_id (
  //         name,
  //         location
  //       ),
  //       users:user_id (
  //         name,
  //         role
  //       )
  //     `).eq("user_id", userId);

  //     const { data, error } = await query;
  //     if (error) throw error;

  //     this.requests = data.map(req => ({
  //       id: req.id,
  //       requester: req.users?.name || `משתמש ${req.user_id}`,
  //       unitNumber: req.units?.name || `יחידה ${req.unit_id}`,
  //       ammoType: req.items?.item_name || req.items?.category || 'תחמושת',
  //       quantity: req.quantity,
  //       priority: this.getPriorityFromStatus(req.status),
  //       requestDate: new Date(req.created_at).toLocaleDateString('he-IL'),
  //       status: this.translateStatus(req.status),
  //       originalStatus: req.status,
  //       unitLocation: req.units?.location,
  //       rawData: req
  //     }));
  //     this.updateStatus();
  //   } catch (error) {
  //     console.error("Error loading user requests:", error);
  //     this.error = "שגיאה בטעינת בקשות המשתמש";
  //   } finally {
  //     this.isRequestsLoading = false;
  //   }
  // }

  translateStatus(status) {
    const statusMap = {
      pending: "ממתינה",
      approved: "אושרה",
      rejected: "נדחתה",
      completed: "הושלמה",
    };
    return statusMap[status] || status;
  }

  getPriorityFromStatus(status) {
    const priorityMap = {
      pending: "גבוהה",
      approved: "בינונית",
      rejected: "נמוכה",
      completed: "הושלמה",
    };
    return priorityMap[status] || "בינונית";
  }

  get inventoryItems() {
    return stockStore.inventory.map((item) => ({
      date: new Date(item.last_updated).toLocaleDateString("he-IL"),
      itemName: item.units?.name || `יחידה ${item.unit_id}`,
      itemCode: `פריט ${item.item_id}`,
      status: this.getItemStatus(item.quantity),
      quantity: item.quantity,
      unit: "יחידות",
      totalStock: item.quantity,
      statusIcon: this.getStatusIcon(item.quantity),
      statusColor: this.getStatusColor(item.quantity),
      details: item.items?.item_name || `${item.items?.category || "תחמושת"}`,
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
      ammoTypes:
        new Set(inventory.map((item) => item.items?.category)).size || 3,
      unitsInStock: inventory.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
      lowStockItems: inventory.filter((item) => item.quantity < 100).length,
      pendingRequests: this.requests.filter(
        (req) => req.originalStatus === "pending"
      ).length,
    };
  }

  async updateRequestStatusLocal(requestId, newStatus) {
    try {
      await this.updateRequestStatus(requestId, newStatus);
      // עדכון מקומי
      const request = this.requests.find((r) => r.id === requestId);
      if (request) {
        request.originalStatus = newStatus;
        request.status = this.translateStatus(newStatus);
        request.priority = this.getPriorityFromStatus(newStatus);
      }
      this.updateStatus();
    } catch (error) {
      console.error("Error updating request status:", error);
      this.error = "שגיאה בעדכון סטטוס הבקשה";
      throw error;
    }
  }

  // async addRequest(requestData) {
  //   try {
  //     const newRequestData = await this.createRequest(requestData);
  //     // הוספה למערך המקומי
  //     const newRequest = newRequestData[0];
  //     this.requests.push({
  //       id: newRequest.id,
  //       requester: newRequest.users?.name || `משתמש ${newRequest.user_id}`,
  //       unitNumber: newRequest.units?.name || `יחידה ${newRequest.unit_id}`,
  //       ammoType: newRequest.items?.item_name || newRequest.items?.category || 'תחמושת',
  //       quantity: newRequest.quantity,
  //       priority: this.getPriorityFromStatus(newRequest.status),
  //       requestDate: new Date(newRequest.created_at).toLocaleDateString('he-IL'),
  //       status: this.translateStatus(newRequest.status),
  //       originalStatus: newRequest.status,
  //       unitLocation: newRequest.units?.location,
  //       rawData: newRequest
  //     });
  //     this.updateStatus();
  //     return newRequest;
  //   } catch (error) {
  //     console.error("Error creating request:", error);
  //     this.error = "שגיאה ביצירת בקשה חדשה";
  //     throw error;
  //   }
  // }

  // async removeRequest(requestId) {
  //   try {
  //     await this.deleteRequest(requestId);
  //     // הסרה מהמערך המקומי
  //     this.requests = this.requests.filter(r => r.id !== requestId);
  //     this.updateStatus();
  //   } catch (error) {
  //     console.error("Error deleting request:", error);
  //     this.error = "שגיאה במחיקת הבקשה";
  //     throw error;
  //   }
  // }

  // ========== פונקציות סינון וחיפוש ========== //

  filterRequestsByName(name) {
    return this.requests.filter(
      (r) =>
        r.requester.includes(name) ||
        r.requester.toLowerCase().includes(name.toLowerCase())
    );
  }

  filterRequestsByStatus(status) {
    return this.requests.filter((r) => r.originalStatus === status);
  }

  filterRequestsByUnit(unitName) {
    return this.requests.filter(
      (r) =>
        r.unitNumber.includes(unitName) ||
        r.unitNumber.toLowerCase().includes(unitName.toLowerCase())
    );
  }

  filterRequestsByDateRange(startDate, endDate) {
    return this.requests.filter((r) => {
      const requestDate = new Date(r.rawData.created_at);
      return requestDate >= startDate && requestDate <= endDate;
    });
  }

  searchRequests(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.requests.filter(
      (r) =>
        r.requester.toLowerCase().includes(term) ||
        r.unitNumber.toLowerCase().includes(term) ||
        r.ammoType.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term)
    );
  }

  getInventoryItems() {
    return this.inventoryItems;
  }

  async refreshData() {
    await Promise.all([this.loadData(), this.loadRequests()]);
  }

  // Reset error state
  clearError() {
    this.error = null;
  }

  // Get requests summary for dashboard
  get requestsSummary() {
    const summary = {
      total: this.requests.length,
      pending: this.requests.filter((r) => r.originalStatus === "pending")
        .length,
      approved: this.requests.filter((r) => r.originalStatus === "approved")
        .length,
      rejected: this.requests.filter((r) => r.originalStatus === "rejected")
        .length,
      completed: this.requests.filter((r) => r.originalStatus === "completed")
        .length,
    };

    return {
      ...summary,
      pendingPercentage:
        summary.total > 0
          ? ((summary.pending / summary.total) * 100).toFixed(1)
          : 0,
      completedPercentage:
        summary.total > 0
          ? ((summary.completed / summary.total) * 100).toFixed(1)
          : 0,
    };
  }
}

export const requestStore = new RequestStore();