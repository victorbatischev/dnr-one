<template>
    <div class="pre-header">
        <div class="pre-header__container">
            <div class="pre-header__weather">
                <Weather />
            </div>
            <h2 class="pre-header__title">{{ title }}</h2>
            <div class="pre-header__user">
                <router-link class="pre-header__user-link" to="/user">
                    <div class="pre-header__user-name">{{ userText }}</div>
                    <font-awesome-icon class="pre-header__user-icon" icon="user" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<script setup>
import Weather from "@/components/Weather.vue";
import { useUser } from "@/stores";
import { useUserVariables } from "@/composables/user";
import { computed } from "vue";

const userStore = useUser();

const { userText } = useUserVariables();

const title = computed(() => this.$route.meta.title);
</script>

<style lang="scss">
.pre-header {
    &__container {
        position: relative;
        display: flex;
        height: 45px;
        justify-content: center;
        align-items: center;

        color: #6c6c6c;
        font-size: 11px;
        text-transform: uppercase;
        border-bottom: 2px solid #e5e5e5;
    }

    &__title {
        color: #6c6c6c;
        font-size: 20px;
        font-weight: 700;
        line-height: 1;
    }

    &__user {
        position: absolute;
        right: 0;

        &-link {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
        }

        &-name {
            margin-right: 3px;
        }

        &-icon {
            height: 20px;
            width: 25px;
            margin-right: 3px;
        }
    }

    &__weather {
        position: absolute;
        left: 0;
        height: 100%;
    }
}
</style>
