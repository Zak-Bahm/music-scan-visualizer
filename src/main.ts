import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import FontAwesomeIcon from "@/utilities/fontawesome-icons";

import 'bootstrap/dist/css/bootstrap.css';

createApp(App)
    .component("fa-icon", FontAwesomeIcon)
    .mount('#app')
