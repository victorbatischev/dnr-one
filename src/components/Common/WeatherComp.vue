<template>
    <div class="weather" v-if="weather.name">
        <img class="weather__icon" :src="icon" />
        <div class="weather__info">
            <div class="weather__data">{{ city }}</div>
            <div class="weather__data">{{ temperature }}°C</div>
        </div>
    </div>
</template>

<script setup>
import useWeather from "@/composables/weather";
import { computed } from "vue";

const { weather } = useWeather;
const city = computed(() => weather.value.name);
const icon = computed(() => (weather.value.weather ? `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}.png` : ""));
const temperature = computed(() => weather.value.main?.temp | 0);
</script>

<style lang="scss">
.weather {
    display: flex;
    height: 100%;
    align-items: center;

    &__icon {
        height: 100%;
    }

    &__info {
        display: flex;
    }

    &__data {
        margin-left: 5px;
    }
}
</style>
