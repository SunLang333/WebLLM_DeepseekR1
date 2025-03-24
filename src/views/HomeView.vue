<script setup>
import { ref } from 'vue'
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
import StreamContainer from '@/components/StreamContainer.vue'

const chatHistory = ref([])
// This holds the current prompt which will trigger streaming.
const currentPrompt = ref('')
// This will temporarily hold the streaming output.
const currentStream = ref('')
// This will hold the index of the bot message being updated.
const currentBotIndex = ref(null)

// Define the callback at top-level
const onStreamUpdate = (partialText) => {
  // Append the new partial text to the currentStream value.
  currentStream.value += partialText
  // Update the correct chat bubble message if available.
  if (currentBotIndex.value !== null) {
    chatHistory.value[currentBotIndex.value].message = currentStream.value
  }
}

// Add message from ChatroomBox
const addMessage = (payload) => {
  if (payload.message && payload.message.trim() !== '') {
    // User message sent.
    chatHistory.value.push({ user: 'You', message: payload.message })
    // Add a placeholder for the bot response.
    chatHistory.value.push({ user: 'Bot', message: '' })
    // Get the index for the bot message.
    const botMsgIndex = chatHistory.value.length - 1
    // Store the index so our streaming callback knows where to update.
    currentBotIndex.value = botMsgIndex

    // Set the current prompt. This prop will be passed to StreamContainer.
    currentPrompt.value = payload.message
    // Clear previous streaming output.
    currentStream.value = ''
  }
}
</script>

<template>
  <div>
    <!-- Pass the currentPrompt to StreamContainer and listen for updates. -->
    <StreamContainer v-if="currentPrompt" :prompt="currentPrompt" @stream-update="onStreamUpdate" />
    <!-- Render chat bubbles for each message -->
    <div v-for="(chat, index) in chatHistory" :key="index">
      <ChatBubble :message="chat.message" :user="chat.user" />
    </div>
    <ChatroomBox @submit="addMessage" />
  </div>
</template>
