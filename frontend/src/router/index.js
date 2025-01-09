import {createWebHistory, createRouter} from 'vue-router'
import Responses from '@/components/Responses.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/welcome.vue'
import Post from '@/components/Post.vue'
import PostReroute from '@/components/postReroute.vue'
import HomeReroute from '@/components/HomeReroute.vue'
import Register from '@/components/Register.vue'
import PostCreation from '@/components/PostCreation.vue'
import LoginPage from '@/components/LoginPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path:"/hi",
        component: Responses
      },
      {
        path:"/",
        component: Welcome
      },
      {
        path:"/home/:page/:loginHash",
        component: Home
      },
      {
        path:"/post/:title/:loginHash",
        component: Post
      },
      {
        path:"/post/:title/",
        component: PostReroute
      },
      {
        path:"/postCreation/:loginHash",
        component:PostCreation
      },
      {
        path:"/home/:page/",
        component: HomeReroute
      },
      {
        path:"/register/:prevLink/",
        component: Register,
      },
      {
        path:"/login/:prevLink/",
        component: LoginPage,
      }
    ]
  })


  

export default router