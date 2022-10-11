<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useActivityStore } from '../stores/activityStore.js';
import { useAppStore } from '../stores/appStore';
import { useRoute, useRouter } from 'vue-router';
import { useItemStore } from '../stores/itemStore';
import { mdiLoading } from '@mdi/js';
import BaseButton from '../components/BaseButton.vue';
import MdiIcon from '../components/MdiIcon.vue';

const activityStore = useActivityStore();
const appStore = useAppStore();
const itemStore = useItemStore();

activityStore.getActivities();

const sortOptions = [
  {
    icon: '/assets/icons/sort-selection-icon-4.svg',
    label: 'Terbaru',
    value: 'newest',
    dataCy: 'sort-latest',
  },
  {
    icon: '/assets/icons/sort-selection-icon-2.svg',
    label: 'Terlama',
    value: 'oldest',
    dataCy: 'sort-oldest',
  },
  {
    icon: '/assets/icons/sort-selection-icon.svg',
    label: 'A-Z',
    value: 'ascending',
    dataCy: 'sort-az',
  },
  {
    icon: '/assets/icons/sort-selection-icon-1.svg',
    label: 'Z-A',
    value: 'descending',
    dataCy: 'sort-za',
  },
  {
    icon: '/assets/icons/sort-selection-icon-3.svg',
    label: 'Belum Selesai',
    value: 'active',
    dataCy: 'sort-unfinished',
  },
];

const route = useRoute();
const router = useRouter();

const priorityColor = {
  'very-high': 'bg-custom-red',
  high: 'bg-custom-yellow',
  normal: 'bg-custom-green',
  low: 'bg-custom-blue-100',
  'very-low': 'bg-custom-purple',
};

const width = ref();
const sortingRef = ref();
const isSortOptionShown = ref(false);
const sort = ref(
  /** @type {'newest' | 'oldest' | 'ascending' | 'descending' | 'active'} */ (
    'newest'
  )
);
const title = ref(/** @type {HTMLElement} */ (undefined));
const imageSrc = computed(() => {
  if (width.value < 1024) {
    return '/assets/ilustrations/todo-empty-state_mobile.svg';
  }
  return '/assets/ilustrations/todo-empty-state.svg';
});
const activity = computed(() => {
  return activityStore.activity;
});
const dataState = computed(() => {
  return appStore.dataState;
});
const sortedItems = computed(() => {
  if (sort.value === 'oldest') {
    return activity.value.todo_items.reverse();
  }
  if (sort.value === 'newest') {
    return activity.value.todo_items;
  }
  return activity.value.todo_items.sort((a, b) => {
    if (sort.value === 'ascending') {
      const first = a.title.toLowerCase();
      const second = b.title.toLowerCase();
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
      return 0;
    }

    if (sort.value === 'descending') {
      const first = a.title.toLowerCase();
      const second = b.title.toLowerCase();
      if (first < second) {
        return 1;
      }
      if (first > second) {
        return -1;
      }
      return 0;
    }

    if (sort.value === 'active') {
      return b.is_active - a.is_active;
    }
  });
});

function addItemList(type, itemId) {
  appStore.openModal(type, undefined, parseInt(route.params.id), itemId);
  itemStore.item.activity_group_id = parseInt(route.params.id);
}
function getDeviceWidth() {
  width.value = document.body.clientWidth;
}
function focusTitle() {
  title.value.focus();
}
function saveEditTitle(event) {
  if (event instanceof KeyboardEvent) {
    event.preventDefault();
  }
  const id = route.params.id;
  const data = {
    title: event.target.textContent,
  };
  activityStore.updateActivity(data, id).then(() => {
    activityStore.getActivity(route.params.id).then(() => {
      appStore.openSnackbar('success', 'Activity berhasil diperbarui');
      title.value.blur();
    });
  });
}
function cancelEditTitle() {
  title.value.innerText = activity.value.title;
}
function backToPreviousPage() {
  router.go(-1);
}
function sortItems(value) {
  sort.value = value;
}
function openDeleteDialog(item) {
  appStore.openModal(
    'delete-list',
    item.title,
    parseInt(route.params.id),
    item.id
  );
}

function clickOutsideSortList(event) {
  function clickOutsideRecursively(element) {
    if (sortingRef.value === element) {
      return false;
    }
    if (!element.parentElement) {
      return true;
    }
    return clickOutsideRecursively(element.parentElement);
  }
  const isOutside = clickOutsideRecursively(event.target);
  if (isOutside) {
    isSortOptionShown.value = false;
  }
  if (!isOutside) {
    isSortOptionShown.value = !isSortOptionShown.value;
  }
}
function checkItem(event, item) {
  const parent = event.target.parentElement;
  const title = parent.children[1].children[1].children[0];
  const isActive = event.target.checked ? 0 : 1;
  const payload = {
    id: item.id,
    data: {
      title: item.title,
      priority: item.priority,
      is_active: isActive,
    },
  };

  if (event.target.checked) {
    title.classList.add('line-through');
  }
  if (!event.target.checked) {
    title.classList.remove('line-through');
  }
  itemStore.updateItem(payload).then(() => {
    activityStore.getActivity(route.params.id);
  });
}

appStore.dataState = 'loading';
activityStore
  .getActivity(route.params.id)
  .then(() => (appStore.dataState = 'ready'));

onMounted(() => {
  window.addEventListener('load', getDeviceWidth());
  window.addEventListener('resize', getDeviceWidth());
  window.addEventListener('click', clickOutsideSortList);
});

