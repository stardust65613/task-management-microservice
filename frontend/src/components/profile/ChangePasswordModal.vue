<script setup>
import { ref } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

const currentPassword = ref("");
const newPassword = ref("");

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits([
  "update:modelValue",
]);


const close = () => {
  emit(
    "update:modelValue",
    false
  );
};

const handleChange = async () => {
  
};

</script>


<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center bg-black/50"
  >

    <div
      class="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800"
    >

      <h2 class="mb-5 text-xl font-bold dark:text-white">
        Change Password
      </h2>


      <BaseInput
        v-model="currentPassword"
        type="password"
        placeholder="Current password"
        class="mb-3"
      />


      <BaseInput 
        v-model="newPassword"
        type="password"
        placeholder="New password"
        class="mb-5"
      />


      <div class="flex justify-end gap-3">

        <button
          @click="close"
          class="rounded-lg px-4 py-2"
        >
          Cancel
        </button>


        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save
        </button>

      </div>

    </div>

  </div>
</template>