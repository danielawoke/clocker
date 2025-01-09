<script setup>

import {useRoute, useRouter} from 'vue-router'
import { onMounted, ref } from 'vue'
import Reps from './Reps.vue'
import Login from './Login.vue'
import DisplayUser from './DisplayUser.vue'
import Top from './Top.vue'

const route = useRoute()
const router = useRouter()


const backendAPI = "https://forumbackedn.onrender.com"

let replies = ref([])


let loadedReplies = 0

async function loadMore(){

          let str = "loadReplyP~.&~"+route.params.title+"~.&~"+loadedReplies
          console.log(str)
          const response =  await fetch(backendAPI, {
              method: "POST",
              body: str
          });
          const data = await response.json();
          for(let rep of data){
            let repArr = [rep["reply"], rep["author"], rep["date"]]
            replies.value.push(repArr)
          }
                    
          loadedReplies+=5;

}

async function loadMostRecent(){
        let str = "loadReplyR~.&~"+route.params.title+"~.&~"+0
        const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
        });
        const data = await response.json();
        let repArr = [data[0]["reply"], data[0]["author"], data[0]["date"]]
        replies.value.unshift(repArr)
        loadedReplies+=1;
}


let postHeaderData = ref(["loading...","loading...","loading...","loading..."])

onMounted(async () => {

      var str = "postInfo~.&~"+route.params.title

      const response =  await fetch(backendAPI, {
          method: "POST",
          body: str
      });

      const data = await response.json();
      postHeaderData.value[0]   = data[0]["title"]
      postHeaderData.value[1]   = data[0]["author"]
      postHeaderData.value[2]  = data[0]["date"]
      postHeaderData.value[3]  = data[0]["post"]

      loadMore();        
})

      
let cut = "@"
let slash = "$"

async function hashToUser(hash){
    let str = "hashToUser~.&~"+hash
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });

    const data = await response.json()
    return data[0]["username"]     

}

async function insertReply(reply,author){
    let str = "insertReply~.&~"+author+"~.&~"+reply+"~.&~"+route.params.title
    console.log(str)
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });
    repActive.value = false;
    await loadMostRecent();
  
    
}

async function postReply(){
    let reply = document.getElementById("replyText").value
    let strs = route.path.split('/');
    let author = await hashToUser(strs[3])
    await insertReply(reply,author)
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


let repActive = ref(false)
let repVerd = false

async function rep(){
    if(!repVerd){
        let strs = route.path.split('/');
        console.log(strs)
        repVerd = await check(strs[3]);
    }
    if(repVerd){
      repActive.value = !repActive.value
    }else{
        let cache = route.path.replaceAll("/",".$FAT")
        router.push("/login/"+cache)
    }
    
}

</script>

<template>
  <Top />
  <div class="all">
        <div class="header">
          <h1 id="title">
            {{postHeaderData[0]}}
          </h1>
          <div class="postCont">
            <span class="author">{{postHeaderData[1]}}</span>
            <span class="time">{{ postHeaderData[2] }}</span>
          </div>
          <div> 
            {{ postHeaderData[3] }}
          </div>
        </div>
        <br>
        <div>
          <div class="reply" @click="rep()" >
            REPLY
          </div>
          <div v-if="repActive">
            <div class="textBox">
              <textarea id="replyText" ></textarea>
              <div class="buttonPos">
                <button @click="postReply()" >sumbit</button>
              </div>
            </div>
          </div>
        </div>
        <div v-for="data in replies">
        <!-- I know its strange that the replies are not be derefed by replies.value, I have no idea why this is working -->
          <Reps :text=data[0] :auth=data[1] :date=data[2] :hash="route.params.title+slash+data[1]+cut+data[2]" :level=1 />
        </div>
        <div class="textButton" @click="loadMore()">
          SHOW MORE
        </div>
  </div>

  
  
 
  
        <!-- <Reps :key=route.params.title :level=1 /> -->

</template>

<style scoped>
.reply{
  letter-spacing: 3px;
}
.textButton{
  letter-spacing: 3px;
}
.reply:hover{
  font-weight: bold;
  color:rgb(0, 143, 64);
}
.textButton:hover{
  font-weight: bold;
  color:rgb(0, 143, 64);
}
.buttonPos{
  position: relative;
  background-color: aliceblue;
  height: 36px;
  width:100%;
}
.textBox{
  background-color: aliceblue;
  border-radius: 10px;
  border: 3px solid black;
}
button{
  background-color: rgb(0, 136, 255);
  padding: 5px;
  color:rgb(255, 255, 255);
  border: rgba(250, 235, 215, 0);
  border: 1px transparent black;
  margin-top: 10px;
  position: absolute;
  right:0;
}
textarea{
  border-color: rgba(240, 248, 255, 0);
  background-color: rgba(0, 0, 0, 0);
  width:100%;
  height:100px;
  font-family:Arial;
  font-size:13px;
}
.reply{
  position: relative;
  direction: rtl;
}
.header{
  border-bottom: 3px solid rgba(255, 255, 255, 0.265);
  padding-bottom: 40px;
}
.postCont{
  margin-top: 10px;
  margin-bottom:40px;

}
.time{
  margin-left:100px;

}

.all{
  margin:auto;
  max-width:1200px;
  padding-top: 50px;
  padding-bottom: 100px;
  padding-left: 25px;
  padding-right: 25px;

}

@media (max-width: 767px) {

}

@media (max-width: 1023px) and (min-width: 768px) {
    .time{
      margin-left: 100px;
    }
}

</style>