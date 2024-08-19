import { createRouter, createWebHistory } from 'vue-router';
import FormComponent from '../components/FormComponent.vue';
import PageCongratulation from '../components/PageCongratulation.vue';

const routes = [
  {
    path: '/',
    name: 'FormComponent',
    component: FormComponent,
  },
  {
    path: '/',
    name: 'PageCongratulation',
    component: PageCongratulation,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;