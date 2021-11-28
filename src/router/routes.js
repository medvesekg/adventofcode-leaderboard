import PageHome from '@/pages/PageHome.vue'
import PageTeams from '@/pages/PageTeams.vue'
import PageBigTable from '@/pages/PageBigTable.vue'
import Test from '@/pages/Test.vue'

export default [
  {
    path: '/',
    component: PageHome,
    name: 'home'
  },
  {
    path: '/teams',
    component: PageTeams,
    name: 'teams'
  },
  {
    path: '/big-table',
    component: PageBigTable,
    name: 'big-table'
  },
  {
    path: '/test',
    component: Test,
    name: 'test'
  }
]