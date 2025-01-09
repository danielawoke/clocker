

<script setup>
    import Responses from './Responses.vue'
    import { onBeforeMount, onMounted, ref } from 'vue'
    import {useRoute,useRouter} from 'vue-router'
    import Login from './Login.vue'
    import DisplayUser from './DisplayUser.vue'
    import PostCreation from './PostCreation.vue'
    const route = useRoute()
    const router = useRouter()
    const backendAPI = "https://forumbackedn.onrender.com"

    let arr = ref([])

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

    async function createPost(){
        let verd = await check(route.path.split("/")[3])
        if(verd){
            let arr = route.path.split("/")
            router.push("/postCreation/"+arr[3])
        }else{
            let str = ".$FATpostCreation.$FAT1"
            router.replace("/login/"+str)
        }
    }

function signIn(){
    const loop = (route.path.replaceAll("/",".$FAT"))
    const reg = "/login/"+loop
    router.push(reg);
}

function routeHome(){
    let path = route.path.split("/");
    router.push("/home/1/"+path[3])
}

let username = ref("loading...")

onMounted(async() => {
    let str = "hashToUser~.&~"+route.params.loginHash
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });

    const data = await response.json()
    console.log(data.username)
    username.value = data[0]["username"]     
})
function signOut(){
    let path = route.path.split("/");
    let str = "/"+path[1]+"/"+path[2]+"/NO-USER";
    router.push(str)
}

</script>

<template>
    <div class = "block">
        <div>
            
                
                <span class="leftBlock">
                    <span @click="routeHome()" class="home">
                        HOME
                    </span>
                    <span @click="createPost()" class="createPost">
                        CREATE POST
                    </span>
                </span>
                <div v-if="route.params.loginHash=='NO-USER'">
                    <span @click="signIn()" class="signIn">   
                        sign in
                    </span>
                </div>
                <div v-if="route.params.loginHash!='NO-USER'">
                    <span class="profileBlock">
                        <img src="./pictures/profilePic.png" class="profile">
                        <div class="userId">
                            USER:
                            <div>{{ username }}</div>
                            <div @click="signOut()" class="signOut">SIGN OUT</div>
                        </div>
                    </span>    


                </div> 
        </div>
    </div>
</template>

<style scoped>
.signOut{
    position:absolute;
    bottom: 0;
    box-sizing: border-box;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    border-top:3px solid black;
    width:150px

}
.userId{
    display:none;
    width:200px;
    height:350px;
    background-color: rgb(255, 255, 255);
    position:absolute;
    right:0;
    padding: 20px;
    box-sizing: border-box;
    font-weight:bold;
    color:black;
    z-index: 1;
}
.profile{
    width: 35x;
    height: 35px;
    background-color: white;
    position: absolute;
    right:0;
    top:3px;
    border-radius: 50px;
    z-index: 2;


}
.profileBlock:hover .userId{
    
    display: block;
}
.leftBlock{
    position: absolute;
    block-size: border-box;

}
.home{
    padding-left:150px;
    padding-right:150px;
    border-left:1px solid rgb(255, 255, 255);
    margin-left:50px;
    background-color: rgb(0, 50, 13);
    padding:15px;
}
.home:hover{
    animation-name: homeHover;
    animation-duration: .5s;
    animation-fill-mode: both;

}
@keyframes homeHover{
    from{
        padding-left:150px;
        padding-right:150px;
        border-left:1px solid rgb(255, 255, 255);
        margin-left:50px;
        background-color: rgb(0, 50, 13);
        padding:15px;
    }
    to{
        padding-left:150px;
        padding-right:150px;
        border-left:1px solid rgb(255, 255, 255);
        margin-left:50px;
        background-color: rgb(255, 255, 255);
        color: black;
        padding:15px;

    }
}
.createPost{
    padding-left:150px;
    padding-right:150px;
    border-left:1px solid rgb(255, 255, 255);
    border-right:1px solid rgb(255, 255, 255);
    padding:15px;
}
.createPost:hover{
    animation-name: createPostHover;
    animation-duration: .5s;
    animation-fill-mode: both;

}
@keyframes createPostHover{
    from{
        padding-left:150px;
        padding-right:150px;
        border-left:1px solid rgb(255, 255, 255);
        border-right:1px solid rgb(255, 255, 255);
        padding:15px;
        background-color: rgba(240, 248, 255, 0);
    }
    to{
        padding-left:150px;
        padding-right:150px;
        border-left:1px solid rgb(255, 255, 255);
        border-right:1px solid rgb(255, 255, 255);
        padding:15px;
        background-color: white;
        color: rgb(0, 0, 0);

    }
}
.signIn{

        border-radius: 25px;
        position:absolute;
        color:rgba(255, 255, 255, 0.358);
        top: 5px;
        padding-left:15px;
        padding-right:15px;
        border: 2px solid rgb(0, 0, 0);
        background-color: rgb(0, 80, 13);
        font-weight: bold;
}
.signIn:hover{
    animation-name: signInHover;
    animation-duration: .5s;
    animation-fill-mode: both;
}
@keyframes signInHover{
    from{
        border-radius: 25px;
        position:absolute;
        color:rgba(255, 255, 255, 0.358);
        top: 5px;
        padding-left:15px;
        padding-right:15px;
        border: 2px solid rgb(0, 0, 0);
        background-color: rgb(0, 80, 13);
        font-weight: bold;
    }
    to{
        border-radius: 25px;
        position:absolute;
        color:rgb(255, 255, 255);
        right:0;
        right: 150px;
        top: 5px;
        padding-left:15px;
        padding-right:15px;
        border: 2px solid rgb(255, 255, 255);
        background-color: rgb(0, 0, 0);
        font-weight: bold;
    }
}


.block{
        height:40px;
        background-color: rgba(18, 18, 18, 0.5);
        width:100vw;
        position: fixed;
        border-radius: 0px 0px 10px 10px;

    }
.profileBlock{
    position: absolute;
}

@media (max-width: 767px) {
    .home{
        margin-left:0px;
    }
    .signIn{
           right:10px;
    }
    .profileBlock{
        right:20px;
    }
    
}

@media (min-width: 768px) {
    .home{
        margin-left:50px;
    }
    .signIn{
        margin-right: 10px;
        right: 150px;
    }
    .profileBlock{
        right:150px;
    }
    
}


</style>