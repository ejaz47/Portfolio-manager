import Vue from 'vue'
import Router from 'vue-router'
import Portfolio from '@/components/Portfolio'
import Portfolio_detail from '@/components/Portfolio_detail'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Portfolio',
            component: Portfolio
        },
        {
            path: '/portfolio/detail',
            name: 'Portfolio_detail',
            component: Portfolio_detail
        }
    ]
})