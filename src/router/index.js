import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '3DModels',
    component: () => import("../components/3DTiles/3DTilesPick.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
