<template>
    <Transition name="modal-comp--transition">
        <div class="modal-comp" v-if="state.opened" :style="positionStyle" @click="close()">
            <div class="modal-comp__container" @click.stop>
                <slot />
                <div v-if="state.type === 'authorization_required'">
                    You need to
                    <LinkComp to="/user/login">authorize</LinkComp>
                    or
                    <LinkComp to="/user/register">register</LinkComp>
                    to do this action
                </div>
                <div class="modal-comp__buttons" v-if="state.type === 'yes_no'">
                    <ButtonComp @click="returnResult(true)" :value="'Yes'"></ButtonComp>
                    <ButtonComp @click="returnResult(false)" :value="'No'"></ButtonComp>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, defineEmits, defineExpose, computed } from "vue";

const state = ref({ opened: false, type: "", position: "center" });
const outerData = ref(null);
const positionStyle = computed(() => ({
    "--align-items": state.value.position === "top" ? "flex-start" : state.value.position === "bottom" ? "flex-end" : "center",
}));

const emit = defineEmits(["result"]);

function open({ type = "", position = "center", data = null } = {}) {
    state.value.type = type;
    state.value.position = position;
    outerData.value = data;
    state.value.opened = true;
    document.body.classList.add("body--modal-opened");
}

function close() {
    state.value.opened = false;
    setTimeout(() => {
        document.body.classList.remove("body--modal-opened");
    }, 180);
}
defineExpose({ open, close });

function returnResult(result) {
    emit("result", { success: result, data: outerData.value });
    close();
}
</script>

<style lang="scss">
.modal-comp {
    display: flex;
    position: fixed;
    justify-content: center;
    align-items: var(--align-items);
    inset: 0;
    padding: 48px 10px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
    overflow-y: auto;

    &__container {
        padding: 15px;
        background: color("background");
        border: 2px solid color("border");
    }

    &__buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    &--transition {
        &-enter-active,
        &-leave-active {
            transition: opacity 0.18s ease;
        }
        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }
}
</style>
