import myaxios from "@/composables/api/myaxios";
import { useUser } from "@/stores";

export const useLikesApi = () => {
    const userStore = useUser();

    async function checkStatusForUser(scope, type, id) {
        if (!userStore.loggedIn) return false;

        let path = "";
        if (scope === "news") {
            if (type === "like") {
                path = `user-news-like/check-news-like?news_id=${id}`;
            }
        }
        if (path === "") return false;

        let resp = await myaxios(path, {});
        return resp.data?.news_id === id;
    }

    async function set(scope, type, id) {
        let path = "";

        if (scope === "news") {
            if (type === "like") {
                path = `user-news-like/set-like`;
            }
        } else if (scope === "comment") {
            if (type === "like") {
                path = `user-comment-like/comment-set-like`;
            } else if (type === "dislike") {
                path = `user-comment-dislike/comment-set-dislike`;
            }
        }
        if (path === "") return false;

        let config = {
            method: "post",
            data: { [`${scope}_id`]: id },
        };

        let resp = await myaxios(path, config);
        return resp?.data && resp.data[`${scope}_id`] === id;
    }

    async function remove(scope, type, id) {
        let path = "";

        if (scope === "news") {
            if (type === "like") {
                path = `user-news-like/delete-like?news_id=${id}`;
            }
        } else if (scope === "comment") {
            if (type === "like") {
                path = `user-comment-like/comment-delete-like?comment_id=${id}`;
            } else if (type === "dislike") {
                path = `user-comment-dislike/comment-delete-dislike?comment_id=${id}`;
            }
        }
        if (path === "") return false;

        let config = {
            method: "delete",
        };

        let resp = await myaxios(path, config);
        return resp?.data && resp.data[`${scope}_id`] === id;
    }

    return { checkStatusForUser, set, remove };
};
