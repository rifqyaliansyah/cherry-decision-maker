import { ref, nextTick } from 'vue'

export const useChat = () => {
    const messages = ref([
        {
            id: 1,
            content: "Hello! I'm your AI assistant. How can I help you today?",
            role: 'assistant',
            createdAt: new Date().toISOString()
        }
    ])

    const inputMessage = ref('')
    const isLoading = ref(false)
    const chatContainer = ref(null)

    const scrollToBottom = async () => {
        await nextTick()
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
    }

    const sendMessage = async (aiResponses) => {
        if (!inputMessage.value.trim() || isLoading.value) return

        const userMessage = inputMessage.value.trim()

        messages.value.push({
            id: Date.now(),
            content: userMessage,
            role: 'user',
            createdAt: new Date().toISOString()
        })

        inputMessage.value = ''
        await scrollToBottom()

        isLoading.value = true
        await scrollToBottom()

        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

            messages.value.push({
                id: Date.now(),
                content: randomResponse,
                role: 'assistant',
                createdAt: new Date().toISOString()
            })

            await scrollToBottom()

        } catch (error) {
            console.error('Error sending message to AI:', error)

            messages.value.push({
                id: Date.now(),
                content: "Sorry, I encountered an error. Please try again.",
                role: 'assistant',
                createdAt: new Date().toISOString()
            })

            await scrollToBottom()
        } finally {
            isLoading.value = false
        }
    }

    const newChat = () => {
        if (isLoading.value) return

        messages.value = [
            {
                id: 1,
                content: "Hello! I'm your AI assistant. How can I help you today?",
                role: 'assistant',
                createdAt: new Date().toISOString()
            }
        ]
        inputMessage.value = ''
        scrollToBottom()
    }

    return {
        messages,
        inputMessage,
        isLoading,
        chatContainer,
        scrollToBottom,
        sendMessage,
        newChat
    }
}