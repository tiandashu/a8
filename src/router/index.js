import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HotMoneySeatsView from '../views/HotMoneySeatsView.vue'
import DailyBillboardView from '../views/DailyBillboardView.vue'

export const routeNames = {
  home: 'home',
  hotMoneySeats: 'hotMoneySeats',
  dailyBillboard: 'dailyBillboard',
}

const routes = [
  {
    path: '/',
    name: routeNames.home,
    component: HomeView,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/hot-money-seats',
    name: routeNames.hotMoneySeats,
    component: HotMoneySeatsView,
    meta: {
      title: '游资席位',
    },
  },
  {
    path: '/daily-billboard',
    name: routeNames.dailyBillboard,
    component: DailyBillboardView,
    meta: {
      title: '单日龙虎榜',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'A8'} | A8`
})

export default router
