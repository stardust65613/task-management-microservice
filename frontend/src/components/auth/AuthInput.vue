<script setup>
defineProps({
  label: String,
  type: String,
  placeholder: String,
});

const model = defineModel();
</script>

<template>
  <div>

    <label class="mb-2 block font-medium">
      {{ label }}
    </label>

    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
    />

  </div>
</template>