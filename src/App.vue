<template>
    <div class="app">
        <MobileMenuContainer />
        <div class="page" :class="{ 'page--mobile-menu-opened': mmOpened }">
            <HeaderContainer class="page__header" />
            <div class="page__container wrap">
                <router-view v-slot="{ Component }">
                    <keep-alive include="NewsListContainer">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeaderContainer from "@/components/Header/HeaderContainer.vue";
import MobileMenuContainer from "@/components/MobileMenu/MobileMenuContainer.vue";
import { useUi, useUser } from "@/stores";
import { storeToRefs } from "pinia";
import { watch } from "vue";

const uiStore = useUi();
const userStore = useUser();

const { mobileMenuOpened: mmOpened, sidebarOpened: sbOpened } = storeToRefs(uiStore);

userStore.loadUserData();

watch(mmOpened, (to) => {
    document.body.classList.toggle("body--mm-opened", to);
});
watch(sbOpened, (to) => {
    if (to) {
        document.body.classList.toggle("body--sb-opened", to);
    } else {
        setTimeout(() => {
            document.body.classList.toggle("body--sb-opened", to);
        }, 180);
    }
});

// window.addEventListener("error", (msg, url, linenumber) => {
//     alert("Error message: " + msg + "\nURL: " + url + "\nLine Number: " + linenumber);
//     return true;
// });

// #region handling scrollbar toggle
function getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    const inner = document.createElement("div");
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
}
document.querySelector(":root").style.setProperty("--scrollbar-width", getScrollbarWidth() + "px");
// #endregion
</script>

<style lang="scss">
@import "@/styles/themes.scss";

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: "Roboto", sans-serif;
    line-height: 1.625;
    font-size: 15px;
    background: color("background");
    color: color("main");
    overflow-x: hidden;
    overflow-y: scroll;

    &.body--mm-opened {
        position: relative;
        overflow-y: hidden;
    }

    &.body--sb-opened,
    &.body--modal-opened {
        position: relative;
        overflow-y: hidden;
        padding-right: var(--scrollbar-width);
    }
}
p {
    margin-top: 10px;
}

.wrap {
    width: 945px;
    max-width: 97%;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: $tabletWidth) {
        width: 750px;
    }
}

.page {
    position: relative;
    display: flex;
    top: 0;
    left: 0;
    min-height: 100vh;
    flex-direction: column;
    background: color("background");
    transition: left 0.4s ease;

    &__container {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-top: 48px;
    }

    &__content {
        flex: 1;
    }

    &--mobile-menu-opened {
        left: 240px;
        overflow: hidden;

        @media (max-width: 550px) {
            left: 80%;
        }
    }
}
</style>
