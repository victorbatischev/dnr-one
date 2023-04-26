import { defineStore } from "pinia";

export default defineStore("user", {
    state: () => {
        return {
            loggedIn: false,
            id: -1,
            username: "",
            email: "",
            access_token: "",
            access_token_expired_at: "",
        };
    },
    actions: {
        setUserData(data) {
            this.id = data.id;
            this.username = data.username;
            this.email = data.email;
            this.access_token = data.access_token;
            this.access_token_expired_at = data.access_token_expired_at;
            this.loggedIn = !!data.username;
        },

        logout() {
            this.$reset();
            this.saveUserData();
        },

        saveUserData() {
            localStorage.setItem("user", JSON.stringify(this.$state));
        },

        loadUserData() {
            let data = localStorage.getItem("user");
            if (data != null) {
                this.setUserData(JSON.parse(data));
            }
        },
    },
});
