<template>
    <Transition name="image-preview-comp--transition">
        <div class="image-preview-comp" v-if="stateOpened" @click="closePreview()">
            <div class="image-preview-comp__container" @click.stop>
                <img class="image-preview-comp__image" :src="src" :alt="alt" />

                <!-- <div class="image-preview-comp__caption">
                    {{ alt }}
                </div> -->
                <div class="image-preview-comp__close" @click="closePreview()">
                    <font-awesome-icon class="image-preview-comp__close-button" icon="xmark" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";

const props = defineProps(["src", "alt", "opened"]);
const stateOpened = ref(false);

function closePreview() {
    stateOpened.value = false;
}

watch(
    () => props.opened,
    (to) => {
        if (to) {
            stateOpened.value = true;
        }
    }
);
</script>

<style lang="scss">
.image-preview-comp {
    position: fixed;
    display: flex;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.95);

    &--transition {
        &-enter-active,
        &-leave-active {
            transition: opacity 0.18s;
        }
        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }

    &__container {
        display: flex;
        position: relative;
        max-width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
        flex-direction: column;
        gap: 20px;
        background: color("background");
        padding: 20px;
        border-radius: 2px;
    }

    &__image-container {
        min-height: 0;
        flex: 0 1;
    }

    &__image {
        display: block;
        min-width: 0;
        min-height: 0;
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 40px);
    }

    &__caption {
        flex: 1 0;
        line-height: 20px;
    }

    &__close {
        display: flex;
        position: absolute;
        top: -0.5em;
        right: -0.5em;
        width: 24px;
        height: 24px;
        justify-content: center;
        align-items: center;

        padding: 13px;
        line-height: 25px;
        background-color: color("second");
        color: color("background") !important;
        border: 2px solid color("background");
        border-radius: 100%;
        transition: all 0.15s ease-out 0s;
        cursor: pointer;

        &:hover {
            color: color("main") !important;
            background-color: color("background-hover");
        }

        &-button {
            height: 18px;
            width: 18px;
        }
    }
}
</style>
