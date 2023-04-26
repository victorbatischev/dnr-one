<template>
    <div class="news-comments" ref="refRoot">
        <div class="news-comments__header" ref="refHeader">
            <HeaderComp class="news-comments__title">{{ commentsTitle }}</HeaderComp>
            <div class="news-comments__navigation">
                <div class="news-comments__navigation-container" :class="{ 'news-comments__navigation-container--fixed': navigationFixed }">
                    <div
                        class="news-comments__navigation-item"
                        v-if="displayedNavigationPages.length > 0 && displayedNavigationPages[0] !== 1"
                        @click="loadFirstPage()"
                    >
                        «
                    </div>
                    <div
                        class="news-comments__navigation-item"
                        :class="{ 'news-comments__navigation-item--current': page === currentPage }"
                        v-for="page in displayedNavigationPages"
                        :key="page"
                        @click="changePage(page)"
                    >
                        {{ page }}
                    </div>
                    <div
                        class="news-comments__navigation-item"
                        v-if="
                            displayedNavigationPages.length > 0 &&
                            displayedNavigationPages[displayedNavigationPages.length - 1] !== meta.pageCount
                        "
                        @click="loadLastPage()"
                    >
                        »
                    </div>
                </div>
            </div>
        </div>

        <div class="news-comments__page" v-for="page in commentsPages" :key="page" :ref="(el) => pageWasLoaded(el, page)">
            <div class="news-comments__list">
                <CommentsListItem
                    v-for="comment in page.comments"
                    :key="comment.id"
                    v-bind="comment"
                    @remove_comment="openRemoveCommentConfirmation"
                />
            </div>
        </div>
        <ButtonComp
            class="news-comments__expand"
            v-if="!allCommentsLoaded && !loading"
            :value="'load more'"
            @click="loadNextPage()"
        ></ButtonComp>
        <LoadingComp class="news-comments__loading" v-if="loading" />

        <div class="news-comments__add">
            <textarea class="news-comments__input" v-model="newCommentBody" placeholder="Add comment"></textarea>
            <div class="news-comments__add-bottom">
                <ButtonComp :value="'submit'" @click="sendComment()" :disabled="sendingComment" />
                <div class="news-comments__add-error">{{ error }}</div>
            </div>
        </div>

        <ModalComp ref="modal" @result="tryRemoveComment">
            <div>Are you realy want to remove comment?</div>
        </ModalComp>
        <ModalComp ref="refModal"></ModalComp>
    </div>
</template>

<script setup>
import { ref, defineProps, computed, onMounted, watch } from "vue";
// components
import CommentsListItem from "@/components/NewsPost/Comments/CommentsListItem.vue";
// composables
import { useCommentsApi } from "@/composables/api/comments";
const api = useCommentsApi();
// router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// stores
import { useUser } from "@/stores";
const userStore = useUser();
// init
const props = defineProps(["id"]);

const commentsPages = ref([]);
const meta = ref({
    totalCount: 0,
    pageCount: 0,
});

onMounted(() => {
    commentsPages.value = [];
    currentPage.value = route.query.page ? Number(route.query.page) : 1;
    getComments(currentPage.value);
});

const commentsTitle = computed(() => `${meta.value.totalCount} Comment${meta.value.totalCount === 1 ? "" : "s"}`);
const allCommentsLoaded = computed(
    () =>
        meta.value.totalCount === 0 ||
        (commentsPages.value.length > 0 && commentsPages.value[commentsPages.value.length - 1].page === meta.value.pageCount)
);

// #region adding new comment
const newCommentBody = ref("");
let sendingComment = ref(false);
const error = ref("");
const refModal = ref(null);

async function sendComment() {
    if (!userStore.loggedIn) {
        refModal.value.open({ type: "authorization_required" });
        return;
    }

    if (sendingComment.value) return;

    error.value = checkNewCommentBody();
    if (error.value !== "") return;

    sendingComment.value = true;

    let success = await api.sendComment(props.id, newCommentBody.value);
    if (success) {
        newCommentBody.value = "";
        await loadLastPage();
        scrollToBottom();
    }
    sendingComment.value = false;
}

function checkNewCommentBody() {
    if (newCommentBody.value.trim() === "") {
        return "Comment text cannot be empty";
    }
    return "";
}
// #endregion

// #region removing comment
let removingComment = false;
const modal = ref(null);

function openRemoveCommentConfirmation(data) {
    modal.value.open({ type: "yes_no", data });
}

function tryRemoveComment(data) {
    if (data.success) {
        removeComment(data.data);
    }
}

