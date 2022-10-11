<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useActivityStore } from '../stores/activityStore.js';
import { useAppStore } from '../stores/appStore';
import { formatDate } from '../tools/date';
import { mdiLoading } from '@mdi/js';
import BaseButton from '../components/BaseButton.vue';
import MdiIcon from '../components/MdiIcon.vue';

const activityStore = useActivityStore();
const appStore = useAppStore();

appStore.dataState = 'loading';
activityStore.getActivities().then(() => (appStore.dataState = 'ready'));

const width = ref();
const imageSrc = computed(() => {
  if (width.value < 1024) {
    return '/assets/ilustrations/activity-empty-state.svg';
  }
  return '/assets/ilustrations/activity-empty-state-desktop.svg';
});
const activities = computed(() => {
  return activityStore.activities;
});
const dataState = computed(() => {
  return appStore.dataState;
});

function addActivity() {
  const data = {
    title: 'New Activity',
    email: appStore.email,
  };
  appStore.dataState = 'loading';
  activityStore.storeActivity(data).then(() => {
    activityStore.getActivities().then(() => {
      appStore.openSnackbar('success', 'New Activity berhasil ditambahkan');
      appStore.dataState = 'ready';
    });
  });
}
function openDeleteDialog(activity) {
  appStore.openModal('delete-activity', activity.title, activity.id);
}
function getDeviceWidth() {
  width.value = document.body.clientWidth;
}

onMounted(() => {
  window.addEventListener('load', getDeviceWidth());
  window.addEventListener('resize', getDeviceWidth());
});

onUnmounted(() => {
  window.removeEventListener('load', getDeviceWidth());
  window.removeEventListener('resize', getDeviceWidth());
});
</script>

<template>
  <div class="flex-1 flex flex-col items-stretch gap-y-9 lg:gap-y-12">
    <div class="flex justify-between items-center">
      <h3 class="text-base lg:text-4xl font-bold text-custom-black">
        Activity
      </h3>
      <base-button
        data-cy="activity-add-button"
        label="Tambah"
        icon="/assets/icons/tabler_plus.svg"
        :loading="dataState === 'loading'"
        @click="addActivity"
      ></base-button>
    </div>
    <div
      v-if="dataState === 'ready' && activities?.length === 0"
      class="flex-1 shrink-0 basis-full flex flex-col justify-center gap-y-9 lg:relative"
      data-cy="activity-empty-state"
    >
      <img
        class="w-full lg:max-w-3xl lg:mx-auto"
        :src="imageSrc"
        alt="empty state"
      />
      <p
        v-if="width < 1024"
        class="text-center font-medium text-base text-custom-gray"
      >
        Buat activity pertamamu
      </p>
    </div>
    <div
      v-if="dataState === 'ready' && activities?.length > 0"
      class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 pb-8"
    >
      <div
        v-for="(activity, index) in activities"
        class="flex flex-col justify-between rounded-xl bg-white p-4 lg:p-7 shadow-custom flex-1 h-screen max-h-card lg:max-h-card-lg"
        :data-cy="`activity-item-${index}`"
        :key="index"
      >
        <router-link
          class="text-sm lg:text-lg text-custom-black font-bold line-clamp-3"
          data-cy="activity-item-title"
          :to="{ name: 'ActivityList', params: { id: activity.id } }"
        >
          {{ activity.title }}
        </router-link>
        <div class="flex items-center justify-between">
          <span
            class="text-xxs leading-normal lg:text-sm text-custom-gray-200 font-medium"
            data-cy="activity-item-date"
            >{{ formatDate(new Date(activity.created_at)) }}</span
          >
          <base-button
            icon-only
            data-cy="activity-item-delete-button"
            icon="/assets/icons/activity-item-delete-button.svg"
            @click="openDeleteDialog(activity)"
          ></base-button>
        </div>
      </div>
    </div>
    <div v-if="dataState === 'loading'" class="relative top-8 mx-auto">
      <mdi-icon
        class="w-24 lg:w-36 text-gray-200 animate-spin"
        :icon="mdiLoading"
      ></mdi-icon>
    </div>
  </div>
</template>
