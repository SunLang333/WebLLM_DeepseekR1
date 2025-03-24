<template>
  <!-- This component does not render anything visible -->
  <div style="display: none"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useTextGenerator } from '@/composables/useTextGenerator'

const props = defineProps({
  prompt: { type: String, default: '' },
  loadOnly: { type: Boolean, default: false },
})
const emit = defineEmits(['stream-update', 'model-loaded', 'loading-progress'])

const { loadGenerator, generate } = useTextGenerator()

onMounted(async () => {
  // Simulate progress updates until the model is loaded.
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    if (progress < 90) {
      emit('loading-progress', progress)
    } else {
      emit('loading-progress', 90)
      clearInterval(interval)
    }
  }, 300)

  await loadGenerator()
  emit('loading-progress', 100)
  emit('model-loaded')
})

// If not in load-only mode, watch for the prompt and stream the response.
if (!props.loadOnly) {
  watch(
    () => props.prompt,
    async (newPrompt) => {
      if (!newPrompt.trim()) return
      console.log('Prompt Received!')
      // Use the shared generate function
      await generate(newPrompt, (partialText) => {
        console.log('Generated word:', partialText)
        emit('stream-update', partialText)
      })
      console.log('Finished Generating response.')
    },
    { immediate: true },
  )
}
</script>
