<template>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div  class="h-[480px] flex flex-col">
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-4">
            <div class="space-y-4">
              <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                <div class="flex max-w-[80%]" :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="message.role === 'user' ? 'bg-blue-100 text-blue-600 ml-2' : 'bg-gray-100 text-gray-600 mr-2'">
                    <component :is="message.role === 'user' ? UserIcon : BotIcon" class="h-4 w-4" />
                  </div>
                  <div class="rounded-lg p-3" :class="message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'">
                    <div v-if="message.images && message.images.length > 0" class="mb-2 space-y-2">
                      <img v-for="(img, index) in message.images" :key="index" :src="img" :alt="`Attached image ${index + 1}`" class="rounded-md max-h-60 w-auto" />
                    </div>
                    <p class="whitespace-pre-wrap">{{ message.content }}</p>
                  </div>
                </div>
              </div>
              <div ref="endOfMessages"></div>
              
              <div v-if="isLoading" class="flex justify-start">
                <div class="flex flex-row">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600 mr-2">
                    <BotIcon class="h-4 w-4" />
                  </div>
                  <div class="rounded-lg p-3 bg-gray-100 text-gray-900">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0ms"></div>
                      <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 150ms"></div>
                      <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          <div v-if="attachedImages.length > 0" class="px-4 py-2 border-t border-gray-200 bg-gray-50 ">
            <div class="flex gap-2 overflow-x-auto pb-2">
              <div v-for="(img, index) in attachedImages" :key="index" class="relative">
                <img :src="img" :alt="`Attached ${index}`" class="h-16 w-auto rounded border border-gray-200 " />
                <button @click="removeAttachedImage(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-200 ">
            <div class="flex gap-2">
              <button class="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg p-2 flex-shrink-0" @click="triggerFileInput" :title="$t('chatbot.attachImage')">
                <ImageIcon class="h-5 w-5" />
                <span class="sr-only">{{ $t('chatbot.attachImage') }}</span>
              </button>
              <input v-model="input" @keydown.enter.prevent="handleSend" :placeholder="$t('chatbot.inputPlaceholder')" class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="isLoading" ref="userInputRef"/>
              <button @click="handleSend" :disabled="isLoading || (input.trim() === '' && attachedImages.length === 0)" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex-shrink-0 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed" :title="$t('chatbot.sendButton')">
                <component :is="isLoading ? Loader2Icon : SendIcon" class="h-5 w-5" :class="{ 'animate-spin': isLoading }" />
                <span class="sr-only">{{ $t('chatbot.sendButton') }}</span>
              </button>
            </div>
            <input type="file" ref="fileInputRef" @change="handleFileInput" accept="image/*" class="hidden" multiple />
            <p class="text-xs text-gray-500 mt-2">{{ $t('chatbot.hint') }}</p>
          </div>
        </div>
      </div>
  </template>
  
  <script setup>
  import { ref, nextTick, watch } from 'vue';
  import { User as UserIcon, Bot as BotIcon, Send as SendIcon, Image as ImageIcon, Loader2 as Loader2Icon } from 'lucide-vue-next';
  import axios from 'axios';
  
  const isChatOpen = ref(false);
  const isLoading = ref(false);
  const messages = ref([{ id: "1", role: 'assistant', content: 'Chào bạn, tôi là bác sĩ AI. Bạn cần giúp gì hôm nay?' }]);
  const input = ref('');
  const endOfMessages = ref(null);
  const userInputRef = ref(null);
  const attachedImages = ref([]);
  const fileInputRef = ref(null);
  const chatContainer = ref(null);
  
  const openChat = async () => {
    isChatOpen.value = true;
    await nextTick();
    if (userInputRef.value) userInputRef.value.focus();
  };
  
  const closeChat = () => {
    isChatOpen.value = false;
  };
  
  const handleSend = async () => {
    if (input.value.trim() === '' || isLoading.value) return;
  
    const messageToSend = input.value.trim();
    const language = localStorage.getItem('language') || 'en';
    const message = { id: Date.now().toString(), role: 'user', content: input.value };
    messages.value.push(message);
    isLoading.value = true;
    input.value = '';
  
    try {
      const response = await axios.post('http://localhost:3000/chat', { message: messageToSend, language });
      const botMessage = { id: Date.now().toString(), role: 'assistant', content: response.data.response };
      messages.value.push(botMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const botMessage = { id: Date.now().toString(), role: 'assistant', content: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
      messages.value.push(botMessage);
    } finally {
      isLoading.value = false;
      await nextTick();
      if (userInputRef.value) userInputRef.value.focus();
    }
  
    input.value = '';
  };
  
  
  watch(
    () => messages.value.length,
    async () => {
      await nextTick();
      // Scroll only the chat container instead of the whole screen.
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    }
  );
  
  const openChatWithCondition = async (condition) => {
    input.value = `Tôi muốn hỏi về ${condition}. `;
    await openChat();
    await nextTick();
    if (userInputRef.value) userInputRef.value.focus();
  };
  
  defineExpose({ openChatWithCondition });
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            attachedImages.value.push(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Trigger file input click event
  const triggerFileInput = () => {
    fileInputRef.value.click();
  };
  
  // Remove attached image
  const removeAttachedImage = (index) => {
    attachedImages.value = attachedImages.value.filter((_, i) => i !== index);
  };
  </script>
  