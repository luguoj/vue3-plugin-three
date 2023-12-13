import {createApp} from 'vue'
import '../package'
import App from './App.vue'
import './style.css'
import {router} from "./router.ts";

createApp(App).use(router).mount('#app')
