import {createRouter, createWebHistory} from "vue-router"

export const total = 26
export const router = createRouter({
    history: createWebHistory(),
    routes: Array.from(new Array(total).keys()).map(i => {
        return {
            path: `/${i + 1}`,
            component: () => import(`./components/Example${i + 1}.vue`)
        }
    })
})
