<script setup>

</script>

<template>
  <div class="space-y-8">

    <!-- Title -->
    <div>
      <h1 class="text-3xl font-bold text-gray-800">
        Dashboard
      </h1>

      <p class="mt-1 text-gray-500">
        Welcome back! Here's an overview of your workspace.
      </p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div class="rounded-xl bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-gray-500 dark:text-gray-400">Projects</h2>

        <p class="mt-3 text-3xl font-bold text-blue-600">
          8
        </p>
      </div>

      <div class="rounded-xl bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-gray-500 dark:text-gray-400">Tasks</h2>

        <p class="mt-3 text-3xl font-bold text-green-600">
          56
        </p>
      </div>

      <div class="rounded-xl bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-gray-500 dark:text-gray-400">In Progress</h2>

        <p class="mt-3 text-3xl font-bold text-yellow-500">
          12
        </p>
      </div>

      <div class="rounded-xl bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-gray-500 dark:text-gray-400">Completed</h2>

        <p class="mt-3 text-3xl font-bold text-purple-600">
          44
        </p>
      </div>

    </div>

    <!-- Recent Tasks -->
    <div class="rounded-xl bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">

      <h2 class="mb-5 text-xl font-semibold dark:text-gray-100">
        Recent Tasks
      </h2>

      <div class="divide-y">

        <div class="flex items-center justify-between py-4 dark:text-gray-100">
          <div>
            <p class="font-medium">
              Design Login Page
            </p>

            <p class="text-sm text-gray-500 text-gray-400">
              Project: Task Management
            </p>
          </div>

          <span
            class="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700"
          >
            In Progress
          </span>
        </div>

        <div class="flex items-center justify-between py-4 dark:text-gray-100">
          <div> 
            <p class="font-medium">
              Create Notification Service
            </p>

            <p class="text-sm text-gray-500 text-gray-400">
              Project: Backend
            </p>
          </div>

          <span
            class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
          >
            Done
          </span>
        </div>

        <div class="flex items-center justify-between py-4 dark:text-gray-100">
          <div>
            <p class="font-medium">
              Upload File Feature
            </p>

            <p class="text-sm text-gray-500 text-gray-400">
              Project: File Service
            </p>
          </div>

          <span
            class="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
          >
            Todo
          </span>
        </div>

      </div>

    </div>

  </div>
</template>