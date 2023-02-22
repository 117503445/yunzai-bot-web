<template>
  <!-- <div id="chat-box"> -->
    <n-scrollbar style="max-height: 120px">
      <Chat v-for="item in cardItems" :msg="item" />
    </n-scrollbar>
  <!-- </div> -->


  <!-- <n-button @click="btnClick">Chat test</n-button> -->
  <n-input v-model:value="inputText" type="text" placeholder="基本的 Input" @keyup="handleKeyUp" :loading="inputIsLoading" />
</template>
  
<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
import { NButton, NInput, NScrollbar } from 'naive-ui'
import axios from 'axios';
import { ref } from 'vue'
import Chat from '@/components/Chat.vue'
import * as service from './service'
import type { Message } from '@/models/data'
function btnClick() {

}

async function handleKeyUp(e: KeyboardEvent) {
  if (e.key == 'Enter') {
    inputIsLoading.value = true

    let chat = inputText.value;
    inputText.value = "";

    cardItems.value.push({
      type: "text",
      value: chat,
      isUserInput: true,
    })

    // error handle, https://github.com/scopsy/await-to-js
    let tokens = await service.postChat(chat)
    console.log(tokens)
    tokens.forEach(token => {
      cardItems.value.push({
        type: token.type,
        value: token.value,
        isUserInput: false,
      })
    });
    inputIsLoading.value = false
  }
}

let inputText = ref("");
let inputIsLoading = ref(false);

// TODO: type
let cardItems = ref([] as Message[]);
</script>

<style>
#chat-box {
  overflow: scroll;
}
</style>