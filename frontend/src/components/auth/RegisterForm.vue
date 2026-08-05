<script setup>
import { ref } from "vue";
import AuthInput from "./AuthInput.vue";
import AuthButton from "./AuthButton.vue";
import { register } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  console.log(form.value);
  console.log("REGISTER CLICK");

  try { 
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
    <h1 class="mb-2 text-center text-3xl font-bold">
      Create Account
    </h1>

    <p class="mb-8 text-center text-gray-500">
      Register to continue
    </p>

    <form class="space-y-5" @submit.prevent="handleRegister">
      <AuthInput
        v-model="form.username"
        label="Username"
        type="text"
        placeholder="Enter your username"
      />

      <AuthInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <AuthInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      <AuthInput
        v-model="form.confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
      />

      <AuthButton>
        Register
      </AuthButton>

      <p class="text-center text-sm text-gray-600">
        Already have an account?

        <RouterLink
          to="/auth/login"
          class="font-medium text-blue-600 hover:underline"
        >
          Login
        </RouterLink>
      </p>
    </form>
  </div>
</template>