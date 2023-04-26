import myaxios from "@/composables/api/myaxios";

export const useUserApi = () => {
    async function register(data) {
        let path = "user/create";

        let config = {
            method: "post",
            data: data,
        };

        let response = await myaxios(path, config);
        return response;
    }

    async function login(data) {
        let path = `user/login?username=${data.username}&password=${data.password}`;

        let response = await myaxios(path);
        return response;
    }

    return { register, login };
};
