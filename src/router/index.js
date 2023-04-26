import { createRouter, createWebHistory } from "vue-router";
import NewsListContainer from "@/components/NewsList/NewsListContainer.vue";
const NewsPostContainer = () => import("@/components/NewsPost/NewsPostContainer.vue");
const SearchPageContainer = () => import("@/components/SearchPage/SearchPageContainer.vue");
const UserContainer = () => import("@/components/User/UserContainer.vue");
const UserPage = () => import("@/components/User/UserPage.vue");
const LoginRegisterPage = () => import("@/components/User/LoginRegisterPage.vue");
const PathNotFoundPage = () => import("@/components/Service/PathNotFoundPage.vue");
const TestsPolygon = () => import("@/components/TestsPolygon.vue");
import { useUser } from "@/stores";

const routes = [
    {
        path: "/",
        name: "News",
        meta: { title: "Новости" },
        component: NewsListContainer,
    },
    {
        path: "/post/:id(\\d+)",
        meta: { title: "" },
        component: NewsPostContainer,
        props: (route) => ({ id: Number(route.params.id) }),
    },
    {
        path: "/user",
        meta: { title: "Пользователь" },
        component: UserContainer,
        children: [
            {
                path: "",
                component: UserPage,
                meta: { title: "User" },
            },
            {
                path: "login",
                component: LoginRegisterPage,
                meta: { title: "Вход" },
                props: { type: "login" },
            },
            {
                path: "register",
                component: LoginRegisterPage,
                meta: { title: "Регистрация" },
                props: { type: "register" },
            },
        ],
    },
    {
        path: "/search",
        meta: { title: "Поиск" },
        component: SearchPageContainer,
    },
    {
        path: "/test",
        meta: { title: "Test" },
        component: TestsPolygon,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: PathNotFoundPage,
    },
];

// const scrollBehavior = (to) => {
//     if (to.hash) {

//         return { el: to.hash, behavior: "smooth" };
//     } else {
//         return { x: 0, y: 0 };
//     }
// };

const router = createRouter({
    history: createWebHistory(process.env.NODE_ENV === "test" ? "/dnr.one/" : "/"),
    routes,
    // scrollBehavior,
});

router.beforeEach((to, from) => {
    if (to.path === "/user") {
        if (!useUser().loggedIn) {
            return "/user/login";
        }
    } else if (to.path === "/user/login" || to.path === "/user/register") {
        if (useUser().loggedIn) {
            return "/user";
        }
    }
    if (to.meta.title !== from.meta.title) {
        if (to.meta.title) {
            document.title = `${to.meta.title} - DNR.ONE`;
        } else {
            document.title = `DNR.ONE`;
        }
    }
});

export default router;
