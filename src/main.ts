import './assets/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'
import MapView from './MapView.vue'
import MapList from './MapList.vue'
import NotFoundComponent from './NotFoundComponent.vue'
//
// 他のコンポーネントは省略
//

const routes = [
  { path: '/', component: MapList },
  { path: '/map', component: MapView },
  { path: '/map/:election/:region/:state/:city/:type', component: MapView, props: true },
  { path: '/:notFound(.*)', component: NotFoundComponent },
]

// github pagesだとimport.meta.env.BASE_URLで指定しないとうまく動かない
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

createApp(App).use(router).mount('#app')
