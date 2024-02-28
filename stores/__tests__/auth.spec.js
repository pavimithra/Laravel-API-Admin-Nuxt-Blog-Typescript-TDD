// stores/counter.spec.ts
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

describe("Auth Store", () => {
  beforeEach(() => {
    useAuthStore.user = null;
    useAuthStore.isAuthenticated = false;
    useAuthStore.loading = false;
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Logs in User successfully and Sets isAuthenticated is true", async () => {
    const authStore = useAuthStore();

    // login test data
    const testLoginPayload = { username: "testUser", password: "testPassword" };

    vi.spyOn(axios, "post").mockResolvedValueOnce();

    // Call login function
    await authStore.login(testLoginPayload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/login", testLoginPayload);
    expect(authStore.isAuthenticated).toBe(true);
  });

  test("handles login error properly", async () => {
    const authStore = useAuthStore();

    const testLoginPayload = { username: "testUser", password: "testPassword" };

    // Mock axios.post to reject
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("Login error"));

    // Call login function
    await expect(authStore.login(testLoginPayload)).rejects.toThrow(
      "Login error"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/login", testLoginPayload);
    // Assert that isAuthenticated is still false
    expect(authStore.isAuthenticated).toBe(false);
  });

  test("Register a User and Sets isAuthenticated is true", async () => {
    const authStore = useAuthStore();

    const testRegisterPayload = {
      username: "testUser",
      password: "testPassword",
    };

    // Mock axios.post to resolve
    vi.spyOn(axios, "post").mockResolvedValueOnce();

    // Call register function
    await authStore.register(testRegisterPayload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/register", testRegisterPayload);
    expect(authStore.isAuthenticated).toBe(true);
  });

  test("handles Register error properly", async () => {
    const authStore = useAuthStore();

    const testRegisterPayload = {
      username: "testUser",
      password: "testPassword",
    };
    // Mock axios.post to reject
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("Register error"));

    // Call login function
    await expect(authStore.register(testRegisterPayload)).rejects.toThrow(
      "Register error"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/register", testRegisterPayload);
    // Assert that isAuthenticated is still false
    expect(authStore.isAuthenticated).toBe(false);
  });

  test("Logs out the User successfully", async () => {
    const authStore = useAuthStore();

    // Mock axios.post to reject
    vi.spyOn(axios, "post").mockResolvedValueOnce();

    await authStore.logout();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/logout");
    // Assert that isAuthenticated is still false
    expect(authStore.isAuthenticated).toBe(false);
  });

  test("User fetched successfully", async () => {
    const authStore = useAuthStore();
    const userData = {
      id: 1,
      username: "testUser",
      email: "testuser@gmail.com",
    };
    vi.spyOn(axios, "get").mockResolvedValueOnce({ data: userData });

    const user = await authStore.initUser();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/user");
    expect(authStore.user).toEqual(userData);
    expect(authStore.isAuthenticated).toBe(true);
  });

  test("User fetch failed", async () => {
    const authStore = useAuthStore();
    const errorMessage = "Error fetching user";
    vi.spyOn(axios, "get").mockRejectedValueOnce(new Error(errorMessage));

    const user = await authStore.initUser();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/user");
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });
});
