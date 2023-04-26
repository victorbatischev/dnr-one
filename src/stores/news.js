import { defineStore } from "pinia";
import { useNewsApi } from "@/composables/api/news";
const { fetchAllCategories, fetchAllTags } = useNewsApi();

export default defineStore("news", {
    state: () => {
        return {
            categories: [],
            tags: [],
            selectedCategoriesIds: [],
            selectedTagsIds: [],
            selectedDatesStart: 0,
            selectedDatesEnd: 0,
            onScreenPostsIds: [],
            filterNeeded: false,
            pageReseted: false,
            searchList: [],
        };
    },
    getters: {
        selectedCategories() {
            return this.categories.filter((x) => this.selectedCategoriesIds.includes(x.id));
        },
        selectedTags() {
            return this.tags.filter((x) => this.selectedTagsIds.includes(x.id));
        },
        possibleTags() {
            return this.selectedCategories?.length > 0
                ? [].concat.apply(
                      [],
                      this.selectedCategories.map((x) => x.tags)
                  )
                : [];
        },
    },
    actions: {
        async init() {
            this.categories = await fetchAllCategories();
            this.tags = await fetchAllTags();
        },

        addOnScreenPostId(id) {
            this.onScreenPostsIds = [...this.onScreenPostsIds, id].sort((a, b) => a - b);
        },

        removeOnScreenPostId(id) {
            this.onScreenPostsIds = this.onScreenPostsIds.filter((x) => x !== id);
        },

        resetFilters(values = {}) {
            this.selectedCategoriesIds = values.selectedCategoriesIds ?? [];
            this.selectedTagsIds = values.selectedTagsIds ?? [];
            this.selectedDatesStart = values.selectedDatesStart ?? 0;
            this.selectedDatesEnd = values.selectedDatesEnd ?? 0;
            this.pageReseted = true;
        },
    },
});
