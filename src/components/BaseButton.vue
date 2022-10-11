<script setup>
import MdiIcon from './MdiIcon.vue';
import { mdiLoading } from '@mdi/js';

const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'secondary'].includes(value),
  },
  iconSize: {
    type: String,
    default: 'w-3 lg:w-6',
  },
  type: {
    type: String,
    default: 'button',
  },
  iconOnly: Boolean,
  loading: Boolean,
  disabled: Boolean,
});

const emits = defineEmits(['click']);

const color = {
  primary: 'bg-custom-blue text-white disabled:bg-custom-blue/20',
  danger: 'bg-custom-red text-white disabled:bg-custom-red/20',
  secondary:
    'bg-custom-gray-100 text-custom-gray-300 disabled:bg-custom-gray-100/20',
};
</script>

<template>
  <button
    :class="
      iconOnly
        ? ''
        : `relative text-xs lg:text-lg font-semibold rounded-full min-w-button ${
            color[props.color]
          }`
    "
    :disabled="disabled || loading"
    :type="type"
    @click="emits('click')"
  >
    <div
      class="no-events"
      :class="{
        'relative flex items-center gap-x-1.5 py-2 px-4 lg:py-3 lg:px-7 ':
          !iconOnly,
        'opacity-0': loading,
      }"
    >
      <img v-if="icon" :src="icon" :class="iconSize" />
      <!-- <mdi-icon class="w-3 lg:w-6" :icon="mdiPlus"></mdi-icon> -->
      <span
        v-if="label"
        class="text-base font-semibold"
        :class="{ 'relative left-1/2 -translate-x-1/2': !icon }"
      >
        {{ label }}
      </span>
    </div>
    <div
      v-if="loading"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <mdi-icon class="w-3 lg:w-6 animate-spin" :icon="mdiLoading"></mdi-icon>
    </div>
  </button>
</template>
