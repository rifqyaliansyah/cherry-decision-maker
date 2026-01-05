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
    const decisionData = ref(null)
    const calculationResults = ref(null)

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
                    content: "Maaf, saya tidak bisa terhubung ke server. Pastikan backend sedang berjalan.",
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
                // Clean message from JSON artifacts
                let cleanMessage = response.message

                // Remove JSON blocks that might be in the message
                cleanMessage = cleanMessage.replace(/```json\s*\{[\s\S]*?\}\s*```/g, '')
                cleanMessage = cleanMessage.replace(/\{[\s\S]*?"options"[\s\S]*?\}/g, '')
                cleanMessage = cleanMessage.trim()

                // Add AI response
                messages.value.push({
                    id: Date.now(),
                    content: cleanMessage,
                    role: 'assistant',
                    createdAt: new Date().toISOString()
                })

                // Update decision data if available
                if (response.decisionData) {
                    decisionData.value = response.decisionData
                    console.log('Decision data updated:', response.decisionData)
                }

                // Update calculation results if available
                if (response.calculated) {
                    calculationResults.value = {
                        calculated: true,
                        results: response.results,
                        summary: response.summary
                    }
                    console.log('Calculation completed:', calculationResults.value)
                }
            } else {
                throw new Error(response.error || 'Failed to get response')
            }

            await scrollToBottom()

        } catch (error) {
            console.error('Error sending message:', error)

            messages.value.push({
                id: Date.now(),
                content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
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

        // Delete old session if exists
        if (sessionId.value) {
            try {
                await apiClient.deleteSession(sessionId.value)
            } catch (error) {
                console.error('Failed to delete session:', error)
            }
        }

        // Reset state
        messages.value = [
            {
                id: 1,
                content: "Hai!👋 Saya di sini untuk bantu kamu membuat keputusan yang lebih baik. Ceritakan apa yang lagi kamu pertimbangkan, dan saya akan membantu menganalisisnya secara sistematis.",
                role: 'assistant',
                createdAt: new Date().toISOString()
            }
        ]
        inputMessage.value = ''
        decisionData.value = null
        calculationResults.value = null

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
        decisionData,
        calculationResults,
        scrollToBottom,
        sendMessage,
        newChat,
        initSession
    }
}