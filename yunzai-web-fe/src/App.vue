<!-- <script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>

  
</template>

<style scoped>
</style> -->
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import { defineComponent, h, ref } from 'vue'
import type { Component } from 'vue'
import type { MenuOption } from 'naive-ui'
import {
  SettingsOutline as SettingsIcon,
  ChatboxEllipsesOutline as ChatboxEllipsesIcon
} from '@vicons/ionicons5'

import { NIcon, NSpace, NSwitch, NLayout, NMenu, NLayoutSider } from 'naive-ui'
let activeKey = ref<string | null>(null);
let collapsed = ref(true);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'chat'
          }
        },
        { default: () => '聊天' }
      ),
    key: 'chat',
    icon: renderIcon(ChatboxEllipsesIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            // path: '/setting'
            name: 'setting'
          }
        },
        { default: () => '设置' }
      ),
    key: 'setting',
    icon: renderIcon(SettingsIcon),
  }
]
</script>

<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="130" :collapsed="collapsed"
        show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
          :options="menuOptions" />
      </n-layout-sider>
      <n-layout>
        <RouterView />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style></style>