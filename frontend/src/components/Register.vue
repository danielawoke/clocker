<script setup>
import { computed } from 'vue'
import {RouterLink} from 'vue-router'
import {useRoute, useRouter} from 'vue-router'



const route = useRoute()

const router = useRouter();
const backendAPI = "https://forumbackedn.onrender.com"

async function checkUser(user){
        let str = "CheckUser~.&~"+user
        const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
        });
        const data = await response.json();

        if(data.length == 0){
            return true;
        }
        return false;
}
async function registerUser(user,pass){
        let str = "RegUser~.&~"+user+"~.&~"+pass
        const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
        });
        const data = await response.json();
}

async function getHash(user, pass){
    var str = "Log~.&~"+user+"~.&~"+pass
    const response =  await fetch(backendAPI, {
        method: "POST",
        body: str
    });
    const data = await response.json();
    return data[0]["hash"]
}


async function register(){
        let password = document.getElementById("password").value;
        let username = document.getElementById("username").value;
        let verd = await checkUser(username)
        console.log(verd)
        if(verd && username != "NO-USER"){
            console.log("Creating New User")
            await registerUser(username, password)
            let strArr = route.params.prevLink.split(".$FAT")
            
            let hash = await getHash(username,password)

            if(strArr[1] == "postCreation"){
                console.log("/"+strArr[1]+"/"+hash)
                router.push("/"+strArr[1]+"/"+hash);
            }else{
                router.push("/"+strArr[1]+"/"+strArr[2]+"/"+hash);
            }
        }else{
            document.getElementById("log").innerHTML = "That username is already taken, please use a diffrent one"
        }
}




</script>

<template>
    <div class="all">
            <div id="log">
                Try to think of a username that hasn't been used yet, and create a strong password for it
            </div>

            <div>
                <div>
                    Username
                </div>
                <input id="username" v-model="text">
            </div>

            <div>
                <div>
                    Password
                </div>
                <input id="password" v-model="text">
            </div>
            <button v-on:click="register()">Register</button>

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