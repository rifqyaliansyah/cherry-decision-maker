import { ref, nextTick } from 'vue'
import { ApiClient } from '~/utils/api'

export const useChat = () => {
    const config = useRuntimeConfig()
    const apiClient = new ApiClient(config.public.apiBaseUrl)

    const messages = ref([
        {
            id: 1,
            content: "Hai!👋 Saya di sini untuk bantu kamu membuat keputusan yang lebih baik. Ceritakan apa yang lagi kamu pertimbangkan, dan saya akan membantu menganalisisnya secara sistematis.",
            role: 'assistant',
            createdAt: new Date().toISOString()
        }
    ])

    const inputMessage = ref('')
    const isLoading = ref(false)
    const chatContainer = ref(null)
    const sessionId = ref(null)

    const scrollToBottom = async () => {
        await nextTick()
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
    }

    // Initialize session
    const initSession = async () => {
        try {
            // Check health
            await apiClient.checkHealth()

            // Create session
            const sessionData = await apiClient.createSession()
            sessionId.value = sessionData.sessionId

            console.log('Session created:', sessionId.value)
            return true
        } catch (error) {
            console.error('Failed to initialize session:', error)
            return false
        }
    }

    const sendMessage = async () => {
        if (!inputMessage.value.trim() || isLoading.value) return

        // Check session
        if (!sessionId.value) {
            const initialized = await initSession()
            if (!initialized) {
                messages.value.push({
                    id: Date.now(),
                    content: "Sorry, I couldn't connect to the server. Please make sure the backend is running.",
                    role: 'assistant',
                    createdAt: new Date().toISOString()
                })
                await scrollToBottom()
                return
            }
        }

        const userMessage = inputMessage.value.trim()

        // Add user message
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
            // Send to backend
            const response = await apiClient.sendMessage(sessionId.value, userMessage)

            if (response.success) {
                messages.value.push({
                    id: Date.now(),
                    content: response.message,
                    role: 'assistant',
                    createdAt: new Date().toISOString()
                })
            } else {
                throw new Error(response.error || 'Failed to get response')
            }

            await scrollToBottom()

        } catch (error) {
            console.error('Error sending message:', error)

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

    const newChat = async () => {
        if (isLoading.value) return

        messages.value = [
            {
                id: 1,
                content: "Hai!👋 Saya di sini untuk bantu kamu membuat keputusan yang lebih baik. Ceritakan apa yang lagi kamu pertimbangkan, dan saya akan membantu menganalisisnya secara sistematis.",
                role: 'assistant',
                createdAt: new Date().toISOString()
            }
        ]
        inputMessage.value = ''

        // Create new session
        await initSession()
        await scrollToBottom()
    }

    return {
        messages,
        inputMessage,
        isLoading,
        chatContainer,
        sessionId,
        scrollToBottom,
        sendMessage,
        newChat,
        initSession
    }
}