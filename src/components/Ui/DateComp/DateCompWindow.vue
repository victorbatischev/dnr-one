<template>
    <div class="date-comp-window">
        <div class="date-comp-window__header">
            <div class="date-comp-window__header-item" @click="prevMonth()">
                <font-awesome-icon class="date-comp-window__header-item-caret" icon="chevron-left" />
            </div>
            <div
                class="date-comp-window__header-item"
                :class="{ 'date-comp-window__header-item--active': showState.month }"
                @click="toggleMonth()"
            >
                {{ months[localDate[current].month - 1] }}
                <font-awesome-icon class="date-comp-window__header-item-caret" icon="chevron-down" />
            </div>
            <div
                class="date-comp-window__header-item"
                :class="{ 'date-comp-window__header-item--active': showState.year }"
                @click="toggleYear()"
            >
                {{ localDate[current].year }}
                <font-awesome-icon class="date-comp-window__header-item-caret" icon="chevron-down" />
            </div>
            <div class="date-comp-window__header-item" @click="nextMonth()">
                <font-awesome-icon class="date-comp-window__header-item-caret" icon="chevron-right" />
            </div>
        </div>

        <div class="date-comp-window__day" v-show="showState.day">
            <div class="date-comp-window__day-head" v-for="weekday in weekdays" :key="weekday">
                {{ weekday }}
            </div>
            <div
                class="date-comp-window__day-item"
                v-for="(day, index) in displayedDays"
                :key="index"
                :class="getClassModifiers(day)"
                @click="selectDay(day)"
                @mouseenter="setDayHovered(day, true)"
                @mouseleave="setDayHovered(day, false)"
            >
                {{ day.day }}
            </div>
        </div>

        <div class="date-comp-window__select" v-show="showState.month">
            <div
                class="date-comp-window__select-item"
                v-for="(month, index) in months"
                :key="month"
                :class="{ 'date-comp-window__select-item--selected': index + 1 === localDate[current].month }"
                @click="selectMonth(index + 1)"
            >
                {{ month }}
            </div>
        </div>

        <div class="date-comp-window__select" v-show="showState.year">
            <div
                class="date-comp-window__select-item"
                v-for="year in years"
                :key="year"
                :class="{ 'date-comp-window__select-item--selected': year === localDate[current].year }"
                :ref="
                    (el) => {
                        if (year === localDate[current].year) refYear = el;
                    }
                "
                @click="selectYear(year)"
            >
                {{ year }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, ref, defineProps, defineEmits, defineExpose, onMounted, watch } from "vue";

