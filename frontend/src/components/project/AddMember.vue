<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { useProjectStore } from "@/stores/project.store";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["close", "added"]);

const projectStore = useProjectStore();
const userStore = useUserStore();

const email = ref("");
const user = ref(null);

const searching = ref(false);
const adding = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

let searchRequestId = 0;

function resetSearch() {
  user.value = null;
  errorMessage.value = "";
  successMessage.value = "";
}

async function searchUser() {
  const searchEmail = email.value.trim();

  resetSearch();

  if (!searchEmail) {
    errorMessage.value = "Please enter an email address.";
    return;
  }

  const requestId = ++searchRequestId;
  searching.value = true;

  try {
    const result = await userStore.getUserInfoByEmail({email: searchEmail});

    if (requestId !== searchRequestId) return;

    user.value = result?.user ?? result ?? null;

    if (!user.value) {
      errorMessage.value = "No user found with this email address.";
    } else if (
      user.value.email?.toLowerCase() !== searchEmail.toLowerCase()
    ) {
      user.value = null;
      errorMessage.value = "No user found with this email address.";
    }
  } catch (error) {
    if (requestId !== searchRequestId) return;

    errorMessage.value =
      error?.response?.status === 404
        ? "No user found with this email address."
        : error?.response?.data?.message ||
          "Failed to search for user. Please try again.";
  } finally {
    if (requestId === searchRequestId) {
      searching.value = false;
    }
  }
}
async function addMember() {
  if (!user.value || adding.value) return;

  adding.value = true;
  errorMessage.value = "";

  try {
    await projectStore.addMember(props.projectId, {
      userId: user.value.id,
    });

    emit("added");
    emit("close");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add member.";
  } finally {
    adding.value = false;
  }
}

function closeModal() {
  emit("close");
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

watch(email, () => {
  searchRequestId++;
  user.value = null;
  errorMessage.value = "";
  successMessage.value = "";
});

onBeforeUnmount(() => {
  searchRequestId++;
});
</script>

<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center
           bg-black/50 p-4 backdrop-blur-sm"
    @click.self="closeModal"
    @keydown.esc="closeModal"
  >
    <!-- Modal -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-member-title"
      class="w-full max-w-lg overflow-hidden rounded-2xl
             border border-gray-200 bg-white shadow-xl
             dark:border-gray-700 dark:bg-gray-900"
    >
      <!-- Header -->
      <div
        class="flex items-start justify-between border-b border-gray-200
               px-6 py-5 dark:border-gray-700"
      >
        <div>
          <h2
            id="add-member-title"
            class="text-xl font-semibold text-gray-800 dark:text-white"
          >
            Add a member
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Find an existing user by email and add them to this project.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close modal"
          class="rounded-lg p-2 text-gray-500 transition
                 hover:bg-gray-100 hover:text-gray-800
                 disabled:opacity-50
                 dark:text-gray-400 dark:hover:bg-gray-800
                 dark:hover:text-white"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="space-y-5 p-6">
        <!-- Search Form -->
        <form @submit.prevent="searchUser">
          <label
            for="member-email"
            class="mb-2 block text-sm font-medium
                   text-gray-700 dark:text-gray-300"
          >
            User email
          </label>

          <div class="flex gap-2">
            <input
              id="member-email"
              v-model="email"
              type="email"
              required
              autocomplete="off"
              placeholder="name@example.com"
              class="min-w-0 flex-1 rounded-lg border border-gray-300
                     bg-white px-4 py-2.5 text-sm text-gray-800
                     outline-none transition placeholder:text-gray-400
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                     dark:border-gray-700 dark:bg-gray-800
                     dark:text-white dark:focus:ring-blue-900/40"
            />

            <button
              type="submit"
              class="flex shrink-0 items-center justify-center gap-2
                     rounded-lg bg-blue-600 px-4 py-2.5 text-sm
                     font-medium text-white transition
                     hover:bg-blue-700
                     disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="searching || adding || !email.trim()"
            >
              <span
                v-if="searching"
                class="h-4 w-4 animate-spin rounded-full border-2
                       border-white/40 border-t-white"
              ></span>

              {{ searching ? "Searching..." : "Search" }}
            </button>
          </div>
        </form>

        <!-- Error -->
        <div
          v-if="errorMessage"
          role="alert"
          class="rounded-lg border border-red-200 bg-red-50
                 px-4 py-3 text-sm text-red-600
                 dark:border-red-900 dark:bg-red-950/30
                 dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="successMessage"
          role="status"
          class="rounded-lg border border-green-200 bg-green-50
                 px-4 py-3 text-sm text-green-700
                 dark:border-green-900 dark:bg-green-950/30
                 dark:text-green-400"
        >
          {{ successMessage }}
        </div>

        <!-- User Result -->
        <div
          v-if="user"
          class="rounded-xl border border-gray-200 p-4
                 dark:border-gray-700"
        >
          <p
            class="mb-4 text-xs font-semibold uppercase tracking-wide
                   text-gray-500 dark:text-gray-400"
          >
            User found
          </p>

          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <img
              v-if="user.avatarUrl"
              :src="user.avatarUrl"
              :alt="user.username || user.name || user.email"
              class="h-12 w-12 rounded-full object-cover"
            />

            <div
              v-else
              class="flex h-12 w-12 shrink-0 items-center
                     justify-center rounded-full bg-blue-100
                     text-lg font-semibold text-blue-600
                     dark:bg-blue-900/30 dark:text-blue-400"
            >
              {{
                (user.username || user.name || user.email || "?")
                  .charAt(0)
                  .toUpperCase()
              }}
            </div>

            <!-- User Information -->
            <div class="min-w-0 flex-1">
              <p
                class="truncate font-medium text-gray-800
                       dark:text-white"
              >
                {{ user.username || user.name || "User" }}
              </p>

              <p class="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </p>
            </div>

            <span
              class="shrink-0 rounded-full bg-green-100 px-2.5 py-1
                     text-xs font-medium text-green-700
                     dark:bg-green-900/30 dark:text-green-400"
            >
              Found
            </span>
          </div>

          <!-- Add Button -->
          <button
            type="button"
            class="mt-5 flex w-full items-center justify-center gap-2
                   rounded-lg bg-blue-600 px-4 py-2.5
                   text-sm font-medium text-white transition
                   hover:bg-blue-700
                   disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="adding || !!successMessage"
            @click="addMember"
          >
            <span
              v-if="adding"
              class="h-4 w-4 animate-spin rounded-full border-2
                     border-white/40 border-t-white"
            ></span>

            <template v-if="adding">
              Adding member...
            </template>

            <template v-else-if="successMessage">
              ✓ Member added
            </template>

            <template v-else>
              + Add member
            </template>
          </button>
        </div>

        <!-- Initial State -->
        <div
          v-else-if="!searching && !errorMessage"
          class="rounded-xl border border-dashed border-gray-300
                 px-4 py-8 text-center dark:border-gray-700"
        >
          <div class="text-3xl">👤</div>

          <p class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Search for a user
          </p>

          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the email address of an existing account.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end border-t border-gray-200 bg-gray-50
               px-6 py-4 dark:border-gray-700 dark:bg-gray-900"
      >
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium
                 text-gray-600 transition hover:bg-gray-200
                 disabled:cursor-not-allowed disabled:opacity-50
                 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
