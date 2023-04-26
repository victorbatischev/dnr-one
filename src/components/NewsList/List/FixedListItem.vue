<template>
    <article class="fl-item">
        <ImageComp class="fl-item__image" :src="photo" :alt="'image'" />
        <div class="fl-item__container">
            <HeaderComp class="fl-item__title">
                <LinkComp :to="`/post/${id}`">{{ title }}</LinkComp>
            </HeaderComp>

            <MetaComp class="fl-item__meta" :id="id" :category="category" :tags="tags" :published_date="published_date" />

            <SocialComp class="fl-item__social" :scope="'news'" :id="id" :like="like" :comments_count="comments_count" :views="views" />

            <div class="fl-item__content" v-html="contentSubstring"></div>

            <LinkComp :to="`/post/${id}`">read more...</LinkComp>
        </div>
    </article>
</template>

<script setup>
import { computed, defineProps } from "vue";
// components
import MetaComp from "@/components/Common/MetaComp.vue";
import SocialComp from "@/components/Common/SocialComp.vue";

const props = defineProps([
    "id",
    "title",
    "news_body",
    "photo",
    "category",
    "tags",
    "comments_count",
    "scrollPosition",
    "like",
    "published_date",
    "views",
]);

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
    let val = "";
    if (content.value.includes("<br>")) {
        val = content.value.substring(0, content.value.indexOf("<br>"));
    }
    if (val.length > 50) {
        val = val.substring(0, 50) + "...";
    }
    return val;
});
</script>

<style lang="scss">
.fl-item {
    position: relative;
    padding: 20px 0;
    border-bottom: 1px solid color("border");

    @media (min-width: $mobileWidth) {
        display: flex;
        height: 250px;
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
            height: 100%;
        }
    }
}
</style>
