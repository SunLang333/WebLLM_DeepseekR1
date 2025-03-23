<script setup>
import { ref } from 'vue'
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
import LoadModelButton from '@/components/LoadModelButton.vue'

const chatHistory = ref([])
const loadModelButtonRef = ref(null)

const addMessage = async (payload) => {
  if (payload.message && payload.message.trim() !== '') {
    chatHistory.value.push({ user: 'You', message: payload.message })

    try {
      const generatedMessage = await loadModelButtonRef.value.generateText(payload.message)
      chatHistory.value.push({ user: 'Bot', message: generatedMessage })
    } catch (error) {
      console.error(error)
      chatHistory.value.push({ user: 'Bot', message: 'Error generating response.' })
    }
  }
}
</script>

<template>
  <div>
    <LoadModelButton ref="loadModelButtonRef" />
    <!-- Render chat bubbles for each message -->
    <div v-for="(chat, index) in chatHistory" :key="index">
      <ChatBubble :message="chat.message" :user="chat.user" />
    </div>
    <ChatroomBox @submit="addMessage" />
  </div>
</template>
