<script setup>
import MdiIcon from './MdiIcon.vue';
import {
  mdiAlertCircleOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
} from '@mdi/js';

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'delete', 'error'],
  },
  message: {
    type: String,
    default: undefined,
  },
});

const icons = {
  success: mdiCheckCircleOutline,
  delete: mdiAlertCircleOutline,
  error: mdiCloseCircleOutline,
};

const colors = {
  success: 'text-green-500',
  delete: 'text-custom-green',
  error: 'text-red-500',
};
</script>

<template>
  <div
    class="fixed top-0 left-1/2 -translate-x-1/2 translate-y-4 z-50 bg-white shadow-custom-sm rounded-xl flex items-center gap-x-2.5 w-4/5 max-w-xs lg:max-w-lg px-7 py-4"
    data-cy="modal-information"
    :class="colors[type]"
  >
    <mdi-icon :icon="icons[type]" class="w-6"></mdi-icon>
    <span v-if="message" class="text-sm font-medium text-custom-black">{{
      message
    }}</span>
  </div>
</template>
