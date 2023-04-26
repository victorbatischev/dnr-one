<template>
    <div class="search-page">
        <div class="search-page__input">
            <font-awesome-icon class="search-page__input-close" icon="xmark" @click="goBackToMain()" />
            <input class="search-page__input-field" type="text" placeholder="Поиск" v-model="searchText" />
            <font-awesome-icon class="search-page__input-search" icon="magnifying-glass" @click="search()" />
        </div>
        <LoadingComp class="search-page__loading" v-if="loading" />

        <InfiniteScroll class="search-page__list" :list="list" :startingId="0" :fillerNeeded="false" />
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
// components
import InfiniteScroll from "@/components/NewsList/List/InfiniteScroll.vue";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();
// router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// composables
import { useNewsApi } from "@/composables/api/news";
const api = useNewsApi();

const searchText = ref("");
const list = ref([]);
const loading = ref(false);

onMounted(() => {
    if (route.query.query) {
        searchText.value = route.query.query;
    }
    if (newsStore.searchList.length > 0) {
        list.value = newsStore.searchList.map((x, i) => ({ ...x, index: i }));
        nextTick(() => {
            clearTimeout(timeoutedSearch);
            newsStore.searchList = [];
        });
    }
});

function goBackToMain() {
    router.back();
}

let timeoutedSearch;
watch(searchText, () => {
    if (timeoutedSearch) {
        clearTimeout(timeoutedSearch);
    }
    timeoutedSearch = setTimeout(() => {
        search();
    }, 1000);
});

async function search() {
    if (searchText.value.trim() === "") return;

    loadMorePosts(1);

    router.replace({ query: { query: searchText.value } });
}

const meta = ref({});

async function loadMorePosts(page) {
    loading.value = true;
    let resp = await api.findPostsByString(searchText.value, page);

    loading.value = false;

    if (resp != null && !resp.hasErrors) {
        list.value = resp.news.map((x, i) => ({ ...x, index: i + list.value.length }));
        meta.value = resp._meta;
    }
}

function loadMorePostsIfNeeded() {
    if (newsStore.onScreenPostsIds.length === 0 || list.value.length < 20) return;

    let lastOnscreenId = newsStore.onScreenPostsIds[newsStore.onScreenPostsIds.length - 1];
    let lastOnscreenIdEqualsLastListId = lastOnscreenId === list.value[list.value.length - 1].id;
    let morePostsCanBeFetched = list.value.length < meta.value.totalCount;

    if (lastOnscreenIdEqualsLastListId && morePostsCanBeFetched) {
        let nextPageNumber = Math.ceil(list.value.length / meta.value.perPage) + 1;
        loadMorePosts(nextPageNumber);
    }
}

watch(
    () => newsStore.onScreenPostsIds,
    () => {
        loadMorePostsIfNeeded();
    }
);
</script>

<style lang="scss">
.search-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;

    &__input {
        display: flex;
        align-items: center;
        width: 600px;
        max-width: 100%;
    }

    &__input-close,
    &__input-search {
        height: 30px;
        width: auto;
        margin: 0 10px;
        cursor: pointer;
        color: color("second");
    }

    &__input-field {
        @include grey-input;
        width: 100%;
    }

    &__loading {
        margin: 50px;
    }

    &__list {
        width: 100%;
    }
}
</style>
