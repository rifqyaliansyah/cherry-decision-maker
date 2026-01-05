export class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    async checkHealth() {
        return this.request('/health')
    }

    async createSession() {
        return this.request('/session/new', {
            method: 'POST'
        })
    }

    async sendMessage(sessionId, message) {
        return this.request('/chat', {
            method: 'POST',
            body: JSON.stringify({ sessionId, message })
        })
    }
}