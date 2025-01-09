<script setup>

import {useRoute, useRouter} from 'vue-router'
import { onMounted,ref } from 'vue'
import Reps from './Reps.vue'

const route = useRoute()
const router = useRouter()
const backendAPI = "https://forumbackedn.onrender.com"


const props = defineProps({
    level:Number,
    hash:String,
    text:String,
    auth:String,
    date:String
})


let replies = ref([])


let loadedReplies = 0

async function loadMore(){
          let str = "loadReplyR~.&~"+props.hash+"~.&~"+loadedReplies
          console.log(str)
          const response =  await fetch(backendAPI, {
              method: "POST",
              body: str
          });
          const data = await response.json();
          console.log(data)
          for(let rep of data){
            let hash = props.hash+"$"+rep["author"]+"@"+rep["date"]
            let repArr = [rep["reply"], rep["author"], rep["date"], hash]
            replies.value.push(repArr)
          }
          
          loadedReplies+=3;
}

async function loadMostRecent(){
        let str = "loadReplyR~.&~"+props.hash+"~.&~"+0
        const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
        });
        const data = await response.json();
        let hash = props.hash+"$"+data[0]["author"]+"@"+data[0]["date"]
        let repArr = [data[0]["reply"], data[0]["author"], data[0]["date"], hash]
        replies.value.unshift(repArr)
        
        loadedReplies+=1;
}





let reps = ref(props.level<4?true:false);

async function showReps(obj){    
    loadMore();
    reps.value = !reps.value;
    if(reps.value){
        document.getElementById(props.hash).innerText = "+++HIDE REPLIES+++"
    }else{
        document.getElementById(props.hash).innerText =  "+++SHOW REPLIES+++"
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


let repOn = ref(false);
let repVerd = false
async function repActive(){
    if(!repVerd){
        let strs = route.path.split('/');
        console.log(strs)
        repVerd = await check(strs[3]);
    }
    console.log(repVerd)
    if(repVerd){
        repOn.value = !repOn.value
    }else{
        let cache = route.path.replaceAll("/",".$FAT")
        router.push("/login/"+cache)
    }
}

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
    let str = "insertReply~.&~"+author+"~.&~"+reply+"~.&~"+props.hash
    console.log(str)
    const response =  await fetch(backendAPI, {
            method: "POST",
            body: str
    });
    repOn.value = false;
    await loadMostRecent();
    reps.value = true;
}

async function sumbitReply(){
    let reply = document.getElementById(TextHashHeader+props.hash).value
    let strs = route.path.split('/');
    let author = await hashToUser(strs[3])
    await insertReply(reply,author)
}

let ReplyHashHeader = "R@"
let TextHashHeader = "RI@"
let ButtonReplyHashHeader = "BR@"

</script>

<template>
    <div class="response">
        <div>
            <span id="auth">{{auth}}</span>
            <span class="time" id="time"> {{date}}</span>
        </div>
        <div id="post">{{ text }}</div>
    </div>
        <div id = "reps">
            <div>
                <div class="replyButton" :id=ReplyHashHeader+hash @click="repActive()">
                    REPLY
                </div>
                <div v-if="repOn">

                    <div class="textBox">
                        <textarea :id=TextHashHeader+hash ></textarea>
                        <div class="buttonPos">
                            <button @click="sumbitReply()" :id=ButtonReplyHashHeader+hash>sumbit</button>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <div class="replyShow" :id=hash @click="showReps(this)" >
                    +++SHOW REPLIES+++
                </div>
                <div v-if="reps || level<4"> 
                    <div v-for="data in replies">
                        <Reps :level=level+1 :text=data[0] :auth=data[1] :date=data[2] :hash=data[3] />
                    </div>

                    <div class="textButton" @click="loadMore()"> 
                       SHOW MORE 
                    </div>
                </div>
                
            </div>
            <!--  How do i make an indentifier for SQL changes?-->
        </div>            
</template>

<style scope>
.replyShow{
    letter-spacing: 3px;
}
.replyShow:hover{
  font-weight: bold;
  color:rgb(0, 143, 64);
}

.textButton:hover{
  font-weight: bold;
  color:rgb(0, 143, 64);
}
.textButton{
  letter-spacing: 3px;
}
.time{
    margin-left:100px;
}
.textBox{
  background-color: aliceblue;
  border-radius: 10px;
  border: 3px solid black;
}
.buttonPos{
  position: relative;
  background-color: aliceblue;
  height: 36px;
  width:100%;
}
textarea{
  border-color: rgba(240, 248, 255, 0);
  background-color: rgba(0, 0, 0, 0);
  width:100%;
  height:100px;
  font-family:Arial;
  font-size:13px;
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
.replyButton:hover{
  font-weight: bold;
  color:rgb(0, 143, 64);
}
.replyButton{
    letter-spacing: 3px;
    direction: rtl;
}
.response{
    border-left: 3px solid rgba(255, 255, 255, 0.559);
    padding-left: 10px;
}
#reps{
    border-color: black;
    margin-left: 20px;
}
</style>