<template>
  <button @click="loadModel" :disabled="isLoading || modelLoaded">
    {{ isLoading ? 'Loading model...' : modelLoaded ? 'Model Loaded' : 'Load Model' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { pipeline, TextStreamer } from '@huggingface/transformers'

const isLoading = ref(false)
const modelLoaded = ref(false)
let modelPipeline = null

const loadModel = async () => {
  if (isLoading.value || modelLoaded.value) return

  isLoading.value = true
  try {
    modelPipeline = await pipeline(
      'text-generation',
      //'Xenova/Phi-3-mini-4k-instruct',
      'Xenova/distilgpt2',
      {
        // additional options if needed
      },
    )
    modelLoaded.value = true
    console.log('Model loaded successfully.')
  } catch (error) {
    console.error('Failed to load model:', error)
  } finally {
    isLoading.value = false
  }
}

async function generateText(prompt, onUpdate) {
  if (!modelPipeline) {
    console.error('Model pipeline is not initialized.')
    return 'Model not loaded'
  }
  const templatedPrompt = `Please generate a creative response based on the following text:\n\n"${prompt}"\n\nResponse:`

  // Create an accumulator for partial text updates.
  let accumulated = ''

  // Create a new TextStreamer instance with a callback that appends to the accumulator.
  const streamer = new TextStreamer(modelPipeline.tokenizer, {
    skip_prompt: true,
    callback_function: (partialText) => {
      accumulated += partialText
      if (typeof onUpdate === 'function') {
        onUpdate(accumulated)
      }
    },
  })

  // Call the pipeline with the streaming option.
  await modelPipeline(templatedPrompt, {
    max_length: 100,
    do_sample: true,
    temperature: 0.7,
    streamer,
  })

  return accumulated || 'No text generated'
}

defineExpose({ generateText, loadModel })
</script>

<style scoped>
button {
  padding: 12px 24px;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
