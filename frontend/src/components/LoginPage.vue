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
        let prevLink = arr[2].split(".$FAT")
        console.log(prevLink)
        if(prevLink[1] == "postCreation"){
            let path = "/"+prevLink[1]+"/"+data[0]["hash"]
            router.replace(path)
        }else if(prevLink[1] == "home" || prevLink[1] == "post"){
            let path = "/"+prevLink[1]+"/"+prevLink[2]+"/"+data[0]["hash"]
            router.push(path)
        }
    }else{
        document.getElementById("message").innerHTML = "Incorrect login, please try again"
    }
}

const loop = (route.path.split("/"))
const reg = "/register/"+loop[2]

</script>

<template>
    <div class="all" >
        <div class="header" id="message">
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
        <RouterLink class="Register" :to=reg >Register</RouterLink>


    </div>

</template>

<style scoped>
.Register{
    background-color: rgb(0, 154, 103);
    color:white;
    
}
.all{
    width:400px;
    height:400px;
    background-color: rgba(15, 143, 255, 0.144);
    margin:auto;
    position: relative;
    top:200px;
    padding:100px;
}
button{
    position:relative;
}
.header{
    
    margin-bottom: 20px;
}
</style>