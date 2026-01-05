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

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
