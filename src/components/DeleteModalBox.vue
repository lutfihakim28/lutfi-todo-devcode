<script setup>
import BaseButton from './BaseButton.vue';
import { useAppStore } from '../stores/appStore';
import { useActivityStore } from '../stores/activityStore';
import { useItemStore } from '../stores/itemStore';
const props = defineProps({
  type: {
    type: String,
    default: 'delete-activity',
    validator: (value) => ['delete-activity', 'delete-list'].includes(value),
  },
  name: {
    type: String,
    default: undefined,
  },
  itemId: {
    type: Number,
    default: undefined,
  },
  activityId: {
    type: Number,
    default: undefined,
  },
});

const appStore = useAppStore();
const activityStore = useActivityStore();
const itemStore = useItemStore();

function deleteList(type) {
  appStore.dataState = 'loading';
  if (type === 'activity') {
    activityStore.deleteActivity(appStore.modal.activityId).then(() => {
      appStore.closeModal();
      activityStore.getActivities().then(() => {
        appStore.dataState = 'ready';
        appStore.openSnackbar('delete', 'Activity berhasil dihapus');
      });
    });
  }
  if (type === 'list') {
    itemStore.deleteItem(appStore.modal.itemId).then(() => {
      appStore.closeModal();
      activityStore.getActivity(appStore.modal.activityId).then(() => {
        appStore.dataState = 'ready';
        appStore.openSnackbar('delete', 'List berhasil dihapus');
      });
    });
  }
}
</script>

<template>
  <div
    class="z-40 shadow-custom-sm bg-white rounded-xl w-4/5 max-w-xs fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    data-cy="modal-delete"
    :class="type.includes('delete') ? 'lg:max-w-md' : 'lg:max-w-4xl'"
  >
    <div class="flex flex-col items-stretch px-9 py-9 lg:px-14 lg:py-11">
      <img
        src="../assets/icons/modal-delete-icon.svg"
        class="w-16 lg:w-20 self-center"
      />
      <p
        class="text-sm lg:text-lg text-center pt-7 pb-10 lg:pt-8 lg:pb-11"
        data-cy="modal-delete-title"
      >
        Apakah anda yakin menghapus
        {{ type.includes('activity') ? 'activity' : 'List Item' }}
        <span v-if="name"
          ><strong>"{{ name }}"</strong></span
        >
        ?
      </p>
      <div class="flex gap-x-2 lg:gap-x-5 justify-center">
        <base-button
          label="Batal"
          color="secondary"
          data-cy="modal-delete-cancel-button"
          @click="appStore.closeModal()"
        ></base-button>
        <base-button
          label="Hapus"
          color="danger"
          data-cy="modal-delete-confirm-button"
          :loading="appStore.dataState === 'loading'"
          @click="deleteList(props.type.split('-')[1])"
        ></base-button>
      </div>
    </div>
  </div>
</template>
