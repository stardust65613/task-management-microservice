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

        <div class="relative">
          <img
            :src="avatarUrl"
            class="h-28 w-28 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
            alt="Profile avatar"
          />

          <button
            v-if="isMe"
            type="button"
            @click="avatarInput.click()"
            :disabled="uploadingAvatar"
            class="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Change avatar"
          >
            <img :src="editIcon" class="h-5 w-5" alt="Edit" />
          </button>

          <input
            ref="avatarInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>

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
        @click="showEditProfile = true"
        class="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Edit Profile
      </button>


      <button
        @click="showChangePassword = true"
        class="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Change Password
      </button>


      <button
        @click="showDeleteAccount = true"
        class="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
      >
        Delete Account
      </button>

    </div>

    <EditProfileModal
      v-model="showEditProfile"
      @updated="handleUpdated"
    />


    <ChangePasswordModal
      v-model="showChangePassword"
    />


    <DeleteAccountModal
      v-model="showDeleteAccount"
    />

  </div>
</template>

<script setup>
import editIcon from "@/assets/icons/edit.svg";
import { ref, computed, onMounted, onBeforeUnmount, reactive } from "vue";
import * as fileService from "@/services/file.service";
import defaultAvatar from "@/assets/avatar.png";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import {
  getUserInfo,
  getMyInfo,
  editMyAvatar,
} from "@/services/user.service";

import EditProfileModal from "@/components/profile/EditProfileModal.vue";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal.vue";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal.vue";

const route = useRoute();
const userStore = useUserStore();

const profileUser = ref(null);

const showEditProfile = ref(false);
const showChangePassword = ref(false);
const showDeleteAccount = ref(false);

const avatarInput = ref(null);
const previewAvatar = ref(null);
const avatarUrl = ref(defaultAvatar);

const handleUpdated = (updatedUser) => {
  profileUser.value = updatedUser;
};

const isMe = computed(() => {
  return !route.params.id ||
    route.params.id === userStore.user?.id;
});

async function loadProfile() {
  try {
    if (!route.params.id || route.params.id === userStore.user?.id) {
      const res = await getMyInfo();

      profileUser.value = res.data.data ?? res.data;

      // Đồng bộ Pinia
      userStore.user = {
        ...userStore.user,
        ...profileUser.value,
      };
    } else {
      const res = await getUserInfo(route.params.id);
      profileUser.value = res.data.data ?? res.data;
    }

    await loadAvatar();
  } catch (err) {
    console.error("Load profile error:", err);
  }
}

const statistics = reactive({
  projects: 3,
  tasks: 24,
  completed: 15,
});

const uploadingAvatar = ref(false);

const handleAvatarChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    alert("Please select PNG, JPEG or WebP image");
    event.target.value = "";
    return;
  }

  // Preview ảnh
  if (avatarUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarUrl.value);
  }

  avatarUrl.value = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "AVATAR");

  uploadingAvatar.value = true;

  try {
    // Upload ảnh
    const uploadRes = await fileService.uploadFile(formData);
    const uploadedFile = uploadRes.data?.data ?? uploadRes.data;

    const fileId = uploadedFile.id;

    if (!fileId) {
      throw new Error("File ID not found in upload response");
    }

    // Cập nhật avatar
    const updateRes = await editMyAvatar({ fileId });

    profileUser.value = {
      ...profileUser.value,
      avatar: fileId,
    };

    if (isMe.value && userStore.user) {
      userStore.user.avatar = fileId;
    }

    console.log("Update avatar response:", updateRes.data);
  } catch (err) {
    console.error("Avatar upload error:", err);

    alert(
      err.response?.data?.message ||
      err.message ||
      "Failed to update avatar"
    );

    await loadAvatar();
  } finally {
    uploadingAvatar.value = false;
    event.target.value = "";
  }
};

const loadAvatar = async () => {
  if (avatarUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarUrl.value);
  }

  avatarUrl.value = defaultAvatar;

  if (!profileUser.value?.avatar) return;

  try {
    const response = await fileService.previewFile(
      profileUser.value.avatar
    );

    avatarUrl.value = URL.createObjectURL(response.data);
  } catch (err) {
    console.error("Failed to load avatar:", err);
  }
};

onMounted(() => {
  loadProfile();
});

onBeforeUnmount(() => {
  if (avatarUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarUrl.value);
  }

  if (previewAvatar.value) {
    URL.revokeObjectURL(previewAvatar.value);
  }
});
</script>