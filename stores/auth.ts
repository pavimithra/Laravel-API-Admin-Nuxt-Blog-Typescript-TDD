import { defineStore } from "pinia";
import axios from "axios";
import type { User, LoginPayload, RegisterPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const login = async (payload: LoginPayload): Promise<void> => {
    loading.value = true;
    await axios.post("/login", payload);
    await initUser();
    const route = useRoute();
    const redirectPath: string = route.redirectedFrom?.fullPath
      ? `${route.redirectedFrom?.fullPath}`
      : "/admin";
    await navigateTo(redirectPath);
    loading.value = false;
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    loading.value = true;
    await axios.post("/register", payload);
    await initUser();
    await navigateTo("/admin");
    loading.value = false;
  };

  const logout = async (): Promise<void> => {
    loading.value = true;
    try {
      await axios.post("/logout");
      user.value = null;
      isAuthenticated.value = false;
    } catch (error) {
      throw new Error("Logout failed. Please try again.");
    } finally {
      loading.value = false;
      await navigateTo("/admin/login", {
        replace: true,
      });
    }
  };

  const fetchUser = async (): Promise<User | null> => {
    try {
      const { data } = await axios.get("/user");
      return data;
    } catch (err) {
      return null;
    }
  };

  const initUser = async (): Promise<void> => {
    loading.value = true;
    try {
      const userData = await fetchUser();
      if (userData) {
        user.value = userData;
        isAuthenticated.value = true;
      } else {
        isAuthenticated.value = false;
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      user.value = null;
      isAuthenticated.value = false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    initUser,
  };
});
