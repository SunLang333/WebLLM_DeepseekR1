<template>
  <form @submit.prevent="sendMessage">
    <div
      class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      id="chatroom-box"
    >
      <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
        <label for="comment" class="sr-only">Send message</label>
        <textarea
          id="comment"
          rows="4"
          class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Your message here..."
          v-model="message"
          required
        ></textarea>
      </div>
      <div
        class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200"
      >
        <button
          type="submit"
          :disabled="disabled"
          class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          Send
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      message: '',
      history: {},
    }
  },
  methods: {
    sendMessage() {
      const key = new Date().toISOString()
      this.history[key] = this.message
      this.$emit('submit', { message: this.message, history: this.history })
      this.message = ''
    },
  },
}
</script>

<style scoped>
#chatroom-box {
  height: auto;
  position: fixed;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  max-width: calc(100vw - 2rem);
  padding: 1rem;
}
</style>
