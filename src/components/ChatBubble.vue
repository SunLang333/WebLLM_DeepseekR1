<template>
  <div class="flex items-start gap-2.5" id="chat-bubble">
    <img class="w-8 h-8 rounded-full" src="@/assets/DTianHao.jpg" alt="Jese image" />
    <div
      class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700"
    >
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
        <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ user }}</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
        {{ message }}
      </p>
    </div>

    <div
      id="dropdownDots"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700 dark:divide-gray-600"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownMenuIconButton"
      >
        <li>
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Reply</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Forward</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Copy</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Report</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Delete</a
          >
        </li>
      </ul>
    </div>
  </div>
  <br />
</template>

<script>
export default {
  name: 'ChatBubble',
  props: {
    message: {
      type: String,
      default: 'Some text here',
    },
    user: {
      type: String,
      default: 'AI Assistant:',
    },
  },
  data() {
    return {}
  },
}
</script>
