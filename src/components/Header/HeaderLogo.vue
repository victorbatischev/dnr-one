<template>
    <svg class="header-logo" viewbox="0 0 153 30" v-if="false">
        <text class="header-logo__text" y="25">D</text>
        <text class="header-logo__text header-logo__text--2" x="25" y="25">N</text>
        <text class="header-logo__text header-logo__text--3" x="50" y="25">R</text>
        <text class="header-logo__text" x="75" y="25">.ONE</text>
    </svg>
    <img class="header-logo" v-else src="@/assets/images/logo.png" />
</template>

<script setup></script>

<style lang="scss">
.header-logo {
    // width: 153px;
    // font-family: "Montserrat", sans-serif;
    // font-size: 30px;
    // font-weight: 700;
    // height: 30px;

    // &__text {
    //     fill: #1e1e1e;
    //     stroke: hsla(0, 0%, 100%, 0.675);
    //     stroke-width: 2.5px;
    //     stroke-linejoin: round;
    //     paint-order: stroke fill;

    //     &--2 {
    //         fill: #1e1eff;
    //     }
    //     &--3 {
    //         fill: #ff1e1e;
    //     }
    // }

    height: 23px;
}
</style>
