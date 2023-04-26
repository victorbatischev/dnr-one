<template>
    <div class="comment-item">
        <div class="comment-item__header">
            <div class="comment-item__username">{{ username }}</div>
            <font-awesome-icon class="comment-item__remove" icon="xmark" v-if="userPosted" @click="emitRemoveComments()" />
        </div>
        <div class="comment-item__body">{{ comment_body }}</div>
        <LikesComp :scope="'comment'" :id="id" :like="like" :dislike="dislike" :user_like="user_like" :user_dislike="user_dislike" />
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
// components
import LikesComp from "@/components/Common/LikesComp.vue";
// stores
import { useUser } from "@/stores";
const userStore = useUser();

const props = defineProps(["id", "username", "comment_body", "like", "dislike", "user_like", "user_dislike"]);

const userPosted = computed(() => userStore.username === props.username);

const emit = defineEmits(["remove_comment"]);

function emitRemoveComments() {
    emit("remove_comment", props.id);
}
</script>

<style lang="scss">
.comment-item {
    $p: &;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 15px;
    border-bottom: 1px solid color("border");

    &:hover {
        #{$p}__remove {
            opacity: 1;
        }
    }

    &__header {
        display: flex;
        align-items: center;
        line-height: normal;
        font-size: 13px;
    }

    &__username {
        text-transform: uppercase;
        line-height: 14px;
        font-weight: 700;
        color: color("link");
    }

    &__remove {
        width: 25px;
        height: 14px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.18s ease;
    }

    &__body {
    }
}
</style>
