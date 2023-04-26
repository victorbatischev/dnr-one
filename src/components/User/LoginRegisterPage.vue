<template>
    <div class="login-register" :class="isLogin ? 'login-register--login' : 'login-register--register'">
        <form class="login-register__form">
            <input class="login-register__input" v-if="!isLogin" v-model="userData.email" type="email" placeholder="почта" name="email" />
            <input class="login-register__input" v-model="userData.username" type="text" placeholder="имя пользователя" name="username" />
            <input class="login-register__input" v-model="userData.password" type="password" placeholder="пароль" name="password" />
            <input
                class="login-register__input"
                v-if="!isLogin"
                v-model="userData.password2"
                type="password"
                placeholder="повторите пароль"
                name="password2"
            />
            <ButtonComp class="login-register__button" :value="buttonLabel" @click="submit()" :disabled="pending" />

            <div class="login-register__redirect">
                {{ redirectText }}
                <router-link class="login-register__redirect-link" v-if="isLogin" to="/user/register" @click="reset()">
                    Регистрация
                </router-link>
                <router-link class="login-register__redirect-link" v-else to="/user/login" @click="reset()">Войти</router-link>
            </div>
        </form>
        <div class="login-register__notifications">
            <TransitionGroup name="login-register__notifications--transition">
                <div
                    class="login-register__notification"
                    v-for="(notification, index) in notifications"
                    :key="notification"
                    :class="`login-register__notification--${notification.type}`"
                >
                    <font-awesome-icon
                        v-if="notification.type === 'success'"
                        class="login-register__notification-icon"
                        :icon="['far', 'circle-check']"
                    />
                    <font-awesome-icon v-else class="login-register__notification-icon" :icon="['far', 'circle-xmark']" />
                    <div class="login-register__notification-info">
                        <div class="login-register__notification-title" v-html="notification.title"></div>
                        <div class="login-register__notification-text" v-html="notification.text"></div>
                    </div>
                    <font-awesome-icon class="login-register__notification-close" icon="xmark" @click="removeNotification(index)" />
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import { FieldsContainer, FieldChecks } from "@/js/validator";
// composables
import { useUserApi } from "@/composables/api/user";
const api = useUserApi();
// stores
import { useUser } from "@/stores";
const userStore = useUser();
// router
import { onBeforeRouteLeave, useRouter } from "vue-router";
const router = useRouter();

const props = defineProps(["type"]);

const userData = ref({
    email: "",
    username: "",
    password: "",
    password2: "",
});

const notifications = ref([]);
const pending = ref(false);

const isLogin = computed(() => props.type === "login");
const buttonLabel = computed(() => (isLogin.value ? "Войти" : "Регистрация"));
const redirectText = computed(() => (isLogin.value ? "Нет аккаунта?" : "Уже есть аккаунт?"));

function submit() {
    notifications.value = [];
    let errors = getFieldsErrors();
    if (errors.length == 0) {
        if (isLogin.value) {
            login();
        } else {
            register();
        }
    } else {
        setTimeout(() => {
            for (let i = 0; i < errors.length; i++) {
                setTimeout(() => {
                    notifications.value.push({ type: "error", title: errors[i].title, text: errors[i].text });
                }, i * 50);
            }
        }, 200);
    }
}

function getFieldsErrors() {
    const container = new FieldsContainer();
    if (!isLogin.value) {
        container.addField("почта", userData.value.email, [FieldChecks.nonEmpty, FieldChecks.email]);
    }
    container.addField("имя пользователя", userData.value.username, [
        FieldChecks.nonEmpty,
        FieldChecks.onlyLettersNumbersUnderscores,
        FieldChecks.minLength(4),
        FieldChecks.maxLength(20),
    ]);
    container.addField("пароль", userData.value.password, [FieldChecks.nonEmpty, FieldChecks.minLength(6), FieldChecks.maxLength(32)]);

    let errors = [];
    for (let key in container.fields) {
        let error = container.fields[key].tryGetFirstError();
        if (error !== "") {
            errors.push({ title: key, text: error });
        }
    }

    if (!isLogin.value) {
        if (userData.value.password !== userData.value.password2) {
            errors.push({ title: "пароль", text: "пароли не совпадают" });
        }
    }
    return errors;
}

async function login() {
    if (pending.value) return;
    pending.value = true;

    let resp = await api.login({ username: userData.value.username, password: userData.value.password });
    if (resp.hasErrors) {
        for (let key in resp.error) {
            notifications.value.push({ type: "error", title: key, text: resp.error[key][0] });
        }
    } else {
        userStore.setUserData(resp.data);
        userStore.saveUserData();

        notifications.value.push({ type: "success", title: "вход", text: "Вход выполнен успешно." });
        redirectAfterTimeout();
    }
    pending.value = false;
}

async function register() {
    if (pending.value) return;
    pending.value = true;

    let resp = await api.register({ email: userData.value.email, username: userData.value.username, password: userData.value.password });
    if (resp.hasErrors) {
        for (let key in resp) {
            notifications.value.push({ type: "error", title: key, text: resp.error[key][0] });
        }
    } else {
        userStore.setUserData(resp.data);
        userStore.saveUserData();

        notifications.value.push({ type: "success", title: "регистрация", text: "Регистрация прошла успешно." });
        redirectAfterTimeout();
    }
    pending.value = false;
}

function reset() {
    userData.value = {
        email: "",
        username: "",
        password: "",
        password2: "",
    };
    notifications.value = [];
}

function removeNotification(index) {
    notifications.value.splice(index, 1);
}

function redirectAfterTimeout() {
    setTimeout(() => {
        router.push("/");
    }, 1000);
}

onBeforeRouteLeave(() => {
    reset();
});
</script>

<style lang="scss">
.login-register {
    $p: &;

    width: 240px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 25px;
    color: color("second");

    &__form {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 50vh;
        gap: 5px;
    }

    &__input {
        @include grey-input;
    }

    &__button {
    }

    &__redirect {
        display: flex;
        justify-content: center;

        &-link {
            margin-left: 5px;
            color: color("second");
        }
    }

    &__notifications {
        margin-top: 5px;

        &--transition {
            &-enter-active,
            &-leave-active {
                transition: all 0.18s ease;
            }
            &-enter-from {
                opacity: 0;
                margin-top: 10px;
            }
            &-leave-to {
                opacity: 0;
            }
        }
    }

    &__notification {
        $p: &;

        position: relative;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 5px;
        margin-bottom: 3px;
        border: 1px solid color("border");

        &-icon {
            width: 25px;
            height: auto;
            display: block;
        }

        &-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 3px;
            height: 100%;
        }

        &-title {
            font-size: 15px;
            line-height: 13px;
        }

        &-text {
            font-size: 13px;
            line-height: 15px;
        }

        &-close {
            cursor: pointer;
            height: 100%;
            width: 10px;
        }

        &--error {
            #{$p}-icon {
                color: color("warn");
            }
        }

        &--success {
            #{$p}-icon {
                color: color("success");
            }
        }
    }

    &--login {
        #{$p}__input--email {
            display: none;
        }
    }
}
</style>
