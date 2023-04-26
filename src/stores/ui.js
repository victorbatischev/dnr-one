import { defineStore } from "pinia";

export default defineStore("ui", {
    state: () => {
        return {
            mobileMenuOpened: false,
            sidebarOpened: false,
            searchWindowOpened: false,
        };
    },
    actions: {
        openMobileMenu() {
            this.mobileMenuOpened = true;
        },
        closeMobileMenu() {
            this.mobileMenuOpened = false;
        },

        openSidebar() {
            this.sidebarOpened = true;
        },
        closeSidebar() {
            this.sidebarOpened = false;
        },

        openSearchWindow() {
            this.searchWindowOpened = true;
        },
        closeSearchWindow() {
            this.searchWindowOpened = false;
        },
    },
});
