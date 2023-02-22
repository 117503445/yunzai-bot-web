<template>
  <main>
    <n-button @click="btnClick">Chat test</n-button>
    <n-input v-model:value="inputText" type="text" placeholder="基本的 Input" @keyup="handleKeyUp"
      :loading="inputIsLoading" />
  </main>
</template>
  
<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
import { NButton, NInput } from 'naive-ui'
import axios from 'axios';
import { ref } from 'vue'
import * as service from './service'
function btnClick() {

}

async function handleKeyUp(e: KeyboardEvent) {
  if (e.key == 'Enter') {
    inputIsLoading.value = true
    
    // let resp = await axios.post('http://localhost:8080/api/chat', )
    let tokens = await service.postChat(inputText.value)
    inputText.value = "";
    console.log(tokens)
    cardItems.value.push(tokens)
    inputIsLoading.value = false
  }
}

let inputText = ref("");
let inputIsLoading = ref(false);

// TODO: type
let arr: any[] = [];
let cardItems = ref(arr);
</script>