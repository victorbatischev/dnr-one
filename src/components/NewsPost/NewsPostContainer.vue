<template>
    <article class="news-post">
        <ImageComp class="news-post__image" @load="imageLoaded" :src="post.photo" :alt="post.title" />

        <div class="news-post__container">
            <HeaderComp>{{ post.title }}</HeaderComp>

            <MetaComp class="news-post__meta" :id="id" :category="post.category" :tags="post.tags" :published_date="post.published_date" />

            <SocialComp
                class="news-post__social"
                :scope="'news'"
                :id="id"
                :like="post.like"
                :comments_count="post.comments_count"
                :views="post.views"
            />

            <div class="news-post__content" v-html="content"></div>

            <CommentsList :id="id" ref="refComments" />
        </div>
        <FooterContainer />
    </article>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
// components
import CommentsList from "./Comments/CommentsList.vue";
import FooterContainer from "@/components/Footer/FooterContainer.vue";
import MetaComp from "@/components/Common/MetaComp.vue";
import SocialComp from "@/components/Common/SocialComp.vue";
// composables
import { useNewsApi } from "@/composables/api/news";
const { fetchPostById } = useNewsApi();
// reouter
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const props = defineProps(["id"]);

const post = ref({ title: "", news_body: "", photo: "", category: 0, tags: [], like: 0, comments_count: 0, views: 0 });

const refComments = ref(null);

const content = computed(() => {
    if (post.value.news_body) {
        let val = "<p>";
        val += post.value.news_body.replaceAll("\n", "</p><p>");
        val += "</p>";
        return val;
    }
    return "";
});

onMounted(init);
async function init() {
    window.scroll(0, 0);
    let fetchedPost = await fetchPostById(props.id);
    post.value = fetchedPost;
    document.title = `${post.value.title} - DNR.ONE`;
}

function imageLoaded() {
    if (route.hash) {
        scrollToComments();
    }
}

function scrollToComments() {
    let el = refComments.value.$el;
    window.scrollTo({ top: el.offsetTop - 45, behavior: "smooth" });
    router.replace({ hash: "", query: route.query });
}

onBeforeRouteUpdate((to, from) => {
    if (to.hash === "#comments" && from.hash !== "#comments") {
        scrollToComments();
    }
});
</script>

<style lang="scss">
.news-post {
    width: 600px;
    max-width: 100%;
    margin: 0 auto;

    &__container {
    }

    &__meta {
        margin-bottom: 5px;
    }

    &__social {
        margin-bottom: 5px;
    }

    &__image {
        margin: 20px 0 20px 0;
        width: 100%;
    }
}
</style>