onUnmounted(() => {
  window.removeEventListener('load', getDeviceWidth());
  window.removeEventListener('resize', getDeviceWidth());
  window.removeEventListener('click', clickOutsideSortList);
});
</script>

<template>
  <div class="flex-1 flex flex-col items-stretch gap-y-7 lg:gap-y-12">
    <div
      class="flex flex-col items-strecth gap-y-6 lg:flex-row lg:justify-between lg:items-center"
    >
      <div
        class="focus-within:border-b pb-2.5 flex items-center lg:justify-start lg:gap-x-6"
      >
        <base-button
          v-if="width >= 1024"
          icon="/assets/icons/todo-back-button.svg"
          icon-only
          data-cy="todo-back-button"
          @click="backToPreviousPage"
        ></base-button>
        <h3
          ref="title"
          class="flex-1 text-base lg:text-4xl font-bold text-custom-black focus:outline-none"
          contenteditable="true"
          data-cy="todo-title"
          @blur="cancelEditTitle"
          @keydown.enter="saveEditTitle"
        >
          {{ activity.title }}
        </h3>
        <base-button
          icon="/assets/icons/todo-title-edit-button.svg"
          icon-size="w-5 lg:w-6"
          icon-only
          data-cy="todo-title-edit-button"
          @click="focusTitle"
        ></base-button>
      </div>
      <div class="self-end flex items-center gap-x-2.5 lg:gap-x-4">
        <div
          v-if="activity.todo_items?.length > 0"
          ref="sortingRef"
          class="relative"
        >
          <div class="flex items-center">
            <base-button
              icon-size="w-9 lg:w-14"
              icon="/assets/icons/todo-sort-button.svg"
              data-cy="todo-sort-button"
              icon-only
            ></base-button>
          </div>
          <Transition name="select">
            <ul
              v-show="isSortOptionShown"
              class="absolute z-50 right-0 shadow-custom-sm rounded-md bg-white w-screen max-w-select-sm lg:max-w-select-lg"
              data-cy="sort-parent"
            >
              <li
                v-for="(option, index) in sortOptions"
                class="last:border-0 border-b hover:bg-custom-gray-100"
                :key="index"
              >
                <button
                  class="px-4 py-3 lg:px-5 lg:py-4 flex items-center w-full"
                  @click="sortItems(option.value)"
                >
                  <div class="flex-1 flex items-center gap-x-3 lg:gap-x-4">
                    <img class="w-3.5 lg:w-5 no-events" :src="option.icon" />
                    <span class="text-sm lg:text-base text-custom-gray-300">
                      {{ option.label }}
                    </span>
                  </div>
                  <img
                    v-if="sort === option.value"
                    class="w-3.5 lg:w-5 no-events"
                    src="/assets/icons/sort-selection-selected.svg"
                  />
                </button>
              </li>
            </ul>
          </Transition>
        </div>
        <base-button
          class="lg:self-center"
          label="Tambah"
          icon="/assets/icons/tabler_plus.svg"
          data-cy="todo-add-button"
          :loading="dataState === 'loading'"
          @click="addItemList('add')"
        ></base-button>
      </div>
    </div>
    <div
      v-if="activity.todo_items?.length === 0 && dataState === 'ready'"
      class="flex-1 shrink-0 basis-full flex flex-col justify-center gap-y-9 lg:relative"
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
        Buat List Item kamu
      </p>
    </div>
    <ul
      v-if="dataState === 'ready' && activity.todo_items?.length > 0"
      class="flex flex-col items-stretch gap-y-2.5 pb-8"
    >
      <li
        v-for="(item, index) in sortedItems"
        class="bg-white shadow-custom rounded-xl px-4 py-5 lg:px-7 lg:py-8 flex items-center gap-x-3.5 lg:gap-x-5 hover:bg-gray-100"
        :data-cy="`todo-item-${index}`"
        :key="index"
      >
        <input
          type="checkbox"
          class="cursor-pointer"
          data-cy="todo-item-checkbox"
          :checked="!item.is_active"
          @change="checkItem($event, item)"
        />
        <div class="flex-1 flex items-center gap-x-3.5 lg:gap-x-4">
          <span
            class="inline-block w-1 h-1 lg:w-2 lg:h-2 rounded-full"
            data-cy="todo_item_priority_indicator"
            :class="priorityColor[item.priority]"
          ></span>
          <div class="flex items-center gap-x-2 lg:gap-x-4">
            <span
              class="text-sm font-medium lg:text-lg text-custom-black"
              data-cy="todo-item-title"
              :class="{ 'line-through': !item.is_active }"
            >
              {{ item.title }}
            </span>
            <base-button
              icon="/assets/icons/todo-title-edit-button.svg"
              icon-size="w-4 lg:w-5"
              data-cy="todo-item-edit-button"
              icon-only
              @click="addItemList('edit', item.id)"
            ></base-button>
          </div>
        </div>
        <base-button
          icon-only
          icon="/assets/icons/activity-item-delete-button.svg"
          data-cy="todo-item-delete-button"
          @click="openDeleteDialog(item)"
        ></base-button>
      </li>
    </ul>
    <div v-if="dataState === 'loading'" class="relative top-8 mx-auto">
      <mdi-icon
        class="w-24 lg:w-36 text-gray-200 animate-spin"
        :icon="mdiLoading"
      ></mdi-icon>
    </div>
  </div>
</template>
