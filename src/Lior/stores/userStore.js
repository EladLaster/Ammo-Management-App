import { makeAutoObservable } from "mobx";

class UserStore {
  currentUser = null;
  currentLocationId = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.currentUser = user;
  }

  setLocation(locationId) {
    this.currentLocationId = locationId;
  }
}

const userStore = new UserStore();
export default userStore;
