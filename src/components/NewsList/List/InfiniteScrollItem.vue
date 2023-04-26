<template>
    <article class="is-item" ref="el" v-if="showed">
        <ImageComp class="is-item__image" :src="photo" :alt="'image'" />
        <div class="is-item__container">
            <HeaderComp class="is-item__title">
                <LinkComp :to="`/post/${id}`">{{ title }}</LinkComp>
            </HeaderComp>

            <MetaComp class="is-item__meta" :id="id" :category="category" :tags="tags" :published_date="published_date" />

            <SocialComp class="is-item__social" :scope="'news'" :id="id" :like="like" :comments_count="comments_count" :views="views" />

            <div class="is-item__content" v-html="expanded ? content : contentSubstring"></div>

            <div class="is-item__expand" v-if="!expanded" @click="expanded = true">read more...</div>
        </div>
        <!-- <div class="is-item__filler" :style="`background-color: rgba(0,0,0,${opacity});`"></div> -->
    </article>
</template>

<script setup>
import { ref, defineProps, computed, watch, onBeforeUnmount, nextTick } from "vue";
// components
import MetaComp from "@/components/Common/MetaComp.vue";
import SocialComp from "@/components/Common/SocialComp.vue";
// store
import { useNews } from "@/stores";
const newsStore = useNews();

const props = defineProps([
    "fillerNeeded",
    "showed",
    "index",
    "id",
    "title",
    "news_body",
    "photo",
    "category",
    "tags",
    "comments_count",
    "like",
    "published_date",
    "views",
]);

const onScreen = ref(false);
// let windowHeight = 0;
const el = ref(null);
const expanded = ref(false);

const content = computed(() => {
    if (props.news_body) {
        let val = "<p>";
        val += props.news_body.replaceAll("\n", "</p><p>");
        val += "</p>";
        return val;
    }
    return "";
});

const contentSubstring = computed(() => {
    if (content.value.length > 70) {
        return content.value.substring(0, 70) + "...";
    }
    return content.value;
});

// const scrollPosition = ref(0);
// function scrollListener() {
//     scrollPosition.value = window.scrollY;
// }
// watch(
//     () => onScreen.value,
//     (to) => {
//         if (props.fillerNeeded) {
//             if (to) {
//                 window.addEventListener("scroll", scrollListener);
//             } else {
//                 window.removeEventListener("scroll", scrollListener);
//             }
//         }
//     }
// );

// const opacity = computed(() => {
//     if (props.index === 0 || !props.fillerNeeded) return 0;
//     let scroll = scrollPosition.value + 48;
//     let elementPosition = el.value?.offsetTop || 0;
//     if (elementPosition - windowHeight * 0.5 < scroll) return 0;
//     let value = (elementPosition - scroll - windowHeight * 0.5) / (windowHeight * 0.5 - 50);
//     return value;
// });

const callback = (entries) => {
    if (entries[0].isIntersecting) {
        onScreen.value = true;
        newsStore.addOnScreenPostId(props.id);
    } else {
        onScreen.value = false;
        newsStore.removeOnScreenPostId(props.id);
    }
};
const observer = new IntersectionObserver(callback, {});

// onMounted(() => {
//     windowHeight = window.innerHeight;
// });

onBeforeUnmount(() => {
    onScreen.value = false;
    newsStore.removeOnScreenPostId(props.id);
    if (el.value) {
        observer.unobserve(el.value);
    }
});

watch(
    () => props.showed,
    async (to) => {
        if (to) {
            nextTick(() => {
                observer.observe(el.value);
            });
        }
    }
);
</script>

<style lang="scss">
.is-item {
    position: relative;
    padding: 20px 0;
    border-bottom: 1px solid color("border");

    @media (min-width: $mobileWidth) {
        display: flex;
        min-height: 250px;
        width: 100%;
        justify-content: space-between;
    }

    &__container {
        @media (min-width: $mobileWidth) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            max-width: calc(100% - 310px);
            max-height: 100%;
        }
    }

    &__title {
    }

    &__meta {
        margin-bottom: 5px;
    }

    &__social {
        margin-bottom: 5px;
    }

    &__content {
    }

    &__expand {
        cursor: pointer;
        color: color("link");
    }

    &__image {
        height: 160px;

        @media (min-width: $mobileWidth) {
            order: 1;
            width: 300px;
            height: 210px;
        }
    }

    &__filler {
        position: absolute;
        margin: 0 calc((100% - 100vw) / 2);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.6);
        //box-shadow: 0 -5px 5px #000;
    }
}
</style>
