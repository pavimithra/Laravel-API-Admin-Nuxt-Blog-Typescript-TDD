import axios from "axios";
import type { User, LoginPayload, RegisterPayload } from "@/types";

const user = ref<User | null>(null);

export const useAuth = () => {

    const router = useRouter()

    const getUser = async (): Promise<User | null> => {
        if (user.value) return user.value;
        try {
            const res = await axios.get("/api/user");
            return res.data;
        } catch (err) {
            return null;
        }
    }

    const initUser = async () => {
        user.value = await getUser();
    }

    const register = async (payload: RegisterPayload) => {
        await axios.post("/register", payload);
        router.push("/admin");
    }

    const login = async (payload: LoginPayload) => {
        await axios.post("/login", payload);
        const route = useRoute()
        const redirectPath: string = route.redirectedFrom?.fullPath ? `${route.redirectedFrom?.fullPath}` : "/admin";
        router.push(redirectPath);
    }

    const logout = async () => {
        await axios.post("/logout");
        user.value = null;
        router.replace("/admin/login");
    }

    return { register, login, logout, initUser, user };
};
