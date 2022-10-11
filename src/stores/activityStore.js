import { defineStore } from "pinia";
import { useAppStore } from "./appStore.js";
import axios from "axios";

export const useActivityStore = defineStore("Activity", {
  state() {
    return {
      appStore: useAppStore(),
      activities: /** @type {Array} */ (undefined),
      activity: {
        id: /** @type {number} */ (undefined),
        title: /** @type {string} */ (undefined),
        todo_items: /** @type {Array} */ (undefined),
      },
    };
  },
  actions: {
    async getActivities() {
      const qs = new URLSearchParams();
      qs.append("email", this.appStore.email);
      return axios
        .get(`${this.appStore.apiUrl}activity-groups?${qs.toString()}`)
        .then((response) => {
          this.activities = response.data.data;
        });
    },
    async getActivity(id) {
      return axios
        .get(`${this.appStore.apiUrl}activity-groups/${id}`)
        .then((response) => {
          this.activity = response.data;
        });
    },
    async storeActivity(data) {
      return axios.post(`${this.appStore.apiUrl}activity-groups`, data);
    },
    async updateActivity(data, id) {
      return axios.patch(`${this.appStore.apiUrl}activity-groups/${id}`, data);
    },
    async deleteActivity(id) {
      return axios.delete(`${this.appStore.apiUrl}activity-groups/${id}`);
    },
  },
});
