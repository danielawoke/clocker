

<script setup>
    import Responses from './Responses.vue'
    import { onBeforeMount, onMounted, ref } from 'vue'
    import {useRoute,useRouter} from 'vue-router'
    import Login from './Login.vue'
    import DisplayUser from './DisplayUser.vue'
    import PostCreation from './PostCreation.vue'
    import Top from './Top.vue'
    const route = useRoute()
    const router = useRouter()
    const backendAPI = "https://forumbackedn.onrender.com"

    let arr = ref([])

onBeforeMount(async() => {
    await loadPosts()
})
async function loadPosts(){
    
    var str = "titleChunk~.&~"+route.params.page;
    
        const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
        });
        
        const data = await response.json();
        for(let i = 0; i<data.length; i++){
            let subData = [data[i]["title"],
                           data[i]["author"],
                           data[i]["date"],
                           "/post/"+data[i]["title"]+"~T*&"+data[i]["author"]+"~T*&"+data[i]["date"]+"/"+route.params.loginHash,
                           data[i]["post"]]
            arr.value.push(subData);
        }  
        
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




const path = route.path.split("/")
const split = "/"


</script>

<template>
    <Top />
    <div class="titleBlock">
        <div v-for="data in arr">
            <Responses :date="data[2]" :auth="data[1]" :title="data[0]" :link=data[3] :post=data[4] />
        </div>
        <div>
            <span>
                <a @click="" class="back" :href="split+path[1]+split+(parseInt(path[2])-1)+split+path[3]" >
                    <<<<
                </a>
            </span>
            <span>
                <a class="forward" :href="split+path[1]+split+(parseInt(path[2])+1)+split+path[3]" >
                    >>>>
                </a>
            </span>            
        </div>
    </div>

    
</template>

<style scoped> 

.titleBlock{
    margin:auto;
    max-width:1200px;
    padding-top: 60px;
    padding-left: 25px;
    padding-right: 25px;

}

.forward{
    margin-left: 100px;
    font-size: 15px;
    font-weight: bold;
}
.back{
    font-size: 15px;
    font-weight: bold;
}


@media (max-width: 767px) {
    .titleBlock{
        
    }
}

@media (max-width: 1023px) and (min-width: 768px) {
   
}


</style>