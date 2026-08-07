<template>
  <div v-if="profileUser" class="space-y-8">

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
        Account
      </h1>

      <p class="mt-1 text-gray-500 dark:text-gray-400">
        View account information and profile details.
      </p>
    </div>


    <!-- Profile -->
    <div
      class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex flex-col items-center gap-5 md:flex-row">

        <img
          :src="avatar"
          class="h-28 w-28 rounded-full object-cover"
        />

        <div class="flex-1 text-center md:text-left">

          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ profileUser.firstName }} {{ profileUser.lastName }}
          </h2>

          <p class="mt-1 text-gray-500 dark:text-gray-400">
            @{{ profileUser.username }}
          </p>

          <span
            class="mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium"
            :class="
              profileUser.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            "
          >
            {{ profileUser.isActive ? "Active" : "Inactive" }}
          </span>

        </div>

      </div>
    </div>


    <!-- Information -->
    <div
      class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >

      <div class="border-b border-gray-200 p-6 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
      </div>


      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            First Name
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ profileUser.firstName || "-" }}
          </p>
        </div>


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Last Name
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ profileUser.lastName || "-" }}
          </p>
        </div>


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Username
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ profileUser.username }}
          </p>
        </div>


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Email
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ profileUser.email }}
          </p>
        </div>


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Status
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ profileUser.isActive ? "Active" : "Inactive" }}
          </p>
        </div>


        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Joined
          </p>

          <p class="mt-1 font-medium dark:text-white">
            {{ new Date(profileUser.createdAt).toLocaleDateString() }}
          </p>
        </div>


      </div>

    </div>


    <!-- Statistics -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">


      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Projects
        </p>

        <p class="mt-2 text-3xl font-bold text-blue-600">
          {{ statistics.projects }}
        </p>
      </div>


      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Tasks
        </p>

        <p class="mt-2 text-3xl font-bold text-emerald-600">
          {{ statistics.tasks }}
        </p>
      </div>


      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Completed
        </p>

        <p class="mt-2 text-3xl font-bold text-violet-600">
          {{ statistics.completed }}
        </p>
      </div>


    </div>


    <!-- Actions only owner -->
    <div
      v-if="isMe"
      class="flex flex-wrap justify-end gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >

      <button
        class="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Edit Profile
      </button>


      <button
        class="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Change Password
      </button>


      <button
        class="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
      >
        Delete Account
      </button>

    </div>

  </div>
</template>

<script setup>
import avatar from "@/assets/avatar.png";
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { getUserInfo } from "@/services/user.service";

const route = useRoute();
const userStore = useUserStore();

const profileUser = ref(null);


const isMe = computed(() => {
  return !route.params.id ||
    route.params.id === userStore.user?.id;
});


async function loadProfile() {
  // Xem profile của mình (route.params.id)
  if (!route.params.id) {
    profileUser.value = userStore.user;
    return;
  }

  const res = await getUserInfo(route.params.id);

  profileUser.value = res.data;

}

const statistics = reactive({
  projects: 3,
  tasks: 24,
  completed: 15,
});

onMounted(() => {
  loadProfile();
});
</script>