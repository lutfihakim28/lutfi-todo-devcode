<script lang="ts" setup>
  const props = defineProps({
    icon: { type: String, required: true },
    title: { type: String, default: '' },
  });
  </script>
  
  <template>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <title v-if="props.title">{{ props.title }}</title>
      <path
        :d="props.icon"
        fill="currentColor"
      ></path>
    </svg>
  </template>