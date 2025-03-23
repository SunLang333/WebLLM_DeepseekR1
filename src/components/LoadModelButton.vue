<template>
  <button @click="loadModel" :disabled="isLoading || modelLoaded">
    {{ isLoading ? 'Loading model...' : modelLoaded ? 'Model Loaded' : 'Load Model' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { pipeline } from '@huggingface/transformers'

const isLoading = ref(false)
const modelLoaded = ref(false)
let modelPipeline = null

const loadModel = async () => {
  if (isLoading.value || modelLoaded.value) return

  isLoading.value = true
  try {
    modelPipeline = await pipeline(
      'text-generation',
      'Xenova/distilgpt2',
      //'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX',
      //'Xenova/Phi-3-mini-4k-instruct',
      {
        // local_files_only: true,
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

async function generateText(prompt) {
  if (!modelPipeline) {
    console.error('Model pipeline is not initialized.')
    return 'Model not loaded'
  }
  // Build a template string around the prompt. For example:
  const templatedPrompt = `Please generate a creative response based on the following text:\n\n"${prompt}"\n\nResponse:`

  // Wait for the pipeline to return generated text using the templated prompt
  const results = await modelPipeline(templatedPrompt, {
    max_length: 100,
    do_sample: true,
    temperature: 0.7,
  })
  // Extract the generated text from the first result
  return results && results[0] && results[0].generated_text
    ? results[0].generated_text
    : 'No text generated'
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
