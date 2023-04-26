<template>
    <div class="page-404">
        <div class="page-404__container">
            <HeaderComp class="page-404__title">404</HeaderComp>
            <h3>Page not found</h3>
            <LinkComp to="/">go to main</LinkComp>
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss">
.page-404 {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;

    &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 30%;
    }
}
</style>
