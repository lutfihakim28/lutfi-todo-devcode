import { defineStore } from "pinia";

let snackbarQueue = Promise.resolve();

export const useAppStore = defineStore("App", {
  state() {
    return {
      apiUrl: "https://todo.api.devcode.gethired.id/",
      email: "lutfihakim288@gmail.com",
      dataState: /** @type {'loading' | 'ready'} */ (undefined),
      snackbar: {
        type: /** @type {'delete' | 'success' | 'error'} */ (undefined),
        message: /** @type {string} */ (undefined),
        visibility: false,
        timeout: 4000,
      },
      modal: {
        visibility: false,
        type: /** @type {'add' | 'edit' | 'delete-list' | 'delete-activity'} */ (
          undefined
        ),
        itemName: /** @type {string} */ (undefined),
        itemId: /** @type {number} */ (undefined),
        activityId: /** @type {number} */ (undefined),
      },
    };
  },
  actions: {
    /**
     *
     * @param {string} type
     * @param {string} message
     */
    openSnackbar(type, message) {
      snackbarQueue = snackbarQueue.then(() => {
        return new Promise((resolve) => {
          this.snackbar.message = message;
          this.snackbar.type = type;
          this.snackbar.visibility = true;
          setTimeout(() => {
            this.closeSnackbar();
            resolve();
          }, this.snackbar.timeout);
        });
      });
    },
    closeSnackbar() {
      this.snackbar.visibility = false;
    },
    /**
     *
     * @param {string} type
     * @param {string=} itemName
     * @param {number=} itemId
     * @param {number=} activityId
     */
    openModal(type, itemName, activityId, itemId) {
      this.modal.type = type;
      this.modal.itemName = itemName;
      this.modal.itemId = itemId;
      this.modal.activityId = activityId;
      this.modal.visibility = true;
    },
    closeModal() {
      this.modal.visibility = false;
    },
  },
});
