<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <aside
    class="
      flex
      h-screen
      w-64
      flex-col
      border-r
      bg-white
      dark:border-gray-700
      dark:bg-gray-900
    "
  >

    <!-- Logo -->
    <div
      class="
        flex
        h-16
        items-center
        justify-center
        border-b
        dark:border-gray-700
      "
    >
      <h1 class="text-2xl font-bold text-blue-600">
        TaskFlow
      </h1>
    </div>


    <!-- Menu -->
    <nav class="flex-1 space-y-2 px-4 py-6">

      <RouterLink
        to="/"
        class="
          flex
          items-center
          gap-3
          rounded-lg
          px-4
          py-3
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        🏠
        <span>Dashboard</span>
      </RouterLink>


      <RouterLink
        to="/projects"
        class="
          flex
          items-center
          gap-3
          rounded-lg
          px-4
          py-3
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        📁
        <span>Projects</span>
      </RouterLink>


      <RouterLink
        to="/tasks"
        class="
          flex
          items-center
          gap-3
          rounded-lg
          px-4
          py-3
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        ✅
        <span>Tasks</span>
      </RouterLink>


      <RouterLink
        to="/notifications"
        class="
          flex
          items-center
          gap-3
          rounded-lg
          px-4
          py-3
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        🔔
        <span>Notifications</span>
      </RouterLink>


      <RouterLink
        to="/profile"
        class="
          flex
          items-center
          gap-3
          rounded-lg
          px-4
          py-3
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        👤
        <span>Profile</span>
      </RouterLink>

    </nav>


    <!-- Footer -->
    <div class="border-t p-4 dark:border-gray-700">

      <button
        class="
          w-full
          rounded-lg
          bg-red-500
          py-2
          text-white
          transition
          hover:bg-red-600
        "
      >
        Logout
      </button>

    </div>

  </aside>
</template>