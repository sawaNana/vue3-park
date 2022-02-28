import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "./views/HelloWorld.vue";
import RoutingTest from "./views/RoutingTest.vue";
import HelloCognito from "./views/HelloCognito.vue";

const routes = [
    {
        path: "/",
        name: "HelloWorld",
        component: HelloWorld
    },
    {
        path: "/routing-test",
        name: "RoutingTest",
        component: RoutingTest
    },
    {
        path: "/hello-cognito",
        name: "HelloCognito",
        component: HelloCognito
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
