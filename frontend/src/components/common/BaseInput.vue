<script setup>
defineOptions({
  inheritAttrs: false,
});


defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },

  type: {
    type: String,
    default: "text",
  },

  placeholder: {
    type: String,
    default: "",
  },
});


const emit = defineEmits([
  "update:modelValue",
]);

</script>


<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    v-bind="$attrs"
    @input="emit('update:modelValue', $event.target.value)"
    class="
      w-full
      rounded-lg
      border
      border-gray-300
      bg-white
      px-4
      py-3
      text-gray-900
      outline-none
      ring-0
      transition

      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-500/30

      dark:border-gray-600
      dark:bg-gray-700
      dark:text-white
      dark:placeholder-gray-400

      dark:focus:border-blue-500
      dark:focus:ring-blue-500/30
    "
  />
</template>