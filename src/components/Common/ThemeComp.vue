<template>
    <div class="theme-comp" @click="toggleTheme()">
        <div
            class="theme-comp__filler"
            :class="{ 'theme-comp__filler--border': spreadingBorder, 'theme-comp__filler--center': spreadingCenter }"
            :style="{ '--border-color': borderColor }"
        ></div>
        <font-awesome-icon class="theme-comp__button" icon="moon" v-if="currentTheme === 'light'" />
        <font-awesome-icon class="theme-comp__button" icon="sun" v-else />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const currentTheme = ref("light");
const spreadingBorder = ref(false);
const spreadingCenter = ref(false);
const borderColor = ref("");

onMounted(() => {
    if (localStorage.getItem("theme")) {
        setTheme(localStorage.getItem("theme"));
    } else {
        setTheme("light");
    }
});

async function toggleTheme() {
    let nextTheme = currentTheme.value === "light" ? "dark" : "light";

    borderColor.value = nextTheme === "light" ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 10%)";
    spreadingBorder.value = true;
    await new Promise((r) => setTimeout(r, 200));
    setTheme(nextTheme);
    //spreadingCenter.value = true;
    //await new Promise((r) => setTimeout(r, 200));
    spreadingBorder.value = false;
    //spreadingCenter.value = false;
}

function setTheme(theme) {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
    currentTheme.value = theme;
}
</script>

<style lang="scss">
.theme-comp {
    position: relative;
    cursor: pointer;
    z-index: 200;

    &__button {
        height: 30px;
    }

    &__filler {
        --border-width: 0vh;
        --border-offset: 0vh;
        --opacity: 0;
        position: fixed;
        width: 30px;
        height: 30px;
        //border-radius: 15px;
        //outline-offset: var(--border-offset);
        //outline-style: solid;
        //outline-width: var(--border-width);
        //opacity: 0;
        //border: 1px solid red;

        //transition: outline-offset 0.2s linear, outline-width 0.2s linear;
        //transition: 2s linear;

        z-index: 200;

        //box-shadow: 0 0 0 30px green, 0 0 0 40px blue;

        &:after {
            content: "";
            position: absolute;
            // top: calc((var(--border-width) + var(--border-offset)) * -1 + 15px);
            // left: calc((var(--border-width) + var(--border-offset)) * -1 + 15px);
            // width: calc(var(--border-offset) * 2);
            // height: calc(var(--border-offset) * 2);
            // border-radius: 50%;
            // border: var(--border-width) solid var(--border-color);
            // opacity: var(--opacity);
            // pointer-events: none;
            // transition: 0.2s linear;
            // transition-property: border, top, left, width, height;
            top: 0;
            left: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            box-shadow: 0 0 0 var(--border-width) var(--border-color);
            transition: box-shadow 0.2s linear;
            z-index: 200;
        }

        &--border {
            --border-width: max(150vh, 150vw);
            --opacity: 1;
        }

        &--center {
            --border-offset: max(150vh, 150vw);
            --opacity: 1;
        }
    }
}
</style>
