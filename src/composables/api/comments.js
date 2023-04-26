import myaxios from "@/composables/api/myaxios";

import { useUser } from "@/stores";

export const useCommentsApi = () => {
    const userStore = useUser();

    async function getComments(news_id, page) {
        let expand = "expand=like,dislike" + (userStore.loggedIn ? ",user_like,user_dislike" : "");

        let path = `comment/news-comments?${expand}&news_id=${news_id}&page=${page}`;
        let resp = await myaxios(path);

        if (resp != null) {
            return resp;
        } else {
            alert("Failed to load post " + news_id);
            return null;
        }
    }

    async function sendComment(news_id, comment_body) {
        useUser;
        if (!userStore.loggedIn) {
            alert("authorization required");
            return false;
        }

        let path = `comment/create`;
        let config = {
            method: "post",
            data: { news_id, comment_body },
        };

        let resp = await myaxios(path, config, true);
        return resp != null && !resp.hasErrors;
    }

    async function removeComment(comment_id) {
        if (!userStore.loggedIn) {
            alert("authorization required");
            return false;
        }

        let path = `comment/delete?comment_id=${comment_id}`;
        let config = {
            method: "delete",
        };
        let resp = await myaxios(path, config, true);
        return resp != null && !resp.hasErrors;
    }

    return { getComments, sendComment, removeComment };
};