async function removeComment(id) {
    if (removingComment) return;
    removingComment = true;

    let success = await api.removeComment(id);
    if (success) {
        loadSpecificPageOnly(currentPage.value);
    }
    removingComment = false;
}
// #endregion

// #region loading comments pages
const loading = ref(false);

async function getComments(page) {
    loading.value = true;
    let resp = await api.getComments(props.id, page);
    loading.value = false;
    if (resp != null) {
        commentsPages.value.push({ page: resp._meta.currentPage, comments: resp.comments });
        meta.value.totalCount = resp._meta.totalCount;
        meta.value.pageCount = resp._meta.pageCount;
    }
}

async function loadSpecificPageOnly(page) {
    commentsPages.value = [];
    await getComments(page);
    currentPage.value = page;
}

function loadNextPage() {
    if (commentsPages.value.length > 0) {
        getComments(commentsPages.value[commentsPages.value.length - 1].page + 1);
    }
}

function changePage(page) {
    scrollToTop();
    loadSpecificPageOnly(page);
}

async function loadFirstPage() {
    await loadSpecificPageOnly(1);
}

async function loadLastPage() {
    await loadSpecificPageOnly(meta.value.pageCount);
}
// #endregion

// #region comments section scrolls
function scrollToTop() {
    let el = refRoot.value;
    window.scrollTo({ top: el.offsetTop - 45, behavior: "smooth" });
}

function scrollToBottom() {
    let el = refRoot.value;
    window.scrollTo({ top: el.offsetTop - 45 + el.offsetHeight, behavior: "smooth" });
}
// #endregion

// #region handling navigation
const navigationFixed = ref(false);

onMounted(() => {
    const callback = (entries) => {
        let intersectedTopOfScreen = entries[0].boundingClientRect.top < entries[0].boundingClientRect.height + 10;
        navigationFixed.value = !entries[0].isIntersecting && intersectedTopOfScreen;
    };
    const observer = new IntersectionObserver(callback, { rootMargin: "-80px 0px 0px 0px" });
    observer.observe(refHeader.value);
});

const displayedNavigationPages = computed(() => {
    let from = Math.max(1, currentPage.value - 2);
    let to = Math.min(currentPage.value + 2, meta.value.pageCount);
    if (to >= from) {
        return new Array(to - from + 1).fill().map((d, i) => i + from);
    } else {
        return [];
    }
});
// #endregion

// #region handling currentPage & onScreenPages &
const currentPage = ref(1);
const onScreenPages = ref([]);
const refHeader = ref(null);
const refRoot = ref(null);
const refPages = ref([]);

function pageWasLoaded(el, page) {
    const callback = (entries) => {
        if (entries[0].isIntersecting) {
            onScreenPages.value.push(page.page);
        } else {
            onScreenPages.value = onScreenPages.value.filter((x) => x !== page.page).sort((a, b) => a - b);
        }
    };

    if (el && refPages.value.every((x) => x.el != el)) {
        refPages.value.push({ el, page });
        const observer = new IntersectionObserver(callback, {});
        observer.observe(el);
    }
}

watch(
    () => onScreenPages.value,
    async (to) => {
        if (to.length > 0) {
            router.replace({ hash: route.hash, query: { page: to[0] } });
            currentPage.value = to[0];
        } else {
            router.replace({ hash: route.hash, query: {} });
        }
    },
    { deep: true }
);
// #endregion
</script>

<style lang="scss">
.news-comments {
    display: flex;
    flex-direction: column;

    margin: 30px 0;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__navigation {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        color: color("second");

        &-container {
            display: flex;
            padding: 0 3px;

            &--fixed {
                position: fixed;
                top: 50px;
                border-radius: 3px;
                background: color("background-hover");
            }
        }

        &-item {
            padding: 0 3px;
            cursor: pointer;

            &:hover {
                border-bottom: 2px solid color("second-hover");
                color: color("second-hover");
            }

            &--current {
                border-bottom: 2px solid;

                &:hover {
                    border-bottom: 2px solid;
                    color: color("second");
                }
            }
        }
    }

    &__title {
    }

    &__list {
        display: flex;
        flex-direction: column;
    }

    &__expand {
        margin: 10px auto;
    }

    &__loading {
        margin: 20px auto;
    }

    &__add {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        margin-top: 30px;
    }

    &__add-bottom {
        display: flex;
        align-items: center;
    }

    &__add-error {
        margin-left: 15px;
        color: color("warn");
    }

    &__input {
        @include grey-input;

        width: 500px;
        height: 150px;
        max-width: 95%;
        resize: none;
    }
}
</style>
