<template>
    <div class="mockup-browser-toolbar hidden md:flex">
        <div class="input input-sm w-full max-w-xs">ai-chat.app</div>
        <button class="btn btn-sm btn-ghost ml-2" @click="$emit('new-chat')" :disabled="isLoading"
            title="Start new conversation">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
        </button>
    </div>

    <div class="flex md:hidden items-center justify-between bg-base-200 px-4 py-3 border-b border-base-300">
        <h1 class="text-lg font-semibold">AI Chat</h1>
        <button class="btn btn-sm btn-ghost btn-circle" @click="$emit('new-chat')" :disabled="isLoading"
            title="Start new conversation">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
</template>

<script setup>
defineProps({
    isLoading: Boolean
})

defineEmits(['new-chat'])
</script>