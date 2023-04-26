<template>
    <div>
        <FixedListItem v-for="item in props.list" :key="item.id" v-bind="item" />
    </div>
</template>

<script setup>
// components
import FixedListItem from "@/components/NewsList/List/FixedListItem.vue";

import { defineProps } from "vue";

const props = defineProps(["list"]);
</script>

<style lang="scss"></style>
