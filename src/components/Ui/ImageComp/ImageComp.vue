<template>
    <div class="image-comp">
        <div class="image-comp__container">
            <img class="image-comp__img" :src="tempImage" :alt="alt" @click="openPreview()" @load="emitLoad" @error="changeSrc()" />
        </div>
        <ImagePreviewComp :src="tempImage" :alt="alt" :opened="opened" />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick } from "vue";
// components
import ImagePreviewComp from "./ImagePreviewComp.vue";

import placeholder from "@/assets/images/placeholder.png";

const props = defineProps(["src", "alt"]);
const emit = defineEmits(["load"]);

const opened = ref(false);

const tempImage = ref(props.src);

// const tempImage = computed(() => {
//     if (props.src == null || ["N/A", "test_path", "dfdvfbgfb", "fmvnfvjgnbjg"].some((x) => props.src.includes(x))) {
//         let randW = Math.floor(Math.random() * 500 + 800);
//         let randH = Math.floor((randW * 9) / 16);
//         let randBColor = Math.floor(Math.random() * 16777215).toString(16);
//         let randFColor = Math.floor(Math.random() * 16777215).toString(16);
//         return `https://via.placeholder.com/${randW}x${randH}/${randBColor}/${randFColor}`;
//     } else {
//         return props.src;
//     }
// });

function openPreview() {
    opened.value = true;
    nextTick(() => {
        opened.value = false;
    });
}

function emitLoad(event) {
    emit("load", event);
}

function changeSrc() {
    tempImage.value = placeholder;
    // let randW = Math.floor(Math.random() * 500 + 800);
    // let randH = Math.floor((randW * 9) / 16);
    // let randBColor = Math.floor(Math.random() * 16777215).toString(16);
    // let randFColor = Math.floor(Math.random() * 16777215).toString(16);
    // tempImage.value = `https://via.placeholder.com/${randW}x${randH}/${randBColor}/${randFColor}`;
}
</script>

<style lang="scss">
.image-comp {
    &__container {
        width: 100%;
        // padding: 10px;
        // border: 1px solid color("border");
        cursor: pointer;
        height: 100%;
        transition: box-shadow 0.18s;

        @media (min-width: $mobileWidth) {
            &:hover {
                box-shadow: 0 0 18px color("background-hover");
            }
        }
    }

    &__img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
