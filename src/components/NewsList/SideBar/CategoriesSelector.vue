<template>
    <div class="categories-selector" :class="{ 'categories-selector--active': active }" v-click-outside="deactivate">
        <div class="categories-selector__input-panel" @click.self="activate">
            <span class="categories-selector__label" @click.self="activate">{{ label }}</span>
            <input class="categories-selector__input" :placeholder="placeholder" ref="refInput" v-model="filter" />
            <div class="categories-selector__toggle" @click="toggleActivation">
                <font-awesome-icon class="categories-selector__toggle-icon" icon="chevron-down" />
            </div>
        </div>
        <Transition v-show="active" name="categories-selector__content--transition-content">
            <ul class="categories-selector__content" :style="styleHeight">
                <li
                    v-for="category in categoriesFiltered"
                    class="categories-selector__item"
                    :class="newsStore.selectedCategoriesIds.includes(category.id) ? 'categories-selector__item--selected' : ''"
                    :key="category.id"
                    @click="toggleSelection(category.id)"
                >
                    {{ category.title }}
                </li>
                <li class="categories-selector__no-items" v-show="categoriesFiltered.length === 0">Категорий не найдено</li>
            </ul>
        </Transition>
    </div>
</template>
<script setup>
import { computed, nextTick, ref } from "vue";
// directives
import vClickOutside from "@/directives/ClickOutside";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();

const active = ref(false);
const placeholder = ref("Выберите категории");
const filter = ref("");

const styleHeight = computed(() => ({
    "--height": (newsStore.categories.length > 5 ? 200 : 34.4 * newsStore.categories.length + 4) + "px",
}));

const refInput = ref(null);

const categoriesFiltered = computed(() => newsStore.categories.filter((x) => x.title.includes(filter.value)));
const label = computed(() => {
    const length = newsStore.selectedCategoriesIds.length;
    if (length === 1) {
        return `1 категория выбрана`;
    } else if (length > 1 && length <= 4) {
        return `${length} категории выбрано`;
    } else if (length > 4) {
        return `${length} категорий выбрано`;
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
    if (newsStore.selectedCategoriesIds.includes(id)) {
        newsStore.selectedCategoriesIds = newsStore.selectedCategoriesIds.filter((x) => x !== id);
    } else {
        newsStore.selectedCategoriesIds = [...newsStore.selectedCategoriesIds, id];
    }
    newsStore.filterNeeded = true;
}
</script>
<style lang="scss">
.categories-selector {
    $p: &;
    position: relative;

    &__input-panel {
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 0 10px;
        color: color("main");
        border: 2px solid color("border");
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
    }

    &__input {
        display: none;
        width: 100%;
        height: 100%;
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
