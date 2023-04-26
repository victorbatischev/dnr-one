<template>
    <div class="date-selector" :class="{ 'date-selector--showed': mainShowed }" v-click-outside="closeAll">
        <div class="date-selector__input-panel" @click.self="toggleMain">
            <span class="date-selector__label" @click.self="toggleMain">{{ displayedValue }}</span>
            <div class="date-selector__toggle" @click="toggleMain">
                <font-awesome-icon class="date-selector__toggle-icon" icon="chevron-down" />
            </div>
        </div>
        <Transition v-show="mainShowed" name="date-selector--transition">
            <ul class="date-selector__content">
                <li v-for="variant in variants" class="date-selector__item" :key="variant" @click="variant.callback()">
                    {{ variant.title }}
                </li>
            </ul>
        </Transition>
        <Transition v-show="dateCompWindowShowed" name="date-selector--transition">
            <DateCompWindow
                class="date-selector__calendar"
                v-model:firstDate="firstDate"
                v-model:secondDate="secondDate"
                ref="refDateCompWindow"
            />
        </Transition>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
// directives
import vClickOutside from "@/directives/ClickOutside";
// components
import DateCompWindow from "@/components/Ui/DateComp/DateCompWindow.vue";
// stores
import { useNews } from "@/stores";
const newsStore = useNews();

const firstDate = computed({
    get: () => new Date(newsStore.selectedDatesStart),
    set: (to) => {
        newsStore.selectedDatesStart = to.getTime();
    },
});
watch(
    () => firstDate.value,
    (to) => {
        if (to.getTime() === 0) {
            selectedVariant.value = "";
            closeDateCompWindow();
        }
    }
);

const secondDate = computed({
    get: () => new Date(newsStore.selectedDatesEnd),
    set: (to) => {
        newsStore.selectedDatesEnd = to.getTime();
    },
});

watch(
    () => secondDate.value,
    (to) => {
        if (to.getTime() !== 0 && selectedVariant.value === "select") {
            selectedVariant.value = "selected";
            closeDateCompWindow();
            emitFiltration();
        }
    }
);

const variants = [
    { title: "Всё время", name: "all", callback: () => setDates("all") },
    { title: "Неделя", name: "week", callback: () => setDates("week") },
    { title: "Месяц", name: "month", callback: () => setDates("month") },
    { title: "Год", name: "year", callback: () => setDates("year") },
    { title: "Выбрать период", name: "select", callback: () => setDates("select") },
];

function setDates(type) {
    let date = new Date();

    switch (type) {
        case "all":
            firstDate.value = new Date(0);
            secondDate.value = new Date(0);
            selectedVariant.value = "";
            emitFiltration();
            closeMain();
            break;
        case "week":
            date.setDate(date.getDate() - 7);
            firstDate.value = date;
            secondDate.value = new Date();
            selectedVariant.value = "week";
            emitFiltration();
            closeMain();
            break;
        case "month":
            date.setMonth(date.getMonth() - 1);
            firstDate.value = date;
            secondDate.value = new Date();
            selectedVariant.value = "month";
            emitFiltration();
            closeMain();
            break;
        case "year":
            date.setFullYear(date.getFullYear() - 1);
            firstDate.value = date;
            secondDate.value = new Date();
            selectedVariant.value = "year";
            emitFiltration();
            closeMain();
            break;
        case "select":
            firstDate.value = new Date();
            secondDate.value = new Date(0);
            selectedVariant.value = "select";
            openDateCompWindow();
            break;
    }
}

function dateToString(date) {
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function emitFiltration() {
    newsStore.filterNeeded = true;
}

// #region handling show states and showed values
const mainShowed = ref(false);
const dateCompWindowShowed = ref(false);
const placeholder = ref("Выберите период времени");
const selectedVariant = ref("");

function closeAll() {
    closeMain();
    closeDateCompWindow();
}

function toggleMain() {
    mainShowed.value ? closeMain() : openMain();
}

function openMain() {
    if (!mainShowed.value) {
        mainShowed.value = true;
        closeDateCompWindow();
    }
}

function closeMain() {
    mainShowed.value = false;
}

function openDateCompWindow() {
    closeMain();
    dateCompWindowShowed.value = true;
}
function closeDateCompWindow() {
    dateCompWindowShowed.value = false;
    if (selectedVariant.value === "Select") {
        selectedVariant.value = "";
    }
}

const displayedValue = computed(() => {
    if (selectedVariant.value === "selected") {
        return `${dateToString(firstDate.value)} - ${dateToString(secondDate.value)}`;
    } else if (selectedVariant.value !== "") {
        return variants.find((x) => x.name === selectedVariant.value).title;
    } else {
        return placeholder.value;
    }
});
// #endregion
</script>

<style lang="scss">
.date-selector {
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
        cursor: pointer;
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
        height: 176px;
        background: color("background");
        list-style: none;
        border: 2px solid color("border");
        overflow: auto;
    }

    &__item {
        padding: 5px 10px;
        cursor: pointer;
        color: color("main");

        &--selected {
            background: color("background-hover");
        }

        @media (min-width: $mobileWidth) {
            &:hover {
                background: color("background-hover");
            }
        }
    }

    &__calendar {
        margin: 0 auto;
    }

    &--showed {
        #{$p}__toggle {
            transform: rotate(180deg);
        }
    }

    &--transition,
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
</style>
