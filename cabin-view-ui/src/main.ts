//import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css'
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(DialogService);
app.use(ToastService);

app.mount("#app");
