<template>
    <div class="main-header">
        <nav class="main-header__container">
            <ul class="main-header__links">
                <li><router-link class="main-header__link" to="/">link1</router-link></li>
                <li><router-link class="main-header__link" to="/">link2</router-link></li>
                <li><router-link class="main-header__link" to="/">link3</router-link></li>
                <li><router-link class="main-header__link" to="/">link4</router-link></li>
            </ul>
            <div class="main-header__logo">logo</div>
            <ul class="main-header__links">
                <li><router-link class="main-header__link" to="/">link5</router-link></li>
                <li><router-link class="main-header__link" to="/">link8</router-link></li>
                <li><router-link class="main-header__link" to="/">link6</router-link></li>
                <li><router-link class="main-header__link" to="/">link7</router-link></li>
            </ul>
        </nav>
    </div>
</template>

<script setup></script>

<style lang="scss">
.main-header {
    &__container {
        display: flex;
        justify-content: center;
        margin: 10px 0;

        @media (max-width: $tabletWidth) {
            display: none;
        }
    }

    &__links {
        list-style-type: none;
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
    }

    &__link {
        color: #6c6c6c;
        font-size: 13px;
        text-transform: uppercase;
        white-space: nowrap;
        text-decoration: none;
    }

    &__logo {
        display: flex;
        width: 100px;
        height: 100px;
        margin: 0 50px;
        justify-content: center;
        align-items: center;
        border: 2px dotted lightgray;
        border-radius: 50px;
    }
}
</style>
