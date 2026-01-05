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
            <!-- User message: plain text -->
            <span v-if="message.role === 'user'">{{ message.content }}</span>

            <!-- AI message: parsed markdown -->
            <div v-else class="markdown-content" v-html="parsedContent"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { USER_PROFILES } from '~/utils/aiResponses'
import { parseMarkdown } from '~/utils/markdown'

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

const profile = computed(() => {
    return props.message.role === 'user' ? USER_PROFILES.user : USER_PROFILES.ai
})

const parsedContent = computed(() => {
    if (props.message.role === 'assistant') {
        return parseMarkdown(props.message.content)
    }
    return props.message.content
})
</script>

<style scoped>
/* Claude.ai Style Markdown */
.markdown-content {
    line-height: 1.6;
    word-wrap: break-word;
}

/* Paragraf spacing - Claude style */
.markdown-content :deep(p) {
    margin: 0 0 1rem 0;
    white-space: pre-wrap;
}

.markdown-content :deep(p:last-child) {
    margin-bottom: 0;
}

/* Bold & Italic */
.markdown-content :deep(strong) {
    font-weight: 600;
}

.markdown-content :deep(em) {
    font-style: italic;
}

/* Lists - Claude style: compact tapi tetap breathable */
.markdown-content :deep(ol),
.markdown-content :deep(ul) {
    margin: 0.75rem 0;
    padding-left: 1.75rem;
}

.markdown-content :deep(ol) {
    list-style-type: decimal;
}

.markdown-content :deep(ul) {
    list-style-type: disc;
}

.markdown-content :deep(li) {
    margin: 0.375rem 0;
    line-height: 1.6;
}

.markdown-content :deep(li:first-child) {
    margin-top: 0;
}

.markdown-content :deep(li:last-child) {
    margin-bottom: 0;
}

/* Nested lists */
.markdown-content :deep(li > ol),
.markdown-content :deep(li > ul) {
    margin-top: 0.375rem;
}

/* Inline code */
.markdown-content :deep(code) {
    background-color: rgba(0, 0, 0, 0.06);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
    font-size: 0.875em;
}

/* Code blocks */
.markdown-content :deep(pre) {
    background-color: rgba(0, 0, 0, 0.04);
    padding: 0.875rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
}

.markdown-content :deep(pre code) {
    background-color: transparent;
    padding: 0;
}

/* Blockquotes */
.markdown-content :deep(blockquote) {
    border-left: 0.25rem solid rgba(0, 0, 0, 0.2);
    padding-left: 1rem;
    margin: 1rem 0;
    color: rgba(0, 0, 0, 0.7);
}

/* Headings */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
    font-weight: 600;
    line-height: 1.3;
    margin: 1.5rem 0 0.75rem 0;
}

.markdown-content :deep(h1:first-child),
.markdown-content :deep(h2:first-child),
.markdown-content :deep(h3:first-child),
.markdown-content :deep(h4:first-child),
.markdown-content :deep(h5:first-child),
.markdown-content :deep(h6:first-child) {
    margin-top: 0;
}

.markdown-content :deep(h1) {
    font-size: 1.875rem;
}

.markdown-content :deep(h2) {
    font-size: 1.5rem;
}

.markdown-content :deep(h3) {
    font-size: 1.25rem;
}

.markdown-content :deep(h4) {
    font-size: 1.125rem;
}

.markdown-content :deep(h5),
.markdown-content :deep(h6) {
    font-size: 1rem;
}

/* Horizontal rule */
.markdown-content :deep(hr) {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin: 1.5rem 0;
}

/* Links */
.markdown-content :deep(a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: rgba(0, 0, 0, 0.3);
    text-underline-offset: 0.125rem;
    transition: text-decoration-color 0.2s;
}

.markdown-content :deep(a:hover) {
    text-decoration-color: currentColor;
}

/* Tables */
.markdown-content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0.75rem;
    text-align: left;
}

.markdown-content :deep(th) {
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.02);
}

.markdown-content :deep(tr:nth-child(even)) {
    background-color: rgba(0, 0, 0, 0.01);
}

/* Images */
.markdown-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
}

/* Untuk chat bubble primary (user message) */
.chat-bubble-primary .markdown-content :deep(code) {
    background-color: rgba(255, 255, 255, 0.2);
}

.chat-bubble-primary .markdown-content :deep(pre) {
    background-color: rgba(255, 255, 255, 0.15);
}

.chat-bubble-primary .markdown-content :deep(blockquote) {
    border-left-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.9);
}

.chat-bubble-primary .markdown-content :deep(th) {
    background-color: rgba(255, 255, 255, 0.1);
}

.chat-bubble-primary .markdown-content :deep(th),
.chat-bubble-primary .markdown-content :deep(td) {
    border-color: rgba(255, 255, 255, 0.2);
}

.chat-bubble-primary .markdown-content :deep(tr:nth-child(even)) {
    background-color: rgba(255, 255, 255, 0.05);
}

.chat-bubble-primary .markdown-content :deep(hr) {
    border-top-color: rgba(255, 255, 255, 0.2);
}
</style>