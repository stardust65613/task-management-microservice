<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "@/components/layout/AppSidebar.vue";
import Header from "@/components/layout/AppHeader.vue";

const showSidebar = ref(true);
const dark = ref(false);


function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}


function toggleDarkMode() {
  dark.value = !dark.value;

  if (dark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}


onMounted(() => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    dark.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>


<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900">

    <!-- Sidebar -->
    <div
      class="overflow-hidden transition-all duration-300"
      :class="showSidebar ? 'w-64' : 'w-0'"
    >
      <Sidebar />
    </div>


    <!-- Right content -->
    <div class="flex-1">

      <!-- Header luôn nằm trên -->
      <Header />


      <!-- Toolbar -->
      <div class="flex items-center gap-2 p-4">

        <!-- Sidebar toggle -->
        <button
          @click="toggleSidebar"
          class="
            rounded-lg
            bg-gray-200
            px-3
            py-2
            hover:bg-gray-300
            dark:bg-gray-700
            dark:hover:bg-gray-600
            dark:text-white
          "
        >
          ☰
        </button>


        <!-- Dark mode -->
        <button
          @click="toggleDarkMode"
          class="
            rounded-lg
            bg-gray-200
            px-3
            py-2
            hover:bg-gray-300
            dark:bg-gray-700
            dark:hover:bg-gray-600
            dark:text-white
          "
        >
          {{ dark ? "☀️" : "🌙" }}
        </button>

      </div>


      <!-- Page content -->
      <main class="p-6">
        <RouterView />
      </main>

    </div>

  </div>
</template>