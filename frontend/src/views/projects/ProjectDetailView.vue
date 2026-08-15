<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";
import TaskList from "@/components/task/TaskList.vue";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const loading = ref(true);
const error = ref("");

const project = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = "";

    project.value = await projectStore.getProject(route.params.id);

    await projectStore.getMembers(route.params.id);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Failed to load project";
  } finally {
    loading.value = false;
  }
});


function goBack() {
  router.push("/projects");
}


function editProject() {
  router.push(`/projects/${route.params.id}/edit`);
}


function projectSettings() {
  router.push(`/projects/${route.params.id}/settings`);
}


function addMember() {
  // TODO: open Add Member modal
}


function memberMenu(member) {
  // TODO: open member menu
}


function createTask() {
  router.push(`/projects/${route.params.id}/tasks/create`);
}
</script>


<template>
  <div class="space-y-6">

    <!-- Back -->
    <button
      type="button"
      class="
        flex
        items-center
        gap-2
        text-sm
        text-gray-500
        transition
        hover:text-blue-600
        dark:text-gray-400
        dark:hover:text-blue-400
      "
      @click="goBack"
    >
      ← Back to projects
    </button>


    <!-- Loading -->
    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <div
        class="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-gray-300
          border-t-blue-600
        "
      ></div>
    </div>


    <!-- Error -->
    <div
      v-else-if="error"
      class="
        rounded-xl
        border
        border-red-200
        bg-red-50
        p-6
        text-center
        text-red-600
        dark:border-red-900
        dark:bg-red-950/30
        dark:text-red-400
      "
    >
      {{ error }}
    </div>


    <!-- Project -->
    <template v-else-if="project">

      <!-- Project Header -->
      <section
        class="
          flex
          flex-col
          gap-4
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <!-- Project info -->
        <div class="flex items-center gap-4">

          <!-- Icon -->
          <div
            class="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-3xl
              dark:bg-blue-900/30
            "
          >
            📁
          </div>


          <!-- Name -->
          <div>
            <h1
              class="
                text-2xl
                font-bold
                text-gray-800
                dark:text-white
              "
            >
              {{ project.name }}
            </h1>

            <p
              class="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {{ project.description || "No description" }}
            </p>
          </div>

        </div>


        <!-- Actions -->
        <div class="flex gap-2">
            <!-- Edit -->
          <button
            type="button"
            class="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
            @click="editProject"
          >
            Edit
          </button>

          <!-- Settings -->
          <button
            type="button"
            class="
              rounded-lg
              border
              border-gray-300
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              dark:border-gray-600
              dark:text-gray-200
              dark:hover:bg-gray-800
            "
            @click="projectSettings"
          >
            ⚙ Settings
          </button>

        </div>

      </section>


      <!-- Project Information -->
      <section
        class="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
        "
      >

        <h2
          class="
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
        >
          Project information
        </h2>


        <div
          class="
            mt-6
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <!-- Status -->
          <div>
            <p
              class="
                text-xs
                font-medium
                uppercase
                text-gray-500
                dark:text-gray-400
              "
            >
              Status
            </p>

            <span
              class="
                mt-2
                inline-flex
                rounded-full
                bg-green-100
                px-3
                py-1
                text-sm
                font-medium
                text-green-700
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              {{ project.status }}
            </span>
          </div>


          <!-- Visibility -->
          <div>
            <p
              class="
                text-xs
                font-medium
                uppercase
                text-gray-500
                dark:text-gray-400
              "
            >
              Visibility
            </p>

            <span
              class="
                mt-2
                inline-flex
                rounded-full
                bg-blue-100
                px-3
                py-1
                text-sm
                font-medium
                text-blue-700
                dark:bg-blue-900/30
                dark:text-blue-400
              "
            >
              {{ project.visibility }}
            </span>
          </div>


          <!-- Created -->
          <div>
            <p
              class="
                text-xs
                font-medium
                uppercase
                text-gray-500
                dark:text-gray-400
              "
            >
              Created
            </p>

            <p
              class="
                mt-2
                text-sm
                text-gray-700
                dark:text-gray-300
              "
            >
              {{
                project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "-"
              }}
            </p>
          </div>


          <!-- Updated -->
          <div>
            <p
              class="
                text-xs
                font-medium
                uppercase
                text-gray-500
                dark:text-gray-400
              "
            >
              Last updated
            </p>

            <p
              class="
                mt-2
                text-sm
                text-gray-700
                dark:text-gray-300
              "
            >
              {{
                project.updatedAt
                  ? new Date(project.updatedAt).toLocaleDateString()
                  : "-"
              }}
            </p>
          </div>

        </div>

      </section>


      <!-- Members -->
      <section
        class="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
        "
      >

        <!-- Header -->
        <div
          class="
            flex
            items-center
            justify-between
          "
        >

          <div>
            <h2
              class="
                text-xl
                font-semibold
                text-gray-800
                dark:text-white
              "
            >
              Members
            </h2>

            <p
              class="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              People collaborating on this project
            </p>
          </div>


          <div class="flex items-center gap-3">

            <!-- Count -->
            <span
              class="
                rounded-full
                bg-gray-100
                px-2.5
                py-1
                text-xs
                font-medium
                text-gray-600
                dark:bg-gray-800
                dark:text-gray-400
              "
            >
              {{ projectStore.members?.length || 0 }}
            </span>


            <!-- Add member -->
            <button
              type="button"
              class="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
              @click="addMember"
            >
              + Add Member
            </button>

          </div>

        </div>


        <!-- No members -->
        <div
          v-if="!projectStore.members?.length"
          class="
            mt-6
            rounded-lg
            border
            border-dashed
            border-gray-300
            p-8
            text-center
            dark:border-gray-700
          "
        >
          <div class="text-3xl">
            👥
          </div>

          <p
            class="
              mt-3
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            No members in this project
          </p>
        </div>


        <!-- Member list -->
        <div
          v-else
          class="
            mt-5
            divide-y
            divide-gray-200
            dark:divide-gray-700
          "
        >

          <div
            v-for="member in projectStore.members"
            :key="member.id"
            class="
              flex
              items-center
              justify-between
              py-4
            "
          >

            <!-- User -->
            <div class="flex min-w-0 items-center gap-3">

              <!-- Avatar -->
              <div
                class="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                  text-sm
                  font-medium
                  text-blue-600
                  dark:bg-blue-900/30
                  dark:text-blue-400
                "
              >
                👤
              </div>


              <div class="min-w-0">

                <p
                  class="
                    truncate
                    text-sm
                    font-medium
                    text-gray-800
                    dark:text-white
                  "
                >
                  {{ member.user.username }}
                </p>

                <p
                  class="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Joined
                  {{
                    member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString()
                      : "-"
                  }}
                </p>

              </div>

            </div>


            <!-- Role + menu -->
            <div class="flex items-center gap-3">

              <!-- Role -->
              <span
                class="
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-blue-600
                  dark:bg-blue-900/30
                  dark:text-blue-400
                "
              >
                {{ member.role }}
              </span>


              <!-- Menu -->
              <button
                type="button"
                class="
                  rounded-lg
                  px-2
                  py-1
                  text-lg
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-700
                  dark:text-gray-400
                  dark:hover:bg-gray-800
                "
                @click="memberMenu(member)"
              >
                ⋮
              </button>

            </div>

          </div>

        </div>

      </section>


      <!-- Tasks -->
      <section
        class="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
        "
      >

        <!-- Header -->
        <div
          class="
            mb-5
            flex
            items-center
            justify-between
          "
        >

          <div>
            <h2
              class="
                text-xl
                font-semibold
                text-gray-800
                dark:text-white
              "
            >
              Tasks
            </h2>

            <p
              class="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Tasks in this project
            </p>
          </div>


          <!-- New task -->
          <button
            type="button"
            class="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
            @click="createTask"
          >
            + New Task
          </button>

        </div>


        <!-- Task list -->
        <TaskList
          :project-id="route.params.id"
        />

      </section>

    </template>

  </div>
</template>