<template>
    <h1 class="header-comp">
        <slot></slot>
    </h1>
</template>

<script setup></script>

<style lang="scss">
.header-comp {
    color: color("second");
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -0.04em;
}
</style>
