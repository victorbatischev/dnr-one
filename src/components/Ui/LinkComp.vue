<template>
    <router-link class="link-comp" :to="to"><slot></slot></router-link>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["to"]);
</script>

<style lang="scss">
.link-comp {
    position: relative;
    color: color("link");
    text-decoration: none;
    transition: color 0.18s ease;

    &:hover {
        color: color("link-hover");
    }

    // &::after {
    //     width: 0;
    //     left: 0;
    //     margin-left: 50%;
    //     position: absolute;
    //     content: "";
    //     top: 100%;

    //     height: 0.08em;
    //     background: color("link-hover");
    //     transition: all 0.18s ease-in-out;
    // }

    // &:hover::after {
    //     width: 100%;
    //     margin-left: 0;
    // }
}
</style>
