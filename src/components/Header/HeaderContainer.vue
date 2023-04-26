<template>
    <header class="header">
        <div class="header__fixed">
            <MobileHeader class="wrap" />
            <!-- <PreHeader class="wrap" /> -->
        </div>
        <!-- <MainHeader class="wrap" /> -->
    </header>
</template>

<script setup>
import MobileHeader from "@/components/Header/MobileHeader.vue";
//import PreHeader from "@/components/Header/PreHeader.vue";
//import MainHeader from "@/components/Header/MainHeader.vue";
</script>

<style lang="scss">
.header {
    $p: &;

    font-family: "Montserrat", sans-serif;

    &__fixed {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 20;
        background: color("background");
    }
    @at-root {
        body.body--sb-opened,
        body.body--modal-opened {
            #{$p}__fixed {
                padding-right: var(--scrollbar-width);
            }
        }
    }
}
</style>
