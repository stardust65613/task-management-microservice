<script setup>
import { ref } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

const firstName = ref("");
const lastName = ref("");
const username = ref("");

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits([
  "update:modelValue",
  "updated"
]);


const close = () => {
  emit(
    "update:modelValue",
    false
  );
};

const handleSave = async () => {
  try {
    const updatedUser = await userStore.editMyInformation(
      {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
      }
    );

    alert("Update successfully");

    emit("updated", updatedUser);
  } catch (error) {
    alert(error.response?.data?.message || "Update failed");
  }
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
        Edit Profile
      </h2>


      <BaseInput
        v-model="firstName"
        type = "text"
        placeholder="First name"
        class="mb-3"
      />


      <BaseInput
        v-model="lastName"
        type = "text"
        placeholder="Last name"
        class="mb-3"
      />


      <BaseInput
        v-model="username"
        type = "text"
        placeholder="Username"
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
          @click="handleSave"
          class="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save
        </button>

      </div>

    </div>

  </div>
</template>