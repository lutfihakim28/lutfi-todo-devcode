import { createRouter, createWebHistory } from 'vue-router';
import DashboardActivity from '../pages/DashboardActivity.vue';
import ActivityList from '../pages/ActivityList.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      name: 'DashboardActivity',
      component: DashboardActivity,
      meta: {
        title: 'TO DO LIST APP',
        hasBackButton: false,
      },
    },
    {
      path: '/activity/:id',
      name: 'ActivityList',
      component: ActivityList,
      meta: {
        title: 'New Activity',
        hasBackButton: true,
      },
    },
  ],
});

router.beforeEach((destination) => {
  const appTitle = 'TO DO LIST APP';
  window.document.title =
    destination.meta?.title && destination.meta?.title !== appTitle
      ? `${appTitle} - ${destination.meta.title}`
      : appTitle;
});

export default router;
