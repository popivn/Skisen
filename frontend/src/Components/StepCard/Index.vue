<template>
    <div class="bg-white  p-6 rounded-xl shadow-sm border border-gray-100  relative">
      <div class="absolute -left-1 -top-4 md:-left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
        {{ number }}
      </div>
      <h3 class="text-xl font-semibold mb-3 mt-2 text-gray-900 ">{{ title }}</h3>
      <p class="text-gray-600 ">{{ description }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    number: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });
  </script>
  
  