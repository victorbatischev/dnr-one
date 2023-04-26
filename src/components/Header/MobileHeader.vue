<template>
    <div class="mobile-header">
        <div class="mobile-header__container">
            <div class="mobile-header__part mobile-header__part--left">
                <div class="mobile-header__button mobile-header__button--menu" @click="openMobileMenu()">
                    <font-awesome-icon class="mobile-header__button-icon" icon="bars" />
                </div>

                <div class="mobile-header__weather">
                    <WeatherComp />
                </div>
            </div>

            <HeaderLogo class="mobile-header__logo-image" @click="resetMainPage()" />

            <div class="mobile-header__part mobile-header__part--right">
                <div class="mobile-header__user" :class="{ 'mobile-header__user--opened': userMenuOpened }" v-click-outside="closeUserMenu">
                    <div class="mobile-header__user-main" @click="toggleUserMenu()">
                        <font-awesome-icon class="mobile-header__user-caret" icon="caret-down" v-show="userStore.loggedIn" />
                        <div class="mobile-header__user-name">{{ userText }}</div>
                        <font-awesome-icon class="mobile-header__user-icon" icon="user" />
                    </div>

                    <Transition name="mobile-header__user-dropdown--transition">
                        <div class="mobile-header__user-dropdown" v-if="userMenuOpened">
                            <div
                                class="mobile-header__user-link"
                                v-for="button in userButtons"
                                :key="button"
                                @click="
                                    button.action();
                                    closeUserMenu();
                                "
                            >
                                {{ button.text }}
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mobile-header__button mobile-header__button--search" v-if="$route.name === 'News'" @click="openSearchWindow()">
                    <font-awesome-icon class="mobile-header__button-icon" icon="magnifying-glass" />
                </div>

                <div class="mobile-header__button mobile-header__button--sidebar" v-if="$route.name === 'News'" @click="openSidebar()">
                    <font-awesome-icon class="mobile-header__button-icon" icon="filter" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
// components
import WeatherComp from "@/components/Common/WeatherComp.vue";
import HeaderLogo from "@/components/Header/HeaderLogo.vue";
// directives
import vClickOutside from "@/directives/ClickOutside";
// composables
import { useUserVariables } from "@/composables/user";
const { userText, userButtons } = useUserVariables();
// stores
import { useUi, useNews, useUser } from "@/stores";
const uiStore = useUi();
const newsStore = useNews();
const userStore = useUser();
// router
import { useRouter } from "vue-router";
const router = useRouter();

const userMenuOpened = ref(false);

function toggleUserMenu() {
    if (userMenuOpened.value) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function openUserMenu() {
    if (userStore.loggedIn) {
        userMenuOpened.value = true;
    } else {
        router.push("/user/login");
    }
}

function closeUserMenu() {
    userMenuOpened.value = false;
}

function openSidebar() {
    uiStore.openSidebar();
}

function openMobileMenu() {
    uiStore.openMobileMenu();
}

function openSearchWindow() {
    uiStore.openSearchWindow();
}

function resetMainPage() {
    newsStore.resetFilters();
    nextTick(() => router.push("/"));
}
</script>

<style lang="scss">
.mobile-header {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid color("border");

    &__container {
        display: flex;
        position: relative;

        height: 100%;
        padding: 0 10px;
        justify-content: center;
        align-items: center;

        color: color("second");
        font-size: 11px;
        text-transform: uppercase;
    }

    &__part {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;

        &--right {
            justify-content: flex-end;
        }
    }

    &__weather {
        @media (max-width: $mobileWidth) {
            display: none;
        }
    }

    &__logo {
        cursor: pointer;
    }

    &__logo-image {
        cursor: pointer;
        display: block;
    }

    &__user {
        $user: &;

        position: relative;
        transition: color 0.18s ease;

        @media (max-width: $mobileWidth) {
            display: none;
        }

        &-main {
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        &-caret {
            height: 15px;
            width: 15px;
            margin-right: 3px;
            transition: transform 0.18s ease;
        }

        &-dropdown {
            position: absolute;
            display: flex;
            flex-direction: column;
            top: calc(100% + (48px - 100%) / 2);
            right: 0;
            border: 1px solid color("second");
            background: color("background", $alpha: -0.1);

            &--transition {
                &-enter-active,
                &-leave-active {
                    transition: opacity 0.1s ease;
                }
                &-enter-from,
                &-leave-to {
                    opacity: 0;
                }
            }
        }

        &-link {
            cursor: pointer;
            padding: 10px 15px;
            font-size: 14px;
            line-height: 14px;
            color: color("second");

            transition: background-color 0.18s ease;

            &:hover {
                background: color("background-hover");
            }
        }

        &-name {
            margin-right: 3px;
        }

        &-icon {
            height: 24px;
            width: 24px;
            margin-right: 3px;
        }

        &:hover {
            color: color("second-hover");
        }

        &--opened {
            #{$user}-caret {
                transform: rotate(180deg);
            }
        }
    }

    &__button {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    &__button-icon {
        width: 100%;
        height: 100%;
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }

    &__underline {
        border-color: #e5e5e5;
    }
}

.body--mm-opened {
    .mobile-header {
        left: 440px;
    }
}
</style>
