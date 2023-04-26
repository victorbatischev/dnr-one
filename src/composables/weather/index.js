import axios from "axios";
import { ref } from "vue";

const appid = "bdf127740921661e863599c9f02021d0";
const cityid = "709717";

const weather = ref({});

const init = async () => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityid}&appid=${appid}&units=metric&lang=ru`);
    if (response.status === 200) {
        weather.value = response.data;
    }
};
init();

export default { weather };
