import Vue from 'vue'
import Router from 'vue-router'

import Content from '@/components/pages/Content'
import Reg from '@/components/pages/Reg'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Content
        },
        {
            path: '/reg',
            component: Reg
        }
    ]
})