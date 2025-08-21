import { makeAutoObservable } from "mobx";

class UIStore {
  isModalOpen = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setModal(open) {
    this.isModalOpen = open;
  }

  setLoading(loading) {
    this.isLoading = loading;
  }
}

const uiStore = new UIStore();
export default uiStore;
