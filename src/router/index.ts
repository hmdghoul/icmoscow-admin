import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../helpers/api'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/',
      component: () => import('../pages/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      component: () => import('../pages/ProjectsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/new',
      component: () => import('../pages/ProjectFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id',
      component: () => import('../pages/ProjectDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/edit',
      component: () => import('../pages/ProjectFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/donations',
      component: () => import('../pages/DonationsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/donations/new',
      component: () => import('../pages/DonationFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/donations/:id/edit',
      component: () => import('../pages/DonationFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expenses',
      component: () => import('../pages/ExpensesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expenses/new',
      component: () => import('../pages/ExpenseFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expenses/:id/edit',
      component: () => import('../pages/ExpenseFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/timeline',
      component: () => import('../pages/TimelinePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/timeline/new',
      component: () => import('../pages/TimelineFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/timeline/:id/edit',
      component: () => import('../pages/TimelineFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/photos',
      component: () => import('../pages/PhotosPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/photos/new',
      component: () => import('../pages/PhotoFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/photos/:id/edit',
      component: () => import('../pages/PhotoFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activities',
      component: () => import('../pages/ActivitiesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activities/new',
      component: () => import('../pages/ActivityFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activities/:id/edit',
      component: () => import('../pages/ActivityFormPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const token = getToken()
  if (to.meta.requiresAuth && !token) {
    return { path: '/login' }
  }
  if (to.path === '/login' && token) {
    return { path: '/' }
  }
})
