<template>
    <div>
        <DateComp v-model:firstDate="firstDate" v-model:secondDate="secondDate" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const firstDate = ref(new Date());
const secondDate = ref(new Date());

watch(
    () => firstDate.value,
    () => {
        console.log("firstDate :>> ", firstDate.value);
    }
);
watch(
    () => secondDate.value,
    () => {
        console.log("secondDate :>> ", secondDate.value);
    }
);
</script>

<style lang="scss"></style>
