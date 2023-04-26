import myaxios from "@/composables/api/myaxios";

export const useNewsApi = () => {
    async function fetchAllCategories() {
        let path = `category/category?expand=tags`;
        let resp = await myaxios(path);

        if (resp?.data) {
            return resp.data;
        } else {
            console.log("Failed to load posts info");
        }
        return null;
    }

    async function fetchAllTags() {
        let path = `tag/tag`;
        let resp = await myaxios(path);

        if (resp?.data) {
            return resp.data;
        } else {
            console.log("Failed to load posts info");
        }
        return null;
    }

    async function fetchPostsIdsByFilters(newsStore, page) {
        let categories = newsStore.selectedCategoriesIds.map((x, i) => `category[${i}]=${x}`).join("&");
        categories = categories ? "&" + categories : "";

        let tags = newsStore.selectedTagsIds.map((x, i) => `tags[${i}]=${x}`).join("&");
        tags = tags ? "&" + tags : "";

        let firstDateMinimized = new Date(newsStore.selectedDatesStart);
        firstDateMinimized.setHours(0, 0, 0);
        let from_date = newsStore.selectedDatesStart ? "&from_date=" + Math.floor(firstDateMinimized.getTime() / 1000) : "";

        let secondDateMaximized = new Date(newsStore.selectedDatesEnd);
        secondDateMaximized.setHours(23, 59, 59);
        let published = newsStore.selectedDatesEnd ? "&published=" + Math.floor(secondDateMaximized.getTime() / 1000) : "";

        let path = `news/filter?expand=category,tags,comments_count,photo,news_body,like${categories}${tags}${from_date}${published}&page=${page}`;

        let resp = await myaxios(path);

        if (resp != null) {
            return resp;
        } else {
            return null;
        }
    }

    async function fetchPostById(id) {
        let path = `news/news?expand=category,tags,comments_count,photo,news_body,like&news_id=${id}`;

        let resp = await myaxios(path);

        if (resp != null) {
            return resp.data;
        } else {
            return null;
        }
    }

    async function findPostsByString(searchText, page) {
        let path = `news/find?expand=category,tags,comments_count,photo,news_body,like&text=${searchText}&page=${page}`;

        let resp = await myaxios(path);

        if (resp != null) {
            return resp;
        } else {
            console.log(`Failed to search posts "${searchText}"`);
            return null;
        }
    }

    return { fetchAllCategories, fetchAllTags, fetchPostsIdsByFilters, fetchPostById, findPostsByString };
};
