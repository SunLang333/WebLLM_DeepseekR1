import { pipeline, TextStreamer } from '@huggingface/transformers'

// Using ref to hold the generator instance (for a Composition API feel)
let generator = null

async function initializeGenerator() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/Phi-3-mini-4k-instruct', {
      device: 'webgpu',
    })
  }
  return generator
}

// Function that encapsulates the text generation logic (similar to a composable)
export function useTextGeneration() {
  // State (using ref for consistency with Composition API)
  // (Not reactive outside of Vue's setup context)
  // const isGenerating = ref(false); // We can manage loading state in the Vue component

  // Actions (functions that perform the logic)
  async function generateText(messages, onNewText) {
    const gen = await initializeGenerator()
    if (!gen) {
      console.error('Generator not initialized.')
      return ''
    }

    let generatedText = ''
    const streamer = new TextStreamer(gen.tokenizer, {
      skip_prompt: true,
      callback_function: (text) => {
        generatedText += text
        if (onNewText) {
          onNewText(text)
        }
      },
    })

    try {
      const output = await gen(messages, { max_new_tokens: 512, do_sample: false, streamer })
      console.log('Full output:', output)
      console.log('Final generated text:', generatedText)
      return generatedText
    } catch (error) {
      console.error('Error during text generation:', error)
      return 'Error generating response.'
    }
  }

  // Return the functionality (similar to what a composable returns)
  return {
    generateText,
    // You could potentially return other related functions or state here
  }
}
