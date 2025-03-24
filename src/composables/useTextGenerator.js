import { ref } from 'vue'
import { pipeline, TextStreamer } from '@huggingface/transformers'

// Hold the generator and related state in reactive variables.
const generator = ref(null)
const isLoading = ref(false)
const modelLoaded = ref(false)

// Function that loads and caches the generator.
async function loadGenerator() {
  if (!generator.value) {
    isLoading.value = true
    // Load the pipeline; change the model name or options as needed.
    generator.value = await pipeline('text-generation', 'Xenova/Phi-3-mini-4k-instruct', {
      device: 'webgpu',
    })
    modelLoaded.value = true
    isLoading.value = false
  }
  return generator.value
}

// Exported composable which returns the generator and some status flags.
export function useTextGenerator() {
  return {
    loadGenerator,
    generator,
    isLoading,
    modelLoaded,
    // Utility function to create a streamer and generate text for a prompt.
    async generate(prompt, onUpdate) {
      if (!generator.value) {
        await loadGenerator()
      }
      const messages = [{ role: 'user', content: prompt }]
      let accumulated = ''
      const streamer = new TextStreamer(generator.value.tokenizer, {
        skip_prompt: true,
        callback_function: (partialText) => {
          accumulated += partialText
          if (onUpdate) onUpdate(partialText)
        },
      })
      await generator.value(messages, { max_new_tokens: 512, do_sample: false, streamer })
      return accumulated
    },
  }
}
