<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();

onMounted( async () => {
  await Promise.all([
    projectStore.getProjects(),
    projectStore.getCollabProjects(userStore.user.id),
  ]);
});

function openProject(id) {
  router.push(`/projects/${id}`);
}
</script>
<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-800 dark:text-white">
          My projects
        </h1>
      </div>

      <button
        type="button"
        class="
          rounded-lg
          bg-blue-600
          px-4
          py-2
          font-medium
          text-white
          transition
          hover:bg-blue-700
        "
        @click="router.push('/projects/create')"
      >
        + New Project
      </button>
    </div>


    <!-- Loading -->
    <div
      v-if="projectStore.loading"
      class="flex justify-center py-12"
    >
      <div
        class="
          h-8
          w-8
          animate-spin
          rounded-full
          border-4
          border-gray-300
          border-t-blue-600
        "
      ></div>
    </div>


    <!-- Empty -->
    <div
      v-else-if="projectStore.projects.length === 0"
      class="
        rounded-xl
        border
        border-dashed
        border-gray-300
        bg-white
        p-12
        text-center
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      <div class="text-4xl">
        📁
      </div>

      <h2 class="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
        No projects yet
      </h2>

      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Create your first project to get started.
      </p>

      <button
        type="button"
        class="
          mt-6
          rounded-lg
          bg-blue-600
          px-4
          py-2
          font-medium
          text-white
          hover:bg-blue-700
        "
        @click="router.push('/projects/create')"
      >
        Create Project
      </button>
    </div>


    <!-- My Project List -->
    <div
      v-else
      class="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="
          cursor-pointer
          rounded-xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          transition
          hover:-translate-y-1
          hover:shadow-md
          dark:border-gray-700
          dark:bg-gray-900
        "
        @click="openProject(project.id)"
      >

        <!-- Project Icon -->
        <div
          class="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-lg
            bg-blue-100
            text-2xl
            dark:bg-blue-900/30
          "
        >
          📁
        </div>


        <!-- Project Information -->
        <div class="mt-4">
          <h2
            class="
              truncate
              text-lg
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            {{ project.name }}
          </h2>

          <p
            class="
              mt-2
              line-clamp-2
              min-h-10
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {{ project.description || "No description" }}
          </p>
        </div>


        <!-- Footer -->
        <div
          class="
            mt-5
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            pt-4
            dark:border-gray-700
          "
        >
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{
              project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : ""
            }}
          </span>

          <span
            class="
              rounded-full
              bg-blue-50
              px-2.5
              py-1
              text-xs
              font-medium
              text-blue-600
              dark:bg-blue-900/30
              dark:text-blue-400
            "
          >
            Project
          </span>
        </div>

      </div>
    </div>


    <!-- Shared Projects -->
    <div class="mt-10">

      <!-- Section Header -->
      <div class="mb-4">
        <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
          Shared with me
        </h2>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          Projects you collaborate on
        </p>
      </div>


      <!-- Empty Shared Projects -->
      <div
        v-if="projectStore.collabProjects.length === 0"
        class="
          rounded-xl
          border
          border-dashed
          border-gray-300
          p-8
          text-center
          dark:border-gray-700
        "
      >
        <p class="text-gray-500 dark:text-gray-400">
          No shared projects
        </p>
      </div>


      <!-- Shared Project List -->
      <div
        v-else
        class="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        <div
          v-for="project in projectStore.collabProjects"
          :key="project.id"
          class="
            cursor-pointer
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
            dark:border-gray-700
            dark:bg-gray-900
          "
          @click="openProject(project.id)"
        >

          <!-- Shared Project Icon -->
          <div
            class="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-lg
              bg-purple-100
              text-2xl
              dark:bg-purple-900/30
            "
          >
            👥
          </div>


          <!-- Project Information -->
          <h2
            class="
              mt-4
              text-lg
              font-semibold
              text-gray-800
              dark:text-white
            "
          >
            {{ project.name }}
          </h2>

          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ project.description || "No description" }}
          </p>

        </div>
      </div>

    </div>

  </div>
</template>