import router from "@/router";
import { useUser } from "@/stores";
import { computed } from "vue";

export const useUserVariables = () => {
    const userStore = useUser();

    const userText = computed(() => {
        return userStore.username === "" ? "Войти" : userStore.username;
    });

    const userButtons = computed(() => {
        let buttons = [];
        if (userStore.loggedIn) {
            buttons.push({
                text: "Профиль",
                action: () => {
                    router.push("/user");
                },
            });
            buttons.push({
                text: "Выйти",
                action: () => {
                    userStore.logout();
                    router.go();
                },
            });
        } else {
            buttons.push({
                text: "Войти",
                action: () => {
                    router.push("/user/login");
                },
            });
            buttons.push({
                text: "Регистрация",
                action: () => {
                    router.push("/user/register");
                },
            });
        }

        return buttons;
    });

    return { userText, userButtons };
};
