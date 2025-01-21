<script setup>
import {onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
const backendAPI = "https://forumbackedn.onrender.com"

let route = useRoute();
let router = useRouter();

async function post(){
    document.getElementById("btn").style.backgroundColor = "black"
    let hash = route.params.loginHash
    let title = document.getElementById("title").value; 
    let post = document.getElementById("post").value; 
    let str = "sumbitPost~.&~"+title+"~.&~"+post+"~.&~"+hash;
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });
    let data = await response.text()
    let path = "/post/"+data+"/"+route.params.loginHash
    document.getElementById("btn").style.backgroundColor = "rgb(0, 136, 255)"
    router.push(path)

}


async function check(hash){
    console.log(hash)
    let str = "hashToUser~.&~"+hash
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });

    const data = await response.json()
    if(data.length==0){
        return false
    }else{
        return true;
    }
}

onMounted(async () => {
    let validUser = await check(route.params.loginHash)
    if(!validUser){
        router.push("/register/.$FATpostCreation.$FAT1")
    }
})

</script>

<template>
    <div class="all">

        <input class="title" id="title" v-model="text" placeholder="write the title/header of your post here">
        <div></div>
        <textarea id="post" v-model="text" placeholder="write post here"> </textarea>
        <div></div>
        <button id="btn" @click="post()" >POST</button>
    </div>
</template>

<style scoped>

@media (max-width: 599px) {

    input{
        border:0px
    }
    .title{
        height:30px;
        margin-bottom: 30px;
        width:500px;
    }
    .all{

        margin: auto;
        position: relative;
        background-color: aliceblue;
        padding:10px;
        padding-bottom:8vh;

    }
    textarea{
        background-color: rgb(246, 246, 246);
        height:80vh;
    }
    button{
        position:fixed;
        left:0;
        bottom:0;
        padding:2vh;
    }

   

    
}

@media (min-width: 600px) {

    input{
        border:0px
    }
    .title{
        height:30px;
        margin-bottom: 30px;
        width:500px;
    }
    .all{

        width:520px;
        height:350px;
        margin: auto;
        position: relative;
        top:150px;
        background-color: aliceblue;
        padding:10px;
    }
    textarea{
        display:"block";
        background-color: rgb(246, 246, 246);
        height:200px;
        margin-bottom: 30px;
    }

    
}

</style>