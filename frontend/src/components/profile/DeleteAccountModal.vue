<script setup>
import { useUserStore } from "@/stores/user.store";
import router from "@/router";

const userStore = useUserStore();

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

const deleteAccount = async () => {
  await userStore.deleteAccount();

  router.push("/auth/login");
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

      <h2 class="mb-3 text-xl font-bold text-red-600">
        Delete Account
      </h2>


      <p class="mb-5 text-gray-600 dark:text-gray-300">
        Are you sure you want to delete your account?
      </p>


      <div class="flex justify-end gap-3">

        <button
          @click="close"
          class="rounded-lg px-4 py-2"
        >
          Cancel
        </button>


        <button
          @click="deleteAccount" 
          class="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Delete
        </button>

      </div>

    </div>

  </div>
</template>