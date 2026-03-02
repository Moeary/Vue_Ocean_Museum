import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/knowledge',
    name: 'KnowledgeBase',
    component: () => import('../views/KnowledgeBase.vue')
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/TimelinePage.vue')
  },
  {
    path: '/intro',
    name: 'Introduction',
    component: () => import('../views/IntroPage.vue')
  },
  {
    path: '/marine-life',
    name: 'MarineLifeGallery',
    component: () => import('../views/MarineLifeGallery.vue')
  },
  {
    path: '/recognition',
    name: 'MarineRecognition',
    component: () => import('../views/MarineRecognition.vue')
  },
  {
    path: '/3d',
    name: 'ThreeDPage',
    component: () => import('../views/ThreeDPage.vue')
  },
  {
    path: '/vr',
    name: 'VRPage',
    component: () => import('../views/VRPage.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
