<script setup>
import { onMounted, ref } from 'vue'
import { useChat } from '~/composables/useChat'
import { AI_RESPONSES } from '~/utils/aiResponses'

const {
    messages,
    inputMessage,
    isLoading,
    chatContainer,
    scrollToBottom,
    sendMessage,
    newChat
} = useChat()

onMounted(() => {
    scrollToBottom()
})

const handleSendMessage = () => {
    sendMessage(AI_RESPONSES)
}
</script>

<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-base-200 p-2 md:p-4">
        <div class="mockup-browser border border-base-300 w-full max-w-3xl">
            <ChatHeader :is-loading="isLoading" @new-chat="newChat" />
            
            <div ref="chatContainer" class="bg-base-100 h-[calc(100vh-180px)] md:h-96 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                <ChatMessage v-for="message in messages" :key="message.id" :message="message" />

                <div v-if="isLoading" class="chat chat-start">
                    <div class="chat-image avatar hidden md:flex">
                        <div class="w-10 rounded-full">
                            <img alt="AI Assistant" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2QVqggJZ4ad3CxoN9z9WDM--TkrdeSv5K4A&s" />
                        </div>
                    </div>
                    <div class="chat-bubble flex items-center gap-2">
                        <span class="loading loading-dots loading-sm"></span>
                    </div>
                </div>
            </div>
            
            <ChatInput 
                v-model="inputMessage" 
                :is-loading="isLoading" 
                @send-message="handleSendMessage" 
            />
        </div>
    </div>
</template>