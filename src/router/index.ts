import { createRouter, createWebHistory } from 'vue-router'
import CategoriesView from '@/views/CategoriesView.vue'
import CategoryDetailView from '@/views/CategoryDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/categories'
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/categories/:id',
      name: 'category-detail',
      component: CategoryDetailView
    }
  ],
})

export default router
