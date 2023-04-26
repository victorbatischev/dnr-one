<template>
    <Transition name="tags-selector--transition">
        <div
            class="tags-selector"
            v-if="newsStore.possibleTags.length > 0"
            :class="{ 'tags-selector--active': active }"
            v-click-outside="deactivate"
        >
            <div class="tags-selector__input-panel" @click.self="activate">
                <ul class="tags-selector__selected-list" v-show="tagsSelected.length > 0" @click.self="activate">
                    <li v-for="tag in tagsSelected" class="tags-selector__selected-item" :key="tag.id">
                        <div class="tags-selector__selected-item-text">{{ tag.title }}</div>
                        <font-awesome-icon class="tags-selector__selected-item-icon" icon="xmark" @click="toggleSelection(tag.id)" />
                    </li>
                </ul>

                <div class="tags-selector__input-container" v-show="tagsSelected.length === 0 || active" @click.self="activate">
                    <div class="tags-selector__label" @click.self="activate">{{ label }}</div>
                    <input class="tags-selector__input" :placeholder="placeholder" ref="refInput" v-model="filter" />
                </div>
                <div class="tags-selector__toggle" @click="toggleActivation">
                    <font-awesome-icon class="tags-selector__toggle-icon" icon="chevron-down" />
                </div>
            </div>

            <Transition v-show="active" name="tags-selector__content--transition-content">
                <ul class="tags-selector__content" :style="styleHeight">
                    <li
                        v-for="tag in tagsFiltered"
                        class="tags-selector__item"
                        :class="newsStore.selectedTagsIds.includes(tag.id) ? 'tags-selector__item--selected' : ''"
                        :key="tag.id"
                        @click="toggleSelection(tag.id)"
                    >
                        {{ tag.title }}
                    </li>
                    <li class="tags-selector__no-items" v-show="tagsFiltered.length === 0">Тегов не найдено</li>
                </ul>
            </Transition>
        </div>
    </Transition>
</template>
<script setup>
import { computed, nextTick, ref } from "vue";
// directives
import vClickOutside from "@/directives/ClickOutside";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();

const active = ref(false);
const placeholder = ref("Выберите теги");
const filter = ref("");

const styleHeight = computed(() => ({
    "--height": (newsStore.possibleTags.length > 5 ? 200 : 34.4 * newsStore.possibleTags.length + 4) + "px",
}));
const tagsFiltered = computed(() => newsStore.possibleTags.filter((x) => x.title.includes(filter.value)));
const tagsSelected = computed(() => newsStore.possibleTags.filter((x) => newsStore.selectedTagsIds.includes(x.id)));

const refInput = ref(null);

const label = computed(() => {
    if (newsStore.selectedTagsIds.length > 0) {
        return "";
    } else {
        return placeholder.value;
    }
});

function activate() {
    if (!active.value) {
        active.value = true;

        if (window.innerWidth > 768) {
            nextTick(() => {
                refInput.value.focus();
            });
        }
    }
}
function deactivate() {
    active.value = false;
}
function toggleActivation() {
    active.value ? deactivate() : activate();
}

function toggleSelection(id) {
    if (newsStore.selectedTagsIds.includes(id)) {
        newsStore.selectedTagsIds = newsStore.selectedTagsIds.filter((x) => x !== id);
    } else {
        newsStore.selectedTagsIds = [...newsStore.selectedTagsIds, id];
    }
    newsStore.filterNeeded = true;
}
</script>
<style lang="scss">
.tags-selector {
    $p: &;
    position: relative;

    &__selected-list {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin: 5.62px 0;
        list-style: none;
    }

    &__selected-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 0 4px;
        border: 1px solid color("border");

        &-icon {
            cursor: pointer;

            &:hover {
                color: color("second-hover");
            }
        }
    }

    &__input-panel {
        position: relative;
        width: 100%;
        min-height: 40px;
        padding: 0 10px;
        color: color("main");
        border: 2px solid color("border");
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
    }

    &__input-container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        height: 36px;
    }

    &__label {
    }

    &__input {
        display: none;
        width: 100%;
        height: 100%;
        margin: 9px 0;
        background: color("background");
        color: color("main");
        outline: none;
        border: none;
        font-size: 14px;

        &::placeholder {
            color: color("second");
            font-family: "Montserrat", sans-serif;
        }
    }

    &__toggle {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 7px;
        top: 7px;
        transition: transform 0.2s ease;

        &-icon {
            width: 100%;
            height: 100%;
        }
    }

    &__content {
        position: relative;
        width: 100%;
        height: var(--height);
        background: color("background");
        list-style: none;
        border: 2px solid color("border");
        overflow: auto;

        &--transition-content,
        &--transition-list {
            &-enter-active,
            &-leave-active {
                transition: height 0.18s;
                overflow-y: hidden;
            }
            &-enter-from,
            &-leave-to {
                height: 0;
            }
        }
    }

    &__item {
        padding: 5px 10px;
        cursor: pointer;
        color: color("main");

        &--selected {
            background: color("background-hover");
        }

        @media (min-width: $mobileWidth) {
            &--selected {
                &:hover {
                    background: color("background-hover", $saturation: 20%);
                }
            }

            &:not(&--selected) {
                &:hover {
                    background: color("background-hover", $hue: 120deg, $saturation: 20%);
                }
            }
        }
    }

    &__no-items {
        padding: 5px 10px;
    }

    &--active {
        #{$p}__input {
            display: block;
        }
        #{$p}__label {
            display: none;
        }
        #{$p}__toggle {
            transform: rotate(180deg);
        }
    }
}
</style>
