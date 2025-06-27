import './assets/main.css'

import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from './App.vue'
import MapView from './MapView.vue'
import MapList from './MapList.vue'
//
// 他のコンポーネントは省略
//

const routes = [
  { path: '/', component: MapList },
  { path: '/map', component: MapView },
  { path: '/map/:region/:state/:city/:type', component: MapView, props: true },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
