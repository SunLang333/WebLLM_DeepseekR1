<template>
  <div class="generator-container">
    <!-- 输入区域 -->
    <div class="input-section">
      <textarea
        v-model="inputText"
        placeholder="Enter your story beginning..."
        class="text-input"
      ></textarea>
      <button @click="generateText" :disabled="isGenerating" class="generate-btn">
        {{ isGenerating ? 'Generating...' : 'Generate' }}
      </button>
    </div>

    <!-- 输出展示 -->
    <div class="output-section">
      <div v-if="generatedText" class="result-box">
        <h3>Generated Story:</h3>
        <p class="generated-text">{{ generatedText }}</p>
      </div>
      <div v-else class="placeholder">Your AI-generated story will appear here...</div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>Initializing AI model...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pipeline, env } from '@huggingface/transformers'

//env.allowLocalModels = true

// 响应式数据
const inputText = ref('Once upon a time,')
const generatedText = ref('')
const isGenerating = ref(false)
const loading = ref(true)
let generator = null

// 生命周期钩子
onMounted(async () => {
  try {
    // 初始化模型 [6](@ref)
    generator = await pipeline('text-generation', '@Xenova/distilgpt2/', {
      progress_callback: () => (loading.value = false),
      //local_files_only: true,
    })
  } catch (error) {
    console.error('Model loading failed:', error)
    loading.value = false
  }
})

// 生成文本方法
const generateText = async () => {
  if (!generator || isGenerating.value) return

  isGenerating.value = true
  try {
    const output = await generator(inputText.value, {
      max_new_tokens: 64,
      do_sample: true,
      temperature: 0.7,
      repetition_penalty: 1.5,
    })
    generatedText.value = output[0].generated_text
  } catch (error) {
    console.error('Generation error:', error)
    generatedText.value = 'Error generating text'
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.generator-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.text-input {
  width: 100%;
  height: 120px;
  padding: 15px;
  margin-bottom: 1rem;
  border: 2px solid #42b983;
  border-radius: 8px;
  font-size: 16px;
}

.generate-btn {
  background-color: #42b983;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.output-section {
  margin-top: 2rem;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
