<template>
    <div class="date-comp" v-click-outside="closeWindow" ref="refRoot">
        <div class="date-comp__input" @click="openWindow">{{ displayedValue }}</div>
        <Transition name="date-comp__window--transition">
            <DateCompWindow
                v-show="windowShowed"
                class="date-comp__window"
                v-model:firstDate="firstDateHandler"
                v-model:secondDate="secondDateHandler"
                ref="refDateCompWindow"
                :style="windowPosition"
            />
        </Transition>
    </div>
</template>

<script setup>
import { computed, defineProps, ref, defineEmits } from "vue";
// components
import DateCompWindow from "./DateCompWindow.vue";
// directives
import vClickOutside from "@/directives/ClickOutside";

const emit = defineEmits(["update:firstDate", "update:secondDate"]);
const props = defineProps({ firstDate: Date, secondDate: Date });

const firstDateHandler = computed({
    get: () => props.firstDate,
    set: (to) => {
        emit("update:firstDate", to);
        closeWindow();
    },
});
const secondDateHandler = computed({
    get: () => props.secondDate,
    set: (to) => {
        emit("update:secondDate", to);
    },
});

const displayedValue = computed(() => {
    let date = `${props.firstDate.getDate()}.${props.firstDate.getMonth()}.${props.firstDate.getFullYear()}`;
    date += "-";
    date += `${props.secondDate.getDate()}.${props.secondDate.getMonth()}.${props.secondDate.getFullYear()}`;
    return date;
});

const refRoot = ref(null);
const refDateCompWindow = ref(null);
const windowShowed = ref(false);
const windowPosition = ref({});

function openWindow() {
    refDateCompWindow.value.init();
    computeWindowPosition();
    windowShowed.value = true;
}

function closeWindow() {
    windowShowed.value = false;
}

function computeWindowPosition() {
    const left = refRoot.value.getBoundingClientRect().left;
    const width = refRoot.value.offsetWidth;
    const right = refRoot.value.getBoundingClientRect().right;

    if (left + width / 2 < 240 / 2) {
        windowPosition.value = { left: 240 / 2 - left + 5 + "px" };
    } else if (right + width / 2 < 240 / 2) {
        windowPosition.value = { right: 240 / 2 - right + 5 + "px" };
    } else {
        windowPosition.value = { left: width / 2 + "px" };
    }
}
</script>

<style lang="scss">
.date-comp {
    position: relative;
    display: inline;
    user-select: none;
    width: 138px;

    &__input {
        display: inline;

        &-field {
            text-align: center;
        }
    }

    &__window {
        position: absolute;
        top: 24px;
        z-index: 10;
        transform: translateX(-50%);

        &--transition {
            &-enter-active,
            &-leave-active {
                transition: opacity 0.08s ease, margin 0.08s linear;
            }
            &-enter-from,
            &-leave-to {
                opacity: 0;
                margin-top: -5px;
            }
        }
    }
}
</style>
