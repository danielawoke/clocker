<script setup>
import {RouterLink, useRouter, RouterView, useRoute} from 'vue-router'
import Register from "./Register.vue"
const router = useRouter();
const route = useRoute();
const backendAPI = "https://forumbackedn.onrender.com"


async function login(){
    let user = document.getElementById("user").value
    let pass = document.getElementById("pass").value

    var str = "Log~.&~"+user+"~.&~"+pass
    const response =  await fetch(backendAPI, {
        method: "POST",
        body: str
    });
    const data = await response.json();
    if(data.length != 0){
        let arr = route.path.split("/")
        router.push("/"+arr[1]+"/"+arr[2]+"/"+data[0]["hash"])
    }else{
        document.getElementById("message").innerHTML = "Incorrect login, please try again"
    }
}

const loop = (route.path.replaceAll("/",".$FAT"))
const reg = "/register/"+loop

</script>

<template>
    <div>
        <div id="message">
            Please login to create comments/posts
        </div>

        <div>
            <div>
                Username
            </div>
            <input id="user" v-model="text">
        </div>
        <div>
            <div>
                Password
            </div>
            <input id="pass" v-model="text">
        </div>
        <button @click="login()">Login</button>
        <div></div>
        <RouterLink :to=reg >Register</RouterLink>
    </div>

</template>

<style scoped>

</style>