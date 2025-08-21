import { makeAutoObservable } from "mobx";

class OrdersStore {
  orders = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOrders(orders) {
    this.orders = orders;
  }

  addOrder(order) {
    this.orders.push(order);
  }

  updateOrder(orderId, data) {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx > -1) {
      this.orders[idx] = { ...this.orders[idx], ...data };
    }
  }
}

const ordersStore = new OrdersStore();
export default ordersStore;
