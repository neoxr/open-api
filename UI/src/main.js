import { createApp } from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/css/style.css'

import App from './App.vue'
import store from './store'
import router from './router'

NProgress.configure({
    showSpinner: true
})
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})
router.afterEach(() => NProgress.done())

const app = createApp(App)

app.config.globalProperties.$scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

app.use(store)
app.use(router)
app.mount('#app')