<template>
    <div class="bg-base-200 p-3 md:p-4 border-t border-base-300">
        <form @submit.prevent="$emit('send-message')" class="flex gap-2">
            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text"
                placeholder="Ask me anything..."
                class="input input-bordered input-sm md:input-md flex-1 text-sm md:text-base" :disabled="isLoading"
                autofocus />
            <button type="submit" class="btn btn-primary btn-sm md:btn-md" :disabled="isLoading || !modelValue.trim()">
                <span v-if="!isLoading" class="hidden md:inline">Send</span>
                <span v-if="!isLoading" class="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </span>
                <span v-else class="loading loading-spinner loading-sm"></span>
            </button>
        </form>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    isLoading: Boolean
})

defineEmits(['update:modelValue', 'send-message'])
</script>