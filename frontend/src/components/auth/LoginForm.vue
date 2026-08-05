<script setup>
import { ref } from "vue";
import AuthInput from "./AuthInput.vue";
import AuthButton from "./AuthButton.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  console.log({
    email: email.value,
    password: password.value,
  });

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    });

    router.push("/");

  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

    <h1 class="mb-8 text-center text-3xl font-bold">
      Sign In
    </h1>

    <form
      class="space-y-5"
      @submit.prevent="handleLogin"
    >

      <AuthInput
        v-model="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
      />

      <AuthInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
      />

      <AuthButton>
        Login
      </AuthButton>

      <p class="text-center text-sm text-gray-600">
        Don't have an account?

        <RouterLink
          to="/auth/register"
          class="font-medium text-blue-600 hover:underline"
        >
          Register
        </RouterLink>
      </p>

    </form>

  </div>
</template>