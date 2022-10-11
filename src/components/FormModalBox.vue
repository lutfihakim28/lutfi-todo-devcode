<script setup>
import BaseButton from './BaseButton.vue';
import { useAppStore } from '../stores/appStore';
import { useItemStore } from '../stores/itemStore';
import { useActivityStore } from '../stores/activityStore';
import {
  reactive,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
const props = defineProps({
  type: {
    type: String,
    default: 'delete-activity',
    validator: (value) => ['add', 'edit'].includes(value),
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
const itemStore = useItemStore();
const activityStore = useActivityStore();

const items = computed(() => itemStore.item);
const dataState = computed(() => appStore.dataState);

const priorityColor = {
  'very-high': 'bg-custom-red',
  high: 'bg-custom-yellow',
  normal: 'bg-custom-green',
  low: 'bg-custom-blue-100',
  'very-low': 'bg-custom-purple',
};

const isPriorityOptionShown = ref(false);
const priorityInput = ref();
const priorityOptionsRef = ref();
const item = reactive({
  title: /** @type {string} */ (undefined),
  priority: /** @type {string} */ ('very-high'),
  activity_group_id: /** @type {number} */ (props.activityId),
});

const isButtonDisabled = computed(() => {
  return !item.title;
});
const itemLabel = computed(() => {
  return item.priority
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
});
function focusPriorityInput() {
  priorityInput.value.focus();
}
function selectPriority(priority) {
  item.priority = priority;
  isPriorityOptionShown.value = false;
}
function addEditItem() {
  appStore.dataState = 'loading';
  if (props.type === 'add') {
    itemStore.storeItem(item).then(() => {
      appStore.closeModal();
      activityStore
        .getActivity(item.activity_group_id)
        .then(() => {
          appStore.dataState = 'ready';
          appStore.openSnackbar('success', 'Item berhasil ditambahkan');
        })
        .catch(() => {
          appStore.openSnackbar('error', 'Terjadi kesalahan');
        });
    });
  }
  if (props.type === 'edit') {
    const payload = {
      id: props.itemId,
      data: item,
    };
    itemStore.updateItem(payload).then(() => {
      appStore.closeModal();
      activityStore
        .getActivity(item.activity_group_id)
        .then(() => {
          appStore.dataState = 'ready';
          appStore.openSnackbar('success', 'Item berhasil diubah');
        })
        .catch(() => {
          appStore.openSnackbar('error', 'Terjadi kesalahan');
        });
    });
  }
}

watch(items, () => {
  item.title = items.value.title;
  item.activity_group_id = items.value.activity_group_id;
  item.priority = items.value.priority;
});

function outsideClickListener(event) {
  function figureOutOutsideClickRecursively(element) {
    if (priorityOptionsRef.value === element) {
      return false;
    }
    if (!element.parentElement) {
      return true;
    }
    return figureOutOutsideClickRecursively(element.parentElement);
  }
  const isOutside = figureOutOutsideClickRecursively(event.target);
  if (isOutside) {
    isPriorityOptionShown.value = false;
  }
  if (!isOutside) {
    isPriorityOptionShown.value = true;
  }
}

if (props.type === 'edit') {
  appStore.dataState = 'loading';
  itemStore.getItem(appStore.modal.itemId).then((res) => {
    item.title = res.data.title;
    item.priority = res.data.priority;
    appStore.dataState = 'ready';
  });
}

onMounted(() => {
  window.addEventListener('click', outsideClickListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', outsideClickListener);
});
</script>

<template>
  <div
    class="z-40 shadow-custom-sm bg-white rounded-xl w-4/5 max-w-xs fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    data-cy="modal-add"
    :class="type.includes('delete') ? 'lg:max-w-md' : 'lg:max-w-4xl'"
  >
    <div class="flex flex-col items-stretch w-full">
      <form @submit.prevent="">
        <section
          class="py-4 px-5 lg:py-6 lg:px-7 flex items-center justify-between"
        >
          <h4 class="text-base lg:text-lg font-semibold">
            {{ type === 'add' ? 'Tambah' : 'Ubah' }} List Item
          </h4>
          <base-button
            icon="/assets/icons/modal-add-close-button.svg"
            icon-size="w-4 lg:w-6"
            data-cy="modal-add-close-button"
            icon-only
            @click="appStore.closeModal()"
          ></base-button>
        </section>
        <section
          class="py-4 px-5 lg:py-6 lg:px-7 border-y flex flex-col items-stretch gap-y-6"
        >
          <label for="title" class="flex flex-col items-stretch gap-y-3">
            <span class="text-xxs leading-normal font-semibold"
              >NAMA LIST ITEM</span
            >
            <input
              v-model="item.title"
              id="title"
              type="text"
              name="title"
              class="p-4 focus:outline-none border border-gray-300 focus:border-custom-blue rounded-md"
              placeholder="Tambahkan nama list item"
              data-cy="modal-add-name-input"
              :disabled="dataState === 'loading'"
            />
          </label>
          <div class="flex flex-col items-stretch gap-y-3">
            <label for="priority" class="text-xxs leading-normal font-semibold"
              >Priority</label
            >
            <div class="relative w-fit max-w-full">
              <div
                ref="priorityOptionsRef"
                data-cy="modal-add-priority-dropdown"
                class="relative"
              >
                <input
                  ref="priorityInput"
                  name="priority"
                  id="priority"
                  class="pl-9 lg:pl-12 p-4 max-w-full bg-white text-base text-custom-black appearance-none focus:bg-gray-50 cursor-pointer focus:outline-none border border-gray-300 focus:border-custom-blue"
                  readonly
                  :disabled="dataState === 'loading'"
                  :value="itemLabel"
                  :class="isPriorityOptionShown ? 'rounded-t-md' : 'rounded-md'"
                />
                <div
                  class="absolute w-full px-4 top-1/2 -translate-y-1/2 flex items-center justify-between cursor-pointer"
                  @click="focusPriorityInput"
                >
                  <span
                    class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full"
                    :class="priorityColor[item.priority]"
                  ></span>
                  <img
                    src="/assets/icons/tabler_chevron-down.svg"
                    class="w-3 lg:w-6 transition-transform"
                    :class="{ 'rotate-180': isPriorityOptionShown }"
                  />
                </div>
              </div>
              <Transition name="select">
                <ul
                  v-show="isPriorityOptionShown"
                  class="absolute z-50 rounded-b-md bg-white w-full border overflow-auto"
                >
                  <li
                    class="last:border-0 border-b hover:bg-custom-gray-100"
                    data-cy="modal-add-priority-very-high"
                  >
                    <button
                      class="px-4 py-2.5 lg:py-3 flex items-center w-full gap-x-3 lg:gap-x-5"
                      @click="selectPriority('very-high')"
                    >
                      <span
                        class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full bg-custom-red"
                      ></span>
                      <span>Very High</span>
                    </button>
                  </li>
                  <li
                    class="last:border-0 border-b hover:bg-custom-gray-100"
                    data-cy="modal-add-priority-high"
                  >
                    <button
                      class="px-4 py-2.5 lg:py-3 flex items-center w-full gap-x-3 lg:gap-x-5"
                      @click="selectPriority('high')"
                    >
                      <span
                        class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full bg-custom-yellow"
                      ></span>
                      <span>High</span>
                    </button>
                  </li>
                  <li
                    class="last:border-0 border-b hover:bg-custom-gray-100"
                    data-cy="modal-add-priority-normal"
                  >
                    <button
                      class="px-4 py-2.5 lg:py-3 flex items-center w-full gap-x-3 lg:gap-x-5"
                      @click="selectPriority('normal')"
                    >
                      <span
                        class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full bg-custom-green"
                      ></span>
                      <span>Normal</span>
                    </button>
                  </li>
                  <li
                    class="last:border-0 border-b hover:bg-custom-gray-100"
                    data-cy="modal-add-priority-low"
                  >
                    <button
                      class="px-4 py-2.5 lg:py-3 flex items-center w-full gap-x-3 lg:gap-x-5"
                      @click="selectPriority('low')"
                    >
                      <span
                        class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full bg-custom-blue-100"
                      ></span>
                      <span>Low</span>
                    </button>
                  </li>
                  <li
                    class="last:border-0 border-b hover:bg-custom-gray-100"
                    data-cy="modal-add-priority-very-low"
                  >
                    <button
                      class="px-4 py-2.5 lg:py-3 flex items-center w-full gap-x-3 lg:gap-x-5"
                      @click="selectPriority('very-low')"
                    >
                      <span
                        class="inline-block w-2 h-2 lg:w-3.5 lg:h-3.5 rounded-full bg-custom-purple"
                      ></span>
                      <span>Very Low</span>
                    </button>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>
        </section>
        <section class="py-4 px-5 lg:py-6 lg:px-7 flex justify-end">
          <base-button
            label="Simpan"
            data-cy="modal-add-save-button"
            :disabled="isButtonDisabled"
            :loading="dataState === 'loading'"
            @click="addEditItem"
          ></base-button>
        </section>
      </form>
    </div>
  </div>
</template>
