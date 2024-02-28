import { defineStore } from "pinia";
import axios from "axios";
import type { User, LoginPayload, RegisterPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const login = async (payload: LoginPayload): Promise<void> => {
    await axios.post("/login", payload);
    await initUser();
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    await axios.post("/register", payload);
    await initUser();
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post("/logout");
      user.value = null;
      isAuthenticated.value = false;
    } catch (error) {
      throw new Error("Logout failed. Please try again.");
    } finally {
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
