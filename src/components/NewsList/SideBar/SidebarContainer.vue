<template>
    <aside class="sidebar wrap" :class="uiStore.sidebarOpened ? 'sidebar--opened' : ''">
        <Transition name="sidebar__closer--transition">
            <div class="sidebar__closer" v-show="uiStore.sidebarOpened" @click="uiStore.closeSidebar"></div>
        </Transition>
        <Transition name="sidebar__container--transition">
            <div class="sidebar__container" v-show="uiStore.sidebarOpened">
                <SidebarContent />
                <font-awesome-icon class="sidebar__close-icon" icon="xmark" @click="uiStore.closeSidebar" />
            </div>
        </Transition>
    </aside>
</template>
<script setup>
import SidebarContent from "@/components/NewsList/SideBar/SidebarContent.vue";
// stores
import { useUi } from "@/stores";
const uiStore = useUi();
</script>
<style lang="scss">
.sidebar {
    $p: &;
    position: fixed;
    top: 48px;
    max-height: calc(100vh - 53px);
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
    z-index: 70;

    &__container {
        position: relative;
        width: 350px;
        right: 0;
        padding: 11px 10px;
        pointer-events: all;
        background: color("background");
        overflow: auto;
        border: 2px solid color("border");

        @media (max-width: $mobileWidth) {
            width: 100%;
        }

        &--transition {
            &-enter-active,
            &-leave-active {
                transition: 0.2s;
            }
            &-enter-from,
            &-leave-to {
                right: -106%;
                opacity: 0;
            }
        }
    }

    &__closer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        pointer-events: all;

        &--transition {
            &-enter-active,
            &-leave-active {
                transition: 0.2s;
            }
            &-enter-from,
            &-leave-to {
                opacity: 0;
            }
        }
    }

    &__close-icon {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 25px;
        height: 25px;
        color: color("second");
        cursor: pointer;
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }
}
</style>
