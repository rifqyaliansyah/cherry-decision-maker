<template>
    <div ref="containerRef"
        class="bg-base-100 h-[calc(100vh-180px)] md:h-96 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
        <ChatMessage v-for="message in messages" :key="message.id" :message="message" />

        <!-- Loading indicator -->
        <div v-if="isLoading" class="chat chat-start">
            <div class="chat-image avatar hidden md:flex">
                <div class="w-10 rounded-full">
                    <img :alt="aiProfile.name" :src="aiProfile.avatar" />
                </div>
            </div>
            <div class="chat-bubble flex items-center gap-2">
                <span class="loading loading-dots loading-sm"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { USER_PROFILES } from '~/utils/aiResponses'

defineProps({
    messages: Array,
    isLoading: Boolean
})

const containerRef = ref(null)
const aiProfile = USER_PROFILES.ai
</script>