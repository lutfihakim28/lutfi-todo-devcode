<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from './stores/appStore.js';
import AppOverlay from './components/AppOverlay.vue';
import DeleteModalBox from './components/DeleteModalBox.vue';
import FormModalBox from './components/FormModalBox.vue';
import SnackbarAlert from './components/SnackbarAlert.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const width = ref();

const modal = computed(() => appStore.modal);
const snackbar = computed(() => appStore.snackbar);

function closeModal() {
  appStore.modal.visibility = false;
}

function getDeviceWidth() {
  width.value = document.body.clientWidth;
}

function backToPreviousPage() {
  router.go(-1);
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
  <section
    class="flex flex-col gap-y-7 lg:gap-y-12 lg:pb-16 min-h-screen bg-white lg:bg-custom-gray-100"
  >
    <header class="py-4 lg:py-8 bg-custom-blue shadow-custom-sm">
      <div class="px-5 lg:w-full lg:max-w-5xl lg:mx-auto">
        <button
          class="text-white flex items-center gap-x-3"
          :disabled="!route.meta.hasBackButton || width >= 1024"
          @click="backToPreviousPage"
        >
          <img
            v-if="route.meta.hasBackButton && width < 1024"
            src="./assets/icons/todo-back-button_white.svg"
            class="w-5"
          />
          <h1
            class="uppercase text-base lg:text-2xl font-bold text-white"
            data-cy="header-title"
          >
            {{ width < 1024 ? route.meta.title : 'To Do List App' }}
          </h1>
        </button>
      </div>
    </header>
    <main class="flex-1 px-5 flex flex-col lg:w-full lg:max-w-5xl lg:mx-auto">
      <router-view></router-view>
    </main>
  </section>

  <Teleport to="body">
    <Transition name="fade">
      <app-overlay v-if="modal.visibility" @click="closeModal"></app-overlay>
    </Transition>
  </Teleport>
  <Teleport to="body">
    <Transition name="modal">
      <delete-modal-box
        v-show="modal.visibility && modal.type.includes('delete')"
        :type="modal.type"
        :name="modal.itemName"
        :activity-id="modal.activityId"
        :item-id="modal.itemId"
      ></delete-modal-box>
    </Transition>
  </Teleport>
  <Teleport to="body">
    <Transition name="modal">
      <form-modal-box
        v-if="modal.visibility && ['add', 'edit'].includes(modal.type)"
        :type="modal.type"
        :name="modal.itemName"
        :item-id="modal.itemId"
        :activity-id="modal.activityId"
      ></form-modal-box>
    </Transition>
  </Teleport>
  <Teleport to="body">
    <Transition name="snackbar">
      <snackbar-alert
        v-if="snackbar.visibility"
        :type="snackbar.type"
        :message="snackbar.message"
      ></snackbar-alert>
    </Transition>
  </Teleport>
</template>
