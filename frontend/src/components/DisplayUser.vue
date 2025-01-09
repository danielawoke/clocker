<script setup>
import {RouterLink, useRouter, RouterView, useRoute} from 'vue-router'
import Register from "./Register.vue"
import {onMounted,ref} from "vue"
import DisplayUser from './DisplayUser.vue'
const router = useRouter();
const route = useRoute();
const backendAPI = "https://forumbackedn.onrender.com"

let user = ref("loading...")
onMounted(async () => {
    let str = "hashToUser~.&~"+route.params.loginHash
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });

    const data = await response.json()
    console.log(data.username)
    user.value = data[0]["username"]     

})

</script>

<template>
    <div>
        USER: {{user}}
    </div>

</template>

<style scoped>

</style>