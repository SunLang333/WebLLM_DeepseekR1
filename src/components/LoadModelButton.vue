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
      'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX',
      {
        // Uncomment the line below if you need to load model files locally
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
