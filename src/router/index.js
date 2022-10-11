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
        title: 'To Do List App',
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
  const appTitle = 'To Do List App';
  window.document.title =
    destination.meta?.title && destination.meta?.title !== appTitle
      ? `${appTitle} - ${destination.meta.title}`
      : appTitle;
});

export default router;
