<script setup lang="ts">
import type { Message } from '@/models/data'

const props = defineProps<{
    msg: Message;
}>();

// console.log('props.msg', props.msg)

</script>

<template>
    <div>
        {{ msg.value }}
    </div>
</template>

<script scope>
</script>