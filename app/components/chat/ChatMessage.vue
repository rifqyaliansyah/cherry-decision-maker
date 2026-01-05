<template>
    <div class="chat" :class="message.role === 'user' ? 'chat-end' : 'chat-start'">
        <div class="chat-image avatar hidden md:flex">
            <div class="w-10 rounded-full">
                <img :alt="profile.name" :src="profile.avatar" />
            </div>
        </div>
        <div class="chat-header mb-1 md:block">
            {{ profile.name }}
        </div>
        <div class="chat-bubble text-sm md:text-base" :class="message.role === 'user' ? 'chat-bubble-primary' : ''">
            {{ message.content }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { USER_PROFILES } from '~/utils/aiResponses'

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

const profile = computed(() => {
    return props.message.role === 'user' ? USER_PROFILES.user : USER_PROFILES.ai
})
</script>