import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import { toUcwords, base64decode } from '../utils.js'

const module = import.meta.glob('../pages/**/*.vue')
const routes = []

for (const path in module) {
   const name = path.split('/').pop().split('.')[0].toLowerCase()
   const routePath = path
      .replace('../pages', '')
      .replace('.vue', '')
      .toLowerCase()

   // Jika pathnya adalah Home.vue, arahkan ke root '/'
   const finalPath = routePath === '/index' ? '/' : routePath
   if (routePath === '/error') {
      routes.push({
         path: '/:slug(.*)',
         name,
         component: module[path],
         meta: {
            title: 'Page Not Found',
         }
      })
   } else if (routePath === '/api') {
      routes.push({
         path: '/api',
         name,
         component: module[path],
         meta: {
            title: 'Collections'
         }
      })
   } else if (routePath.startsWith('/folder')) {
      routes.push({
         path: '/folder/:hash',
         name,
         component: module[path],
         meta: {
            title: 'Folder'
         }
      })
   } else if (routePath.startsWith('/run')) {
      routes.push({
         path: '/run/:name',
         name,
         component: module[path],
         meta: {
            title: 'Playground' // Default jika tidak ada name
         }
      })
   } else if (routePath.startsWith('/auth/verify')) {
      routes.push({
         path: '/auth/verify',
         name,
         component: module[path],
         meta: {
            title: 'Verification'
         }
      })
   } else if (routePath === '/panel/ip-access') {
      routes.push({
         path: '/panel/ip-access',
         name,
         component: module[path],
         meta: {
            title: 'IP Access',
            auth: true
         }
      })
   } else if (routePath.startsWith('/panel/ip')) {
      routes.push({
         path: '/panel/ip/:ip',
         name,
         component: module[path],
         meta: {
            title: 'IP Lookup',
            auth: true
         }
      })
   } else if (routePath.startsWith('/panel/users')) {
      routes.push({
         path: '/panel/users',
         component: module[path],
         meta: {
            auth: true,
            admin: true
         },
         children: [{
            path: '',
            name: 'users',
            component: module[path],
            meta: { title: 'User Management' }
         }, {
            path: ':email',
            name: 'user-view',
            component: module[path],
            meta: { title: 'Users View' }
         }]
      })
   } else if (routePath.startsWith('/panel/logs')) {
      routes.push({
         path: '/panel/logs',
         component: module[path],
         meta: {
            auth: true,
            admin: true
         },
         children: [{
            path: '',
            name: 'logs',
            component: module[path],
            meta: { title: 'Log Management' }
         }]
      })
   } else if (routePath === '/panel/log') {
      routes.push({
         path: '/panel/log',
         name,
         component: module[path],
         meta: {
            auth: true,
            admin: true,
            title: 'Create Log'
         }
      })
   } else {
      routes.push({
         path: finalPath,
         name,
         component: module[path],
         meta: {
            title: name === 'index' ? '' : name,
            auth: ['panel', 'claim'].includes(name)
         }
      })
   }
}

const router = createRouter({
   history: createWebHistory(),
   routes
})

router.beforeEach((to, from, next) => {
   const setting = store.getters['website/setting']
   if (to.path === '/' && setting) {
      document.title = `${setting.name} | ${setting.description}`
   } else if (to.path.startsWith('/folder') && to.params.hash) {
      document.title = `${toUcwords(base64decode(to.params.hash))} | ${setting.name}`
   } else if (to.path.startsWith('/run') && to.params.name) {
      document.title = `${base64decode(to.params.name)} | ${setting.name}`
   } else if (to.children) {
      to.children.map(v => {
         document.title = `${v.title} | ${setting.name}`
      })
   } else if (to.meta.title) {
      document.title = `${toUcwords(to.meta.title)} | ${setting.name}`
   } else {
      document.title = setting.name
   }
   if (to.meta.auth && !store.getters['user/isTokenValid']) {
      next('/auth/login')
      return
   }
   if (to.meta.auth && store.getters['user/isTokenValid']) {
      if (to.meta.admin && store.getters['user/data']?.user_info?.role !== 'admin') {
         next('/panel')
         return
      }
      next()
   }
   next()
})

export default router
