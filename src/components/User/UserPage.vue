<template>
    <div>
        <ButtonComp :value="'Logout'" @click="userStore.logout()" />
        <!-- <TabsNavigationComp>
            <TabComp :title="'Information'">111</TabComp>
        </TabsNavigationComp> -->
    </div>
</template>

<script setup>
import { watch } from "vue";
// router
import { useRouter } from "vue-router";
const router = useRouter();
// stores
import { useUser } from "@/stores";
const userStore = useUser();

watch(
    () => userStore.loggedIn,
    (to) => {
        if (!to) {
            router.push({ path: "/user/login" });
        }
    }
);
</script>

<style></style>
