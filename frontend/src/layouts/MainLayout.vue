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
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

    <!-- Sidebar -->
    <div
      class="overflow-hidden transition-all duration-300"
      :class="showSidebar ? 'w-64' : 'w-0'"
    >
      <Sidebar />
    </div>


    <!-- Right content -->
    <div class="flex min-w-0 flex-1 flex-col">

      <!-- Header luôn nằm trên -->
      <Header 
        :dark="dark"
        @toggle-sidebar="toggleSidebar"
        @toggle-dark="toggleDarkMode"
      />

      <!-- Page content -->
      <main class="content-scroll flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>

    </div>

  </div>
</template>