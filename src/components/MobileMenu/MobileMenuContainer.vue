<template>
    <div class="mobile-menu" :class="uiStore.mobileMenuOpened ? 'mobile-menu--opened' : ''">
        <div class="mobile-menu__closer" @click="close"></div>
        <div class="mobile-menu__container">
            <div class="mobile-menu__main">
                <div class="mobile-menu__user" v-click-outside="closeUserMenu" :class="{ 'mobile-menu__user--opened': userMenuOpened }">
                    <div class="mobile-menu__user-main" @click="tryToggleUserMenu()">
                        <font-awesome-icon class="mobile-menu__user-icon" icon="user" />
                        <div class="mobile-menu__user-name">{{ userText }}</div>
                        <font-awesome-icon class="mobile-menu__user-caret" icon="caret-down" v-show="userStore.loggedIn" />
                    </div>

                    <Transition name="mobile-menu__user-dropdown--transition">
                        <div class="mobile-menu__user-dropdown" v-if="userMenuOpened" :style="`--height: ${userButtons.length * 41 + 1}px`">
                            <div
                                class="mobile-menu__user-link"
                                v-for="button in userButtons"
                                :key="button"
                                @click="
                                    button.action();
                                    closeUserMenu();
                                    close();
                                "
                            >
                                {{ button.text }}
                            </div>
                        </div>
                    </Transition>
                </div>

                <ul class="mobile-menu__links" @click="close">
                    <li v-for="category in newsStore.categories" :key="category">
                        <router-link class="mobile-menu__link" :to="`/?category=${category.id}`" @click.prevent="setCategory(category.id)">
                            {{ category.title }}
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="mobile-menu__bottom">
                <ThemeComp class="mobile-menu__theme-switcher" />
                <WeatherComp class="mobile-menu__weather" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
// stores
import { useUi, useUser, useNews } from "@/stores";
const userStore = useUser();
const uiStore = useUi();
const newsStore = useNews();
// router
import { useRouter } from "vue-router";
const router = useRouter();
// components
import WeatherComp from "@/components/Common/WeatherComp.vue";
import ThemeComp from "@/components/Common/ThemeComp.vue";
// directives
import vClickOutside from "@/directives/ClickOutside";
// composables
import { useUserVariables } from "@/composables/user";
const { userText, userButtons } = useUserVariables();

const userMenuOpened = ref(false);

function close() {
    uiStore.closeMobileMenu();
}

function tryToggleUserMenu() {
    if (userStore.loggedIn) {
        if (userMenuOpened.value) {
            closeUserMenu();
        } else {
            openUserMenu();
        }
    } else {
        close();
        router.push("/user/login");
    }
}

function openUserMenu() {
    userMenuOpened.value = true;
}

function closeUserMenu() {
    userMenuOpened.value = false;
}

function setCategory(id) {
    newsStore.resetFilters({ selectedCategoriesIds: [id] });
    nextTick(() => router.push(`/?categories=${id}`));
}
</script>
<style lang="scss">
.mobile-menu {
    $p: &;

    &__container {
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        overflow: hidden;
        background: color("background");
        color: color("main");
        box-shadow: -20px 0 20px -20px rgba(0, 0, 0, 0.5) inset;
        font-size: 15px;
        z-index: 50;
        transition: width 0.4s ease;
    }

    &__main {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 20px 0 20px 20px;
    }

    &__user {
        $user: &;

        position: relative;
        margin-bottom: 7px;

        @media (min-width: $mobileWidth) {
            display: none;
        }

        &-link {
            cursor: pointer;
            padding: 10px 10px 10px 10px;
            line-height: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        }

        &-main {
            cursor: pointer;
            display: flex;
            align-items: center;
            padding-bottom: 7px;
        }

        &-name {
            margin-left: 6px;
        }

        &-icon {
            height: 24px;
            width: 24px;
        }

        &-caret {
            height: 15px;
            width: 15px;
            margin-left: 6px;
            transition: transform 0.18s ease;
        }

        &-dropdown {
            overflow: hidden;
            height: var(--height);
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);

            &--transition {
                &-enter-active,
                &-leave-active {
                    transition: all 0.18s ease;
                }
                &-enter-from,
                &-leave-to {
                    height: 0;
                    border-color: #333333;
                }
            }
        }

        &--opened {
            #{$user}-caret {
                transform: rotate(180deg);
            }
        }
    }

    &__links {
        list-style-type: none;
        padding: 0;
    }

    &__link {
        display: block;
        padding: 10px 10px 10px 0;
        line-height: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: inherit;
        text-decoration: none;
        font-weight: 700;
        transition: color 0.18s ease;

        &:hover {
            color: color("link");
        }
    }

    &__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px 15px 20px;
        overflow-x: hidden;
    }

    &__weather {
        height: 40px;

        @media (min-width: $mobileWidth) {
            display: none;
        }
    }

    &__theme-switcher {
        color: color("second");
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }

    &__closer {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: hsla(0, 0, 0, 0);
        z-index: 50;
        pointer-events: none;
        transition: left 0.4s ease, background-color 0.4s ease;
    }

    &--opened {
        position: relative;
        z-index: 50;
        #{$p}__container {
            width: 240px;

            @media (max-width: 550px) {
                width: 80%;
            }
        }

        #{$p}__closer {
            left: 240px;
            background: hsla(0, 0, 0, 0.1);
            pointer-events: all;

            @media (max-width: 550px) {
                left: 80%;
            }
        }
    }
}
</style>
