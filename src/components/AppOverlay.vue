<script setup>
const emits = defineEmits(['click']);
</script>

<template>
  <div
    class="fixed top-0 left-0 w-screen h-screen bg-black/50"
    @click="emits('click')"
  ></div>
</template>
