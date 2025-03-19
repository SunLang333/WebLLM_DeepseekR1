<script setup>
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
</script>

<template>
  <div>
    <ChatBubble :message="mesadwasssage" :user="user" />
    <ChatroomBox />
  </div>
</template>
