<script setup>
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
import LoadModelButton from '@/components/LoadModelButton.vue'
</script>

<template>
  <div>
    <LoadModelButton />
    <ChatBubble :message="mesadwasssage" :user="user" />
    <ChatroomBox />
  </div>
</template>
