import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import router from './router';
import './style.css';
import App from './App.vue';

createApp(App)
  .use(router)
  .use(ElementPlus, { locale })
  .mount('#app');
