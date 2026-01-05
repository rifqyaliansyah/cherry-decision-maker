<template>
    <dialog ref="modalRef" id="newChatModal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Mulai Percakapan Baru?</h3>
            <p class="py-4">
                Semua riwayat chat saat ini akan hilang. Yakin mau mulai dari awal lagi?
            </p>
            <div class="modal-action">
                <form method="dialog" class="flex gap-2">
                    <button class="btn btn-ghost">Batal</button>
                    <button class="btn btn-primary" @click="handleConfirm">
                        Ya, Mulai Baru
                    </button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const modalRef = ref(null)

const emit = defineEmits(['confirm'])

const showModal = () => {
    if (modalRef.value) {
        modalRef.value.showModal()
    }
}

const handleConfirm = () => {
    emit('confirm')
}

// Expose showModal method to parent
defineExpose({
    showModal
})
</script>