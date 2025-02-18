
const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AdminPanel.vue') },
      { path: 'settings', component: () => import('pages/SettingPAge.vue') },
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
