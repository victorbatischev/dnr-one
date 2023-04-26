<template>
    <div class="post-meta">
        <div class="post-meta__date" v-if="published_date">{{ date }}</div>

        <div class="post-meta__categories" v-if="category && category.length > 0">
            <div class="post-meta__categories-item">
                <LinkComp :to="`/?categories=${category?.[0]?.id}`" class="post-meta__categories-item-link" @click.prevent="setCategory">
                    {{ category?.[0]?.title }}
                </LinkComp>
            </div>
        </div>

        <div class="post-meta__tags" v-if="tags && tags.length > 0">
            <template v-for="tag in tags" :key="tag">
                <div class="post-meta__tags-item" :class="{ 'post-meta__tags-item--active': newsStore.selectedTagsIds.includes(tag.id) }">
                    <LinkComp
                        class="post-meta__tags-item-link"
                        :to="`/?categories=${category?.[0]?.id}&tags=${tag.id}`"
                        @click.prevent="setTag(tag.id)"
                    >
                        {{ tag.title }}
                    </LinkComp>
                    <font-awesome-icon
                        class="post-meta__tags-item-icon"
                        icon="plus"
                        v-if="!newsStore.selectedTagsIds.includes(tag.id)"
                        @click.prevent="addTag(tag.id)"
                    />
                    <font-awesome-icon class="post-meta__tags-item-icon" icon="xmark" v-else @click.prevent="removeTag(tag.id)" />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, nextTick } from "vue";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();
// router
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps(["id", "category", "tags", "published_date"]);

const date = computed(() => {
    if (props.published_date) {
        let date = new Date(props.published_date * 1000);
        return date.toISOString().replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/, "$4:$5 $3.$2.$1");
    }
    return "";
});

function setCategory() {
    newsStore.resetFilters({ selectedCategoriesIds: [props.category[0].id] });
    nextTick(() => router.push(`/?categories=${props.category[0].id}`));
}

function setTag(tagId) {
    newsStore.resetFilters({ selectedCategoriesIds: [props.category[0].id], selectedTagsIds: [tagId] });
    nextTick(() => router.push(`/?categories=${props.category[0].id}&tags=${tagId}`));
}

function addTag(tagId) {
    if (newsStore.selectedCategoriesIds.length === 0) {
        setTag(tagId);
    } else {
        newsStore.selectedTagsIds.push(tagId);
        newsStore.pageReseted = true;
        nextTick(() =>
            router.push(`/?categories=${newsStore.selectedCategoriesIds.join(",")}&tags=${newsStore.selectedTagsIds.join(",")}`)
        );
    }
}

function removeTag(tagId) {
    newsStore.selectedTagsIds = newsStore.selectedTagsIds.filter((x) => x !== tagId);
    newsStore.pageReseted = true;
    nextTick(() => router.push(`/?categories=${newsStore.selectedCategoriesIds.join(",")}&tags=${newsStore.selectedTagsIds.join(",")}`));
}
</script>

<style lang="scss">
.post-meta {
    $p: &;

    display: flex;
    flex-direction: column;
    gap: 3px;
    color: color("second");
    font-size: 12px;

    &__tags {
        display: flex;
        gap: 6px;
    }

    &__categories-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        //padding: 2px 6px;
        //border: 1px solid color("link");
        //border-radius: 3px;

        // &:hover {
        //     border: 1px solid color("link-hover");
        // }
    }

    &__tags-item {
        display: inline-flex;
        align-items: center;
        gap: 3px;

        &:not(&--active) {
            #{$p}__tags-item-link {
                color: color("main");
            }
        }
    }

    &__tags-item-icon {
        color: color("second");
        cursor: pointer;
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }

    &__tags-item-link {
        &:hover {
            color: color("second") !important;
        }
    }
}
</style>
