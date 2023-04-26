<template>
    <div class="news-page">
        <div class="news-page__info-filters" v-if="newsStore.selectedCategories.length > 0">
            <div class="news-page__info-categories">
                <template v-for="category in newsStore.selectedCategories" :key="category">
                    <div class="news-page__info-categories-item">
                        {{ category.title }}
                        <font-awesome-icon class="news-page__info-categories-item-icon" icon="xmark" @click="removeCategory(category.id)" />
                    </div>
                </template>
            </div>
            <div class="news-page__info-tags">
                <template v-for="tag in newsStore.selectedTags" :key="tag">
                    <div class="news-page__info-tags-item">
                        {{ tag.title }}
                        <font-awesome-icon class="news-page__info-tags-item-icon" icon="xmark" @click="removeTag(tag.id)" />
                    </div>
                </template>
            </div>
        </div>
        <InfiniteScroll :list="list" />
        <LoadingComp class="news-page__loading" v-if="loading" />
        <div class="news-page__loading-failed" v-if="loadingFailed">К сожалению, ничего не найдено</div>
        <SidebarContainer class="news-page__sidebar" />
        <NewsSearch />
    </div>
</template>

<script>
export default { name: "NewsListContainer" };
</script>
<script setup>
import { computed, nextTick, onActivated, onMounted, ref, watch } from "vue";
// components
import InfiniteScroll from "@/components/NewsList/List/InfiniteScroll.vue";
import SidebarContainer from "@/components/NewsList/SideBar/SidebarContainer.vue";
import NewsSearch from "@/components/NewsList/Search/NewsSearch.vue";
// router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// stores
import { useNews } from "@/stores";
const newsStore = useNews();
// composables
import { useNewsApi } from "@/composables/api/news";
const newsApi = useNewsApi();

const loading = computed(() => list.value.length === 0 && !loadingFailed.value);
const loadingFailed = ref(false);
const pageLoaded = ref(0);

const list = ref([]);

onMounted(() => {
    if (!newsStore.pageReseted) {
        init();
    }
});
onActivated(() => {
    if (newsStore.pageReseted) {
        filterHandler();
        nextTick(() => (newsStore.pageReseted = false));
    }
});

watch(
    () => newsStore.pageReseted,
    (to) => {
        if (to) {
            filterHandler();
            nextTick(() => (newsStore.pageReseted = false));
        }
    }
);

async function init() {
    list.value = [];
    getFilterDataFromQuery();

    await newsStore.init(); // load categories and tags list
    await nextTick();
    await filterHandler();
}

// #region handling filtration
function removeCategory(id) {
    newsStore.selectedCategoriesIds = newsStore.selectedCategoriesIds.filter((x) => x !== id);
    newsStore.pageReseted = true;
}

function removeTag(id) {
    newsStore.selectedTagsIds = newsStore.selectedTagsIds.filter((x) => x !== id);
    newsStore.pageReseted = true;
}

function getFilterDataFromQuery() {
    if (route.query.categories) {
        newsStore.selectedCategoriesIds = route.query.categories.split(",").map(Number);
    } else {
        newsStore.selectedCategoriesIds = [];
    }

    if (route.query.tags) {
        newsStore.selectedTagsIds = route.query.tags.split(",").map(Number);
    } else {
        newsStore.selectedTagsIds = [];
    }
}

async function filterHandler() {
    list.value = [];

    removeWrongFilterIds();
    setFilterDataToQuery();

    newsStore.filterNeeded = false;
    await loadMorePosts(1);
}

function setFilterDataToQuery() {
    let query = Object.assign({}, route.query);
    ["categories", "tags"].forEach((x) => {
        let value = x === "categories" ? newsStore.selectedCategoriesIds.join(",") : newsStore.selectedTagsIds.join(",");

        if (value === "") {
            delete query[x];
        } else {
            query[x] = value;
        }
    });

    router.replace({ query });
}

function removeWrongFilterIds() {
    let remove = (target, possible) => {
        let possibleIds = possible.map((x) => x.id);
        return target.filter((x) => possibleIds.includes(x));
    };

    let target = newsStore.selectedCategoriesIds;
    let edited = remove([...new Set(target.sort((a, b) => a - b))], newsStore.categories);
    if (JSON.stringify(target) !== JSON.stringify(edited)) {
        newsStore.selectedCategoriesIds = edited;
    }

    target = newsStore.selectedTagsIds;
    edited = remove([...new Set(target.sort((a, b) => a - b))], newsStore.possibleTags);
    if (JSON.stringify(target) !== JSON.stringify(edited)) {
        newsStore.selectedTagsIds = edited;
    }
}

watch(
    () => newsStore.filterNeeded,
    (to) => {
        if (to) {
            filterHandler();
        }
    }
);
// #endregion

// #region handling fetching posts
const meta = ref({});

async function loadMorePosts(page) {
    loadingFailed.value = false;
    let posts = await newsApi.fetchPostsIdsByFilters(newsStore, page);

    if (posts == null) {
        return;
    } else if (posts.news == null || posts.news.length === 0) {
        loadingFailed.value = true;
    } else {
        list.value.push(...posts.news.map((x, i) => ({ ...x, index: i + list.value.length })));
        meta.value = posts._meta;
    }
}

function loadMorePostsIfNeeded() {
    if (newsStore.onScreenPostsIds.length === 0 || list.value.length < 20) return;

    let lastOnscreenId = newsStore.onScreenPostsIds[newsStore.onScreenPostsIds.length - 1];
    let lastOnscreenIdEqualsLastListId = lastOnscreenId === list.value[list.value.length - 1].id;
    let morePostsCanBeFetched = list.value.length < meta.value.totalCount;

    if (lastOnscreenIdEqualsLastListId && morePostsCanBeFetched) {
        let nextPageNumber = Math.ceil(list.value.length / meta.value.perPage) + 1;
        if (nextPageNumber !== pageLoaded.value) {
            loadMorePosts(nextPageNumber);
            pageLoaded.value = nextPageNumber;
        }
    }
}

watch(
    () => newsStore.onScreenPostsIds,
    () => {
        loadMorePostsIfNeeded();
    },
    { deep: true }
);
// #endregion
</script>

<style lang="scss">
.news-page {
    &__info-filters {
    }

    &__info-categories {
        display: flex;
        flex-wrap: wrap;
        font-size: 20px;
        padding-top: 20px;

        &-item {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-right: 10px;

            &-icon {
                height: 15px;
                cursor: pointer;
                color: color("second");
                transition: color 0.18s ease;

                &:hover {
                    color: color("second-hover");
                }
            }
        }
    }

    &__info-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        padding-top: 10px;

        &-item {
            display: flex;
            align-items: center;
            gap: 3px;

            &-icon {
                height: 13px;
                cursor: pointer;
                color: color("second");
                transition: color 0.18s ease;

                &:hover {
                    color: color("second-hover");
                }
            }
        }
    }

    &__loading {
        margin: 50px auto;
    }

    &__loading-failed {
        margin: 50px 0;
        display: flex;
        justify-content: center;
        text-align: center;
    }
}
</style>
