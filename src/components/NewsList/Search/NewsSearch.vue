<template>
    <ModalComp ref="modal">
        <div class="news-search">
            <div class="news-search__input">
                <font-awesome-icon class="news-search__input-close" icon="xmark" @click="closeSearch()" />
                <input
                    class="news-search__input-field"
                    type="text"
                    placeholder="Поиск"
                    v-model="searchText"
                    ref="input"
                    @keydown="waitForEnter"
                />
                <font-awesome-icon class="news-search__input-search" icon="magnifying-glass" @click="openSearchPage()" />
            </div>

            <LoadingComp class="news-search__loading" v-if="loading" />
            <div class="news-search__list wrap" v-else-if="list.length > 0">
                <FixedList :list="list" />
                <ButtonComp
                    class="news-search__more"
                    v-if="listLength > 4"
                    :value="`Show all ${listLength} results`"
                    @click="openSearchPage()"
                />
            </div>
        </div>
    </ModalComp>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
// components
import FixedList from "@/components/NewsList/List/FixedList.vue";
// stores
import { useUi, useNews } from "@/stores";
const uiStore = useUi();
const newsStore = useNews();
// router
import { useRouter } from "vue-router";
const router = useRouter();
// composables
import { useNewsApi } from "@/composables/api/news";
const api = useNewsApi();

const searchText = ref("");
const list = ref([]);
const loading = ref(false);

const modal = ref(null);
const input = ref(null);

let listLength = ref(0);

async function search() {
    if (searchText.value.trim() === "") return;

    loading.value = true;
    let resp = await api.findPostsByString(searchText.value);
    loading.value = false;

    if (resp != null && !resp.hasErrors) {
        listLength.value = resp.news.length;
        if (listLength.value > 4) {
            list.value = resp.news.slice(0, 4);
        } else {
            list.value = resp.news;
        }
        return;
    }
    list.value = [];
    listLength.value = 0;
}

function waitForEnter(event) {
    if (event.key === "Enter") {
        openSearchPage();
    }
}

function closeSearch() {
    modal.value.close();
}

function openSearchPage() {
    newsStore.searchList = list.value;
    router.push(`/search?query=${searchText.value}`);
    closeSearch();
}

// #region handling delayed search
let timeoutedSearch;
watch(searchText, () => {
    if (timeoutedSearch) {
        clearTimeout(timeoutedSearch);
    }
    timeoutedSearch = setTimeout(() => {
        search();
    }, 1000);
});

watch(
    () => uiStore.searchWindowOpened,
    (to) => {
        if (to) {
            list.value = [];
            listLength.value = 0;
            searchText.value = "";
            clearTimeout(timeoutedSearch);
            modal.value.open({ position: "top" });
            uiStore.searchWindowOpened = false;
            if (window.innerWidth > 768) {
                nextTick(() => {
                    input.value.focus();
                });
            }
        }
    }
);
// #endregion
</script>

<style lang="scss">
.news-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__input {
        display: flex;
        align-items: center;
        gap: 10px;
        width: calc(min(100vw - 55px, 600px));
    }

    &__input-close,
    &__input-search {
        height: 30px;
        width: auto;
        cursor: pointer;
        color: color("second");
    }

    &__input-field {
        @include grey-input;
        width: 100%;
    }

    &__loading {
        margin: 10px auto;
    }

    &__list {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }

    &__more {
        margin: 10px auto;
    }
}
</style>
