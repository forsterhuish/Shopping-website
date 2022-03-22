import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetail from '../components/ProductDetail.vue'
import Admin from '../components/Admin.vue'
import Login from '../components/Login.vue'
import CreateUser from '../components/CreateUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
    // {
    //   path: "/:productCategory",
    //   name: 'product-category',
    //   component: HomeView
    // },
    {
      path: "/:productCategory",
      name: ":productCategory",
      component: HomeView
    },
    {
      path: "/admin-panel",
      name: "admin-panel",
      component: Admin
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/create-user",
      name: "create-user",
      component: CreateUser
    }
  ]
})

export default router
