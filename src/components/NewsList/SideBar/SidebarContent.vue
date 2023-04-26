<template>
    <div class="sidebar-content">
        <div class="sidebar-content__header">
            <div class="sidebar-content__header-text">Фильтры:</div>
            <div class="sidebar-content__reset" v-show="resetShowed" @click="resetFilters()">сбросить фильтры</div>
        </div>

        <DateSelector />
        <CategoriesSelector />
        <TagsSelector />
    </div>
</template>
<script setup>
import { computed } from "vue";
// components
import CategoriesSelector from "@/components/NewsList/SideBar/CategoriesSelector.vue";
import TagsSelector from "@/components/NewsList/SideBar/TagsSelector.vue";
import DateSelector from "@/components/NewsList/SideBar/DateSelector.vue";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();

const resetShowed = computed(
    () => newsStore.selectedCategoriesIds.length > 0 || newsStore.selectedTagsIds.length > 0 || newsStore.selectedDatesEnd > 0
);

function resetFilters() {
    newsStore.selectedCategoriesIds = [];
    newsStore.selectedTagsIds = [];
    newsStore.selectedDatesStart = 0;
    newsStore.selectedDatesEnd = 0;
    newsStore.filterNeeded = true;
}
</script>
<style lang="scss">
.sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__header {
        display: flex;
        gap: 20px;
        line-height: normal;
        width: 85%;
    }

    &__header-text {
        flex: 1;
    }

    &__reset {
        cursor: pointer;
        transition: color 0.18s ease;

        &:hover {
            color: color("second");
        }
    }
}
</style>
