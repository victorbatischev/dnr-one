<template>
    <footer class="footer">
        <div class="footer__social">
            <a href="http://web.telegram.org" target="_blank">
                <font-awesome-icon class="footer__social-item" :icon="['fab', 'telegram']" />
            </a>
            <a href="http://vk.com" target="_blank">
                <font-awesome-icon class="footer__social-item" :icon="['fab', 'vk']" />
            </a>
            <a href="http://instagram.com" target="_blank">
                <font-awesome-icon class="footer__social-item" :icon="['fab', 'instagram-square']" />
            </a>
        </div>
        <div class="footer__text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim dolorem quibusdam similique. Iure temporibus veritatis et, sequi
            labore similique, laboriosam recusandae adipisci tempore esse molestias at. Perferendis excepturi deserunt magnam.
        </div>
    </footer>
</template>

<script setup></script>

<style lang="scss">
.footer {
    display: flex;
    border-top: 2px solid color("border");
    padding: 15px 0;
    color: color("second");

    &__social {
        flex: 1;
        border-right: 2px solid color("border");
    }

    &__text {
        flex: 2;
        padding: 0 10px;
    }

    &__social-item {
        color: color("second");

        height: 30px;
        width: 30px;
        margin-right: 5px;

        transition: color 0.18s ease;

        &:hover {
            color: color("link-hover");
        }
    }
}
</style>
