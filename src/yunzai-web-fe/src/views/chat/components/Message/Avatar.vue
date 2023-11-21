<script lang="ts" setup>
interface Props {
  image?: boolean
}

defineProps<Props>()
</script>

<template>
  <img v-if="image" src="@/assets/avatar.jpg" class="object-cover w-full h-full " alt="avatar">
  <img v-else="image" src="@/assets/paimon.jpg" class="object-cover w-full h-full " alt="avatar">

</template>
