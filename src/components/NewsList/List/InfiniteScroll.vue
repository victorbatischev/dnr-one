<template>
    <div class="infinite-scroll">
        <InfiniteScrollItem v-for="item in localList" :key="item.id" v-bind="item" />
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch, defineProps } from "vue";
// components
import InfiniteScrollItem from "@/components/NewsList/List/InfiniteScrollItem.vue";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();

const props = defineProps(["list"]);

const localList = ref([]);

const allPostsFetched = computed(() => localList.value.length > 0 && localList.value.every((x) => x.showed));

async function showPostIfNeeded() {
    let getNextIndexIfNeeded = () => {
        let lastOnscreenItemId = newsStore.onScreenPostsIds[newsStore.onScreenPostsIds.length - 1];
        let lastOnscreenItem = localList.value.find((x) => x.id === lastOnscreenItemId);
        if (lastOnscreenItem && lastOnscreenItem.showed && lastOnscreenItem.index < localList.value.length - 1) {
            let nextItemIndex = lastOnscreenItem.index + 1;

            if (!localList.value[nextItemIndex].showed) {
                return nextItemIndex;
            }
        }
        return -1;
    };

    for (;;) {
        if (allPostsFetched.value || localList.value.length === 0) break;

        let index = -1;

        if (newsStore.onScreenPostsIds.length === 0 && localList.value.every((x) => !x.showed)) {
            index = 0;
        } else {
            index = getNextIndexIfNeeded();
        }

        if (index > -1) {
            if (!localList.value[index]) break;

            localList.value[index].showed = true;
        } else break;
        await nextTick();
    }
}

onMounted(() => {
    localList.value = props.list;
});

watch(
    () => props.list,
    async (to) => {
        if (to.length > 20) {
            localList.value.push(...to.slice(localList.value.length).map((x) => ({ ...x, showed: false })));
        } else {
            localList.value = to.map((x) => ({ ...x, showed: false }));
        }
        await nextTick();
        showPostIfNeeded();
    },
    { deep: true }
);

watch(
    () => newsStore.onScreenPostsIds,
    () => {
        showPostIfNeeded();
    },
    { deep: true }
);
</script>

<style lang="scss"></style>
