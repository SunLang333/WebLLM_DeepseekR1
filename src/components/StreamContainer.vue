<template>
  <!-- This component does not render anything visible; it only emits streaming updates -->
  <div></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { pipeline, TextStreamer } from '@huggingface/transformers'

const props = defineProps({
  prompt: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['stream-update'])

let generator = null
const initGenerator = async () => {
  generator = await pipeline('text-generation', 'Xenova/Phi-3-mini-4k-instruct', {
    device: 'webgpu',
  })
}
onMounted(async () => {
  await initGenerator()
})

watch(
  () => props.prompt,
  async (newPrompt) => {
    if (!generator || !newPrompt.trim()) return

    const messages = [{ role: 'user', content: newPrompt }]
    const streamer = new TextStreamer(generator.tokenizer, {
      skip_prompt: true,
      callback_function: (partialText) => {
        // Log every received partial text (word)
        console.log('Generated word:', partialText)
        emit('stream-update', partialText)
      },
    })

    await generator(messages, {
      max_new_tokens: 512,
      do_sample: false,
      streamer,
    })
  },
  { immediate: false },
)
</script>
