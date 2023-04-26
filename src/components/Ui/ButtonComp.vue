<template>
    <input class="button-comp" type="button" :value="value" />
</template>

<script setup>
import { defineProps } from "vue";
defineProps(["value"]);
</script>

<style lang="scss">
.button-comp {
    padding: 12px 30px;
    border: 2px solid color("border");
    cursor: pointer;
    background: transparent;
    color: color("link");
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 700;
    transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;

    &:disabled {
        color: color("second");
    }

    @media (min-width: $mobileWidth) {
        &:enabled:hover {
            border-color: color("link");
            background-color: color("link");
            color: #fff !important;
        }
    }
}
</style>
