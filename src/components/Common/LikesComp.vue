<template>
    <div class="likes-comp">
        <div class="likes-comp__group" @click="toggle('like')">
            <font-awesome-icon
                class="likes-comp__button"
                :class="{ 'likes-comp__button--user-liked': state.status.like }"
                icon="thumbs-up"
            />
            <div class="likes-comp__count">{{ state.count.like }}</div>
        </div>

        <div class="likes-comp__group" v-if="dislike != null" @click="toggle('dislike')">
            <font-awesome-icon
                class="likes-comp__button"
                :class="{ 'likes-comp__button--user-disliked': state.status.dislike }"
                icon="thumbs-down"
            />
            <div class="likes-comp__count">{{ state.count.dislike }}</div>
        </div>
        <ModalComp ref="refModal"></ModalComp>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
// composables
import { useLikesApi } from "@/composables/api/likes.js";
const api = useLikesApi();
// stores
import { useUser } from "@/stores";
const userStore = useUser();

const props = defineProps(["scope", "id", "like", "dislike", "user_like", "user_dislike"]);

const state = ref({
    count: {
        like: 0,
        dislike: 0,
    },
    status: {
        like: false,
        dislike: false,
    },
});
const refModal = ref(null);

function toggle(type) {
    if (state.value.status[type]) {
        remove(type);
    } else {
        set(type);
    }
}
async function set(type) {
    if (!userStore.loggedIn) {
        refModal.value.open({ type: "authorization_required" });
        return;
    }

    let success = await api.set(props.scope, type, props.id);
    if (success && !state.value.status[type]) {
        state.value.count[type]++;
        state.value.status[type] = true;

        oppositeActionIfNeeded(type);
    }
}
async function remove(type) {
    if (!userStore.loggedIn) {
        refModal.value.open({ type: "authorization_required" });
        return;
    }

    let success = await api.remove(props.scope, type, props.id);
    if (success && state.value.status[type]) {
        state.value.count[type]--;
        state.value.status[type] = false;
    }
}

async function checkStatusForUser(type) {
    if (props.scope === "news") {
        state.value.status[type] = await api.checkStatusForUser(props.scope, type, props.id);
    } else if (props.scope === "comment") {
        state.value.status[type] = type === "like" ? props.user_like : props.user_dislike;
    }
}

function oppositeActionIfNeeded(type) {
    if (props.scope === "comment") {
        let oppositeType = type === "like" ? "dislike" : "like";
        if (state.value.status[oppositeType]) {
            state.value.count[oppositeType]--;
            state.value.status[oppositeType] = false;
        }
    }
    return true;
}

watch(
    () => props.like,
    (newVal) => {
        state.value.count.like = Number(newVal);
    }
);

watch(
    () => props.dislike,
    (newVal) => {
        state.value.count.dislike = Number(newVal);
    }
);

onMounted(() => {
    state.value.count.like = Number(props.like);
    state.value.count.dislike = Number(props.dislike);

    if (props.like != null) {
        checkStatusForUser("like");
    }
    if (props.dislike != null) {
        checkStatusForUser("dislike");
    }
});
</script>

<style lang="scss">
.likes-comp {
    $p: &;

    display: flex;
    gap: 10px;

    &__group {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            #{$p}__button {
                color: color("second-hover");

                &--user-liked {
                    color: color("link-hover");
                }

                &--user-disliked {
                    color: color("warn-hover");
                }
            }
            #{$p}__count {
                color: color("second-hover");
            }
        }
    }

    &__button {
        margin-right: 5px;
        color: color("second");
        transition: color 0.18s ease;

        &--user-liked {
            color: color("link");
        }

        &--user-disliked {
            color: color("warn");
        }
    }

    &__count {
        color: color("second");
    }
}
</style>
