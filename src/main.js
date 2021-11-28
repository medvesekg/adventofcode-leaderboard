import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from './App.vue'
import './index.css'
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