class DateObj {
    constructor(date = new Date()) {
        this.date = date;
    }
    get day() {
        return this._date.getDate();
    }
    set day(value) {
        this._date.setDate(value);
    }
    get month() {
        return this._date.getMonth() + 1;
    }
    set month(value) {
        this._date.setMonth(value - 1, 1);
    }
    get year() {
        return this._date.getFullYear();
    }
    set year(value) {
        this._date.setFullYear(value);
    }
    get date() {
        return this._date;
    }
    set date(value) {
        this._date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    toString() {
        return `${(this.day < 10 ? "0" : "") + this.day}.${(this.month < 10 ? "0" : "") + this.month}.${this.year}`;
    }
}
const localDate = ref({
    first: new DateObj(),
    second: new DateObj(),
});
const outerDate = ref({
    first: new DateObj(),
    second: new DateObj(),
});

const emit = defineEmits(["update:firstDate", "update:secondDate"]);
const props = defineProps({ firstDate: { type: Date, default: new Date() }, secondDate: { type: Date } });

const twoDatesMode = ref(false);
const current = ref("first");

onMounted(() => {
    init();
});

function init() {
    current.value = "first";

    outerDate.value.first.date = props.firstDate;
    localDate.value.first.date = props.firstDate.getTime() === 0 ? new Date() : props.firstDate;

    if (props.secondDate != null) {
        twoDatesMode.value = true;
        outerDate.value.second.date = props.secondDate;
        localDate.value.second.date = props.secondDate.getTime() === 0 ? new Date() : props.secondDate;
    }
}
defineExpose({ init });

function selectDay(day) {
    if (!twoDatesMode.value) {
        localDate.value.first.date = day.date;
        emit("update:firstDate", localDate.value.first.date);
    } else if (current.value === "first") {
        localDate.value.first.date = day.date;
        localDate.value.second.date = day.date;
        current.value = "second";
    } else {
        if (day.date.getTime() >= localDate.value.first.date.getTime()) {
            localDate.value.second.date = day.date;
        } else {
            localDate.value.second.date = localDate.value.first.date;
            localDate.value.first.date = day.date;
        }
        emit("update:firstDate", localDate.value.first.date);
        emit("update:secondDate", localDate.value.second.date);
        current.value = "first";
    }
}
function selectMonth(month) {
    localDate.value[current.value].month = month;
    showState.value.month = false;
}
function selectYear(year) {
    localDate.value[current.value].year = year;
    showState.value.year = false;
}
watch(
    () => props.firstDate,
    () => {
        init();
        outerDate.value.first.date = props.firstDate;
        localDate.value.first.date = props.firstDate.getTime() === 0 ? new Date() : props.firstDate;
    }
);
watch(
    () => props.secondDate,
    () => {
        outerDate.value.second.date = props.secondDate;
        localDate.value.second.date = props.secondDate.getTime() === 0 ? new Date() : props.secondDate;
    }
);

// #region handling navigation and show states
const showState = ref({
    _month: false,
    _year: false,
    get day() {
        return !this.month && !this.year;
    },
    get month() {
        return this._month;
    },
    get year() {
        return this._year;
    },
    set month(value) {
        this._month = value;
        this._year = false;
    },
    set year(value) {
        this._year = value;
        this._month = false;
    },
});

function toggleMonth() {
    showState.value.month = !showState.value.month;
}

const refYear = ref(null);
function toggleYear() {
    showState.value.year = !showState.value.year;

    if (showState.value.year) {
        nextTick(() => {
            refYear.value.parentNode.scrollTop = refYear.value.offsetTop - 110;
        });
    }
}

function prevMonth() {
    localDate.value[current.value].month--;
}

function nextMonth() {
    localDate.value[current.value].month++;
}
// #endregion

// #region handling window displayed dates
const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const years = new Array(2099 - 1970).fill().map((d, i) => i + 1970);

const dayHovered = ref(null);

function setDayHovered(day, hovered) {
    if (hovered) {
        dayHovered.value = day;
    } else {
        dayHovered.value = null;
    }
}

const displayedDays = computed(() => {
    let offset;
    for (let i = 1; ; i++) {
        if (new Date(localDate.value[current.value].year, localDate.value[current.value].month - 1, 0 - i).getDay() === 1) {
            offset = i;
            break;
        }
    }
    let days = [];
    for (let i = 0; i < 42; i++) {
        let dateObj = new DateObj(new Date(localDate.value[current.value].year, localDate.value[current.value].month - 1, i - offset));

        days.push(dateObj);
    }
    return days;
});

function getClassModifiers(dateObj) {
    let monthPeriod =
        dateObj.month < localDate.value[current.value].month
            ? "prev"
            : dateObj.month > localDate.value[current.value].month
            ? "next"
            : "curr";
    let selected, border;
    if (!twoDatesMode.value) {
        selected = dateObj.date.getTime() === outerDate.value.first.date.getTime();
        border = selected;
    } else if (current.value === "first") {
        selected =
            dateObj.date.getTime() >= outerDate.value.first.date.getTime() &&
            dateObj.date.getTime() <= outerDate.value.second.date.getTime();
        border =
            dateObj.date.getTime() === outerDate.value.first.date.getTime() ||
            dateObj.date.getTime() === outerDate.value.second.date.getTime();
    } else {
        if (!dayHovered.value) {
            selected = dateObj.date.getTime() === localDate.value.first.date.getTime();
            border = selected;
        } else {
            if (dayHovered.value.date.getTime() >= localDate.value.first.date.getTime()) {
                selected =
                    dateObj.date.getTime() >= localDate.value.first.date.getTime() &&
                    dateObj.date.getTime() <= dayHovered.value.date.getTime();
            } else {
                selected =
                    dateObj.date.getTime() >= dayHovered.value.date.getTime() &&
                    dateObj.date.getTime() <= localDate.value.first.date.getTime();
            }
            border =
                dateObj.date.getTime() === localDate.value.first.date.getTime() ||
                dateObj.date.getTime() === dayHovered.value.date.getTime();
        }
    }
    return {
        "date-comp-window__day-item--selected": selected,
        "date-comp-window__day-item--border": border,
        "date-comp-window__day-item--prev": monthPeriod === "prev",
        "date-comp-window__day-item--next": monthPeriod === "next",
    };
}
// #endregion
</script>

<style lang="scss">
.date-comp-window {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 240px;
    height: 240px;
    background: color("background");
    border: 2px solid color("border");

    &__header {
        display: flex;

        &-item {
            $i: &;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            &-caret {
                margin-left: 6px;
                transition: transform 0.18s ease;
            }

            &--active {
                #{$i}-caret {
                    transform: rotate(180deg);
                }
            }
        }
    }

    &__day {
        display: flex;
        flex-wrap: wrap;
        flex: 1;

        &-head {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 14%;
        }

        &-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 14%;
            cursor: pointer;
            transition: background-color 0.18s ease;

            &:hover {
                background: color("border");
            }

            &--selected {
                background: color("background-hover");
            }

            &--border {
                background: color("second", $alpha: -0.6);
            }

            &--prev,
            &--next {
                color: hsl(0, 0%, 50%);
            }
        }
    }

    &__select {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        height: 230px;

        overflow-y: auto;

        &-item {
            flex: 1 0 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30%;
            min-height: 20%;
            cursor: pointer;
            transition: background-color 0.18s ease;

            &:hover {
                background: color("border");
            }

            &--selected {
                background: color("background-hover");

                &:hover {
                    background: color("background-hover");
                }
            }
        }
    }
}
</style>
