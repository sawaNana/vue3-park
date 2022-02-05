import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "./views/HelloWorld.vue";
import RoutingTest from "./views/RoutingTest.vue";

const routes = [
    {
        path: "/",
        nae: "HelloWorld",
        component: HelloWorld
    },
    {
        path: "/routing-test",
        nae: "RoutingTest",
        component: RoutingTest
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
