import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import KnowledgeBase from '../views/KnowledgeBase.vue';
import TimelinePage from '../views/TimelinePage.vue';
import IntroPage from '../views/IntroPage.vue';
import MarineLifeGallery from '../views/MarineLifeGallery.vue';
import MarineRecognition from '../views/MarineRecognition.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/knowledge',
    name: 'KnowledgeBase',
    component: KnowledgeBase
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: TimelinePage
  },
  {
    path: '/intro',
    name: 'Introduction',
    component: IntroPage
  },
  {
    path: '/marine-life',
    name: 'MarineLifeGallery',
    component: MarineLifeGallery
  },
  {
    path: '/recognition',
    name: 'MarineRecognition',
    component: MarineRecognition
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
