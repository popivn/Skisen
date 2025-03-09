<template>
    <div>
        <button
        @click="openChat"
        class="fixed bottom-6 right-6 text-white font-bold rounded-full shadow-lg z-50 cursor-pointer flex justify-center"
        >
            <span class="relative flex h-16 w-16">
                <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#44ff63] opacity-75"
                ></span>
                <span
                class="relative inline-flex h-16 w-16 rounded-full ">
                    <img src="/assets/img/logo.png" alt="Chatbot" class="w-14 m-auto" />
                </span>
            </span>
        </button>

        <transition name="fade">
        <div
            v-if="isChatOpen"
            class="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50"
        >
            <div class="bg-white rounded-lg shadow-lg w-full max-w-[640px] mx-4">
                <div class="flex justify-between items-center p-4 border-b border-[#4B4B4B]">
                    <h3 class="text-lg font-bold text-[#4B4B4B]">Bác sĩ SkiSen</h3>
                    <button @click="closeChat" class="text-[#4B4B4B] text-2xl leading-none cursor-pointer">&times;</button>
                </div>
                <!-- Chat Messages -->
                <div class="p-4 h-64 overflow-y-auto space-y-2">
                    <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    :class="msg.sender === 'user' ? 'text-right' : 'text-left'"
                    >
                        <div
                            :class="msg.sender === 'ai'
                            ? 'bg-[#F5F5F5] inline-block p-2 rounded-lg text-[#4B4B4B]'
                            : 'bg-[#A67C52] inline-block p-2 rounded-lg text-white'"
                        >
                            <div v-html="convertMarkdown(msg.text)"></div>
                        </div>
                    </div>
                    <div ref="endOfMessages"></div>
                    <div v-if="isLoading" class="loader mt-4">
                        <div class="circle">
                            <div class="dot"></div>
                            <div class="outline"></div>
                        </div>
                        <div class="circle">
                            <div class="dot"></div>
                            <div class="outline"></div>
                        </div>
                        <div class="circle">
                            <div class="dot"></div>
                            <div class="outline"></div>
                        </div>
                        <div class="circle">
                            <div class="dot"></div>
                            <div class="outline"></div>
                        </div>
                    </div>
                </div>
                <!-- Input & Send Button -->
                <div class="p-4 border-t border-[#4B4B4B]">
                    <input
                        ref="userInputRef"
                        v-model="userInput"
                        @keyup.enter="sendMessage"
                        type="text"
                        placeholder="Nhập tin nhắn của bạn..."
                        class="w-full p-2 border border-[#4B4B4B] rounded focus:outline-none focus:ring"
                        :disabled="isLoading"
                    />
                    <button
                    @click="sendMessage"
                    class="mt-2 w-full bg-[#A67C52] hover:bg-[#8B5E3C] text-white py-2 rounded"
                    :disabled="isLoading"
                    >
                    Gửi
                    </button>
                </div>
            </div>
        </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, nextTick, watch, defineExpose } from 'vue';
import { marked } from 'marked';
import axios from 'axios';

const isChatOpen = ref(false);
const isLoading = ref(false);
const messages = ref([
    { sender: 'ai', text: 'Chào bạn, tôi là bác sĩ AI. Bạn cần giúp gì hôm nay?' }
]);
const userInput = ref('');
const endOfMessages = ref(null);
const userInputRef = ref(null);

const openChat = async () => {
    isChatOpen.value = true;
    await nextTick();
    if (userInputRef.value) {
        userInputRef.value.focus();
    }
};

const closeChat = () => {
    isChatOpen.value = false;
};

const convertMarkdown = (text) => {
    return marked.parse(text);
};

const sendMessage = async () => {
    if (userInput.value.trim() === '' || isLoading.value) return;

    const messageToSend = userInput.value.trim();
    messages.value.push({ sender: 'user', text: userInput.value });
    isLoading.value = true;
    userInput.value = '';

    try {
        const response = await axios.post('http://localhost:3000/chat', { message: messageToSend });
        messages.value.push({
        sender: 'ai',
        text: response.data.response
        });
    } catch (error) {
        console.error("Chat error:", error);
        messages.value.push({
        sender: 'ai',
        text: 'Có lỗi xảy ra, vui lòng thử lại sau.'
        });
    } finally {
        isLoading.value = false;
        await nextTick();
        if (userInputRef.value) {
            userInputRef.value.focus();
        }
    }

    userInput.value = '';
};

watch(
    () => messages.value.length,
    async () => {
        await nextTick();
        if (endOfMessages.value) {
            endOfMessages.value.scrollIntoView({ behavior: 'smooth' });
        }
    }
);

const openChatWithCondition = async (condition) => {
  // Pre-fill nội dung tin nhắn, ví dụ:
  userInput.value = `Tôi muốn hỏi về ${condition}. `;
  await openChat();
  await nextTick();
  if (userInputRef.value) {
    userInputRef.value.focus();
  }
};

// Expose hàm này để component cha có thể gọi
defineExpose({ openChatWithCondition });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  --color: hsl(0, 0%, 87%);
  --animation: 2s ease-in-out infinite;
}

.loader .circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
  border: solid 2px var(--color);
  border-radius: 50%;
  margin: 0 10px;
  background-color: transparent;
  animation: circle-keys var(--animation);
}

.loader .circle .dot {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--color);
  animation: dot-keys var(--animation);
}

.loader .circle .outline {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  animation: outline-keys var(--animation);
}

.loader .circle:nth-child(2) {
  animation-delay: 0.3s;
}

.loader .circle:nth-child(3) {
  animation-delay: 0.6s;
}

.loader .circle:nth-child(4) {
  animation-delay: 0.9s;
}

.loader .circle:nth-child(5) {
  animation-delay: 1.2s;
}

.loader .circle:nth-child(2) .dot {
  animation-delay: 0.3s;
}

.loader .circle:nth-child(3) .dot {
  animation-delay: 0.6s;
}

.loader .circle:nth-child(4) .dot {
  animation-delay: 0.9s;
}

.loader .circle:nth-child(5) .dot {
  animation-delay: 1.2s;
}

.loader .circle:nth-child(1) .outline {
  animation-delay: 0.9s;
}

.loader .circle:nth-child(2) .outline {
  animation-delay: 1.2s;
}

.loader .circle:nth-child(3) .outline {
  animation-delay: 1.5s;
}

.loader .circle:nth-child(4) .outline {
  animation-delay: 1.8s;
}

.loader .circle:nth-child(5) .outline {
  animation-delay: 2.1s;
}

@keyframes circle-keys {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes dot-keys {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes outline-keys {
  0% {
    transform: scale(0);
    outline: solid 20px var(--color);
    outline-offset: 0;
    opacity: 1;
  }
  100% {
    transform: scale(1);
    outline: solid 0 transparent;
    outline-offset: 20px;
    opacity: 0;
  }
}
</style>
