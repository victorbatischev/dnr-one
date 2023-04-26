<template>
    <div class="social-comp">
        <LikesComp class="social-comp__likes" :scope="'news'" :id="id" :like="like"></LikesComp>

        <router-link class="social-comp__link" :to="{ path: `/post/${id}`, hash: '#comments' }" v-if="comments_count != null">
            <font-awesome-icon class="social-comp__icon" icon="comment" />
            {{ comments_count }}
        </router-link>

        <div class="social-comp__views" v-if="views != null">
            <font-awesome-icon class="social-comp__icon" icon="eye" />
            {{ views }}
        </div>

        <div class="social-comp__share" @click="openShare()">
            <font-awesome-icon class="social-comp__icon" icon="share-from-square" />
            share
        </div>

        <ModalComp ref="refModal">
            <div class="social-comp__modal">
                Share:
                <a class="social-comp__modal-link" :href="telegramLink" target="popup" @click.prevent="openPopup(telegramLink)">
                    <span class="social-comp__modal-text">Telegram</span>
                    <font-awesome-icon class="social-comp__modal-icon" :icon="['fab', 'telegram']" />
                </a>
                <a class="social-comp__modal-link" :href="vkLink" target="popup" @click.prevent="openPopup(vkLink)">
                    <span class="social-comp__modal-text">Vk</span>
                    <font-awesome-icon class="social-comp__modal-icon" :icon="['fab', 'vk']" />
                </a>
                <a class="social-comp__modal-link" :href="facebookLink" target="popup" @click.prevent="openPopup(facebookLink)">
                    <span class="social-comp__modal-text">Facebook</span>
                    <font-awesome-icon class="social-comp__modal-icon" :icon="['fab', 'facebook']" />
                </a>
                <div class="social-comp__modal-link" @click="copyLink()">
                    <span class="social-comp__modal-text">Copy URL</span>
                    <font-awesome-icon class="social-comp__modal-icon" icon="link" />
                </div>
            </div>
        </ModalComp>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";

import LikesComp from "@/components/Common/LikesComp.vue";

const props = defineProps(["id", "like", "comments_count", "views"]);
const refModal = ref(null);

const currentLink = computed(() => encodeURIComponent(location.origin + "/post/" + props.id));

const telegramLink = computed(() => `https://telegram.me/share/url?url=${currentLink.value}&text=DNR.ONE`);
const facebookLink = computed(() => `https://www.facebook.com/sharer.php?u=${currentLink.value}`);
const vkLink = computed(() => `https://vk.com/share.php?url=${currentLink.value}`);

function openShare() {
    if (navigator.share) {
        navigator.share({
            url: window.location.href,
        });
    } else {
        refModal.value.open();
    }
}

function openPopup(link) {
    window.open(link, "name", "width=600,height=500");
    refModal.value.close();
}

function copyLink() {
    copyToClipboard(location.origin + "/post/" + props.id);
    refModal.value.close();
}

function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand("copy") ? res() : rej();
            textArea.remove();
        });
    }
}
</script>

<style lang="scss">
.social-comp {
    display: flex;
    gap: 15px;
    color: color("second");
    font-size: 14px;
    align-items: center;

    &__link {
        color: inherit;
        text-decoration: none;
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }

    &__share {
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
        transition: color 0.18s ease;

        &:hover {
            color: color("second-hover");
        }
    }

    &__modal {
        width: 100px;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        &-link {
            display: flex;
            align-items: center;
            color: inherit;
            text-decoration: none;
            transition: color 0.18s ease;
            cursor: pointer;

            &:hover {
                color: color("second-hover");
            }
        }

        &-text {
            flex: 1;
        }

        &-icon {
            width: 20px;
            height: 20px;
        }
    }
}
</style>
