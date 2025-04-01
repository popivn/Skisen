<template>
    <div class="container mx-auto max-w-4xl py-12 px-4 md:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('faq.title') }}</h1>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200  overflow-hidden">
        <div v-for="(item, index) in faqItems" :key="index">
          <div 
            class="p-4 border-b border-gray-200  cursor-pointer flex justify-between items-center"
            @click="toggleItem(index)"
          >
            <h3 class="font-medium">{{ $t(item.question) }}</h3>
            <ChevronDownIcon 
              class="h-5 w-5 transition-transform duration-200" 
              :class="{ 'transform rotate-180': openItem === index }"
            />
          </div>
          <div 
            v-show="openItem === index" 
            class="p-4 bg-gray-50  border-b border-gray-200 "
          >
            <p class="text-gray-600 0">{{ $t(item.answer) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next';
  
  const openItem = ref(null);
  
  const toggleItem = (index) => {
    openItem.value = openItem.value === index ? null : index;
  };
  
  const faqItems = [
    {
      question: 'faq.items.accuracy.question',
      answer: 'faq.items.accuracy.answer'
    },
    {
      question: 'faq.items.privacy.question',
      answer: 'faq.items.privacy.answer'
    },
    {
      question: 'faq.items.mobile.question',
      answer: 'faq.items.mobile.answer'
    },
    {
      question: 'faq.items.conditions.question',
      answer: 'faq.items.conditions.answer'
    },
    {
      question: 'faq.items.bestResults.question',
      answer: 'faq.items.bestResults.answer'
    },
    {
      question: 'faq.items.cost.question',
      answer: 'faq.items.cost.answer'
    },
    {
      question: 'faq.items.languages.question',
      answer: 'faq.items.languages.answer'
    },
    {
      question: 'faq.items.offline.question',
      answer: 'faq.items.offline.answer'
    }
  ];
  </script>
  
  