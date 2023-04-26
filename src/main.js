import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { icons } from "./js/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UI from "@/components/Ui";
import { createPinia } from "pinia";

library.add(icons);

let app = createApp(App);

app.use(createPinia());
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

for (let key in UI) {
    app.component(key, UI[key]);
}

app.mount("#app");
