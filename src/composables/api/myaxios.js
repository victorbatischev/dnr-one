import { useUser } from "@/stores";
import { useRouter } from "vue-router";
import axios from "axios";

export default async (path, config = {}) => {
    let root = process.env.NODE_ENV === "production" ? "https://front.dnr.one" : "https://front.dnr.one";
    const userStore = useUser();
    const router = useRouter();

    if (validateToken()) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${userStore.access_token}`;
    }
    config.timeout = config.timeout || 3000;
    config.validateStatus = false;

    let tries = 0;
    while (tries < 3) {
        try {
            let response = await axios(`${root}/api/${path}`, config);
            if (response.status === 500) {
                throw new Error(response.status);
            }
            if (response.status === 401) {
                userStore.logout();
            }
            if (response.data) {
                return response.data;
            }
        } catch (e) {
            console.log(path, e.message);
            router?.push("/page404");
        }
        tries++;
    }
    return null;
};

function validateToken() {
    const userStore = useUser();

    if (userStore.access_token) {
        if (Date.parse(userStore.access_token_expired_at) < Date.now()) {
            userStore.logout();
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
