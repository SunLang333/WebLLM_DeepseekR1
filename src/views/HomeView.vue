<script setup>
import { ref } from 'vue'
import ChatBubble from '@/components/ChatBubble.vue'
import ChatroomBox from '@/components/ChatroomBox.vue'
import StreamContainer from '@/components/StreamContainer.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'

const chatHistory = ref([])
// Holds the current prompt to trigger streaming.
const currentPrompt = ref('')
// Holds the streaming results.
const currentStream = ref('')
// Index of the bot message in the chat history.
const currentBotIndex = ref(null)

const loadingProgress = ref(0)
const modelLoaded = ref(false)
// Track if generation is in progress.
const isGenerating = ref(false)

const updateLoadingProgress = (val) => {
  loadingProgress.value = val
}

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

// Called when the generation process in StreamContainer is done.
const onFinishedGeneration = () => {
  isGenerating.value = false
}

// Add a new chat message.
const addMessage = (payload) => {
  if (payload.message && payload.message.trim() !== '') {
    // Start generation flag
    isGenerating.value = true
    chatHistory.value.push({ user: 'You', message: payload.message })
    chatHistory.value.push({ user: 'DeepSeekR1DistillQwen', message: '' })
    currentBotIndex.value = chatHistory.value.length - 1
    currentPrompt.value = payload.message
    currentStream.value = ''
  }
}
</script>

<template>
  <div>
    <!-- Hidden load-only StreamContainer -->
    <StreamContainer
      load-only
      @loading-progress="updateLoadingProgress"
      @model-loaded="handleModelLoaded"
    />

    <div v-if="!modelLoaded">
      <p>Loading model from huggingface... (doesn't require connection if cached)</p>
      <ProgressIndicator :ProgressPercentage="loadingProgress" />
    </div>

    <div v-else>
      <!-- When a prompt is present, mount a streaming container -->
      <StreamContainer
        v-if="currentPrompt"
        :prompt="currentPrompt"
        @stream-update="onStreamUpdate"
        @finished="onFinishedGeneration"
      />

      <!-- Chat bubbles container with bottom padding -->
      <div style="padding-bottom: 200px">
        <div v-for="(chat, index) in chatHistory" :key="index">
          <ChatBubble :message="chat.message" :user="chat.user" />
        </div>
      </div>

      <!-- Pass disabled prop to ChatroomBox -->
      <ChatroomBox :disabled="isGenerating" @submit="addMessage" />
    </div>
  </div>
</template>
