import axios from "axios";
import { defineStore } from "pinia";
import { useAppStore } from "./appStore";

export const useItemStore = defineStore("itemStore", {
  state() {
    return {
      appStore: useAppStore(),
      item: {
        id: /** @type {number} */ (undefined),
        title: /** @type {string} */ (undefined),
        activity_group_id: /** @type {number} */ (undefined),
        is_active: /** @type {0 | 1} */ (undefined),
        priority:
          /** @type {'very-high' | 'high' | 'medium' | 'low' | 'very-low'} */ (
            "very-high"
          ),
      },
    };
  },
  actions: {
    async getItem(id) {
      return axios.get(`${this.appStore.apiUrl}todo-items/${id}`);
    },
    async storeItem(payload) {
      return axios.post(`${this.appStore.apiUrl}todo-items`, payload);
    },
    async updateItem(payload) {
      return axios.patch(
        `${this.appStore.apiUrl}todo-items/${payload.id}`,
        payload.data
      );
    },
    async deleteItem(id) {
      return axios.delete(`${this.appStore.apiUrl}todo-items/${id}`);
    },
  },
});
