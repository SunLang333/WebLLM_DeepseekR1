<script setup>
import { ref } from 'vue'
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
import StreamContainer from '@/components/StreamContainer.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'

const chatHistory = ref([])
// This holds the current prompt to trigger streaming.
const currentPrompt = ref('')
// Will hold the streaming results.
const currentStream = ref('')
// Index of the bot message in the chat history.
const currentBotIndex = ref(null)

// Model loading progress state
const loadingProgress = ref(0)
const modelLoaded = ref(false)

// Update progress from events emitted by StreamContainer.
const updateLoadingProgress = (val) => {
  loadingProgress.value = val
}

// Handle the model-loaded event.
const handleModelLoaded = () => {
  modelLoaded.value = true
  loadingProgress.value = 100
}

// Callback for streaming updates.
const onStreamUpdate = (partialText) => {
  currentStream.value += partialText
  if (currentBotIndex.value !== null) {
    chatHistory.value[currentBotIndex.value].message = currentStream.value
  }
}

// Add a new chat message.
const addMessage = (payload) => {
  if (payload.message && payload.message.trim() !== '') {
    chatHistory.value.push({ user: 'You', message: payload.message })
    chatHistory.value.push({ user: 'Bot', message: '' })
    currentBotIndex.value = chatHistory.value.length - 1
    currentPrompt.value = payload.message
    currentStream.value = ''
  }
}
</script>

<template>
  <div>
    <!-- Always mount a hidden load-only StreamContainer to load the model on page open -->
    <StreamContainer
      load-only
      @loading-progress="updateLoadingProgress"
      @model-loaded="handleModelLoaded"
    />

    <!-- Show the progress indicator until the model is loaded -->
    <div v-if="!modelLoaded">
      <p>Loading model from huggingface... (doens't require connection if cached)</p>
      <ProgressIndicator :ProgressPercentage="loadingProgress" />
    </div>

    <!-- Once loaded, show the chat UI -->
    <div v-else>
      <!-- When a prompt is present, mount a streaming container to process it -->
      <StreamContainer
        v-if="currentPrompt"
        :prompt="currentPrompt"
        @stream-update="onStreamUpdate"
      />
      <!-- Render chat bubbles -->
      <div v-for="(chat, index) in chatHistory" :key="index">
        <ChatBubble :message="chat.message" :user="chat.user" />
      </div>
      <ChatroomBox @submit="addMessage" />
    </div>
  </div>
</template>
