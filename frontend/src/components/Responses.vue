<script setup>
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import { onMounted } from 'vue'
import { RouterLink, RouterView, routerViewLocationKey,useRouter } from 'vue-router'
const router = useRouter()

// async function next(ID){
//   console.log(router)
//   let link = `/post/${document.getElementById(ID).innerHTML}`
//   router.push(link)
// }


const backendAPI = "https://forumbackedn.onrender.com"

onMounted(async () => {
    const response =  await fetch(backendAPI, {
      method: "POST",
      body: "hi"
    });
    const data = await response.text();
})

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

let props = defineProps({
  ID:String,
  title:String,
  auth:String,
  date:String,
  link:String,
  post:String
  
});

console.log(props)

let auth = "Auth"
let date = "Date"


</script>

<template>
  
  <RouterLink :to=props.link>{{ props.title }}</RouterLink>
  <br>
  <div class="container">
    <span class="subText" :id=auth+ID >{{ props.auth }}
    </span>
    <span class="subText" :id=date+ID >{{ props.date }}
    </span>
  </div>
  <br>
</template>

<style scoped>

  .subText{
    padding-right:50px;
  }
  a{
    font-size: 20px;
  }
</style>