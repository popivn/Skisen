<template>
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <span class="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                {{ $t('app.name').split(' ')[0] }}<span class="text-gray-900 ">{{ $t('app.name').split(' ')[1] || '' }}</span>
              </span>
            </router-link>
          </div>
  
          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link 
              v-for="link in navLinks" 
              :key="link.href" 
              :to="link.href"
              class="text-sm font-medium transition-colors"
              :class="$route.path === link.href 
                ? 'text-blue-600 ' 
                : 'text-gray-700  hover:text-blue-600 '"
            >
              {{ $t(link.name) }}
            </router-link>
          </nav>
  
          <div class="flex items-center">
            <LanguageSwitcher />
  
            <!-- Mobile menu button -->
            <button 
              class="md:hidden rounded-full p-2 text-gray-700 hover:bg-gray-100"
              @click="toggleMenu"
            >
              <component :is="isMenuOpen ? XIcon : MenuIcon" class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-200 dark:border-gray-800">
        <div class="container mx-auto px-4 py-4 space-y-4">
          <router-link 
            v-for="link in navLinks" 
            :key="link.href" 
            :to="link.href"
            class="block text-sm font-medium transition-colors"
            :class="$route.path === link.href 
              ? 'text-blue-600' 
              : 'text-gray-700 hover:text-blue-600 '"
            @click="isMenuOpen = false"
          >
            {{ $t(link.name) }}
          </router-link>
        </div>
      </div>
    </header>
  </template>
  
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Menu as MenuIcon, X as XIcon } from 'lucide-vue-next';
import LanguageSwitcher from '@/Components/LanguageSwitcher/Index.vue';

const route = useRoute();
const isDarkMode = ref(false);
const isMenuOpen = ref(false);

const navLinks = [
    { name: "nav.home", href: "/" },
    { name: "nav.diagnosis", href: "/diagnosis" },
    { name: "nav.chatbot", href: "/chatbot" },
    // { name: "nav.contact", href: "/contact" },
    // { name: "nav.privacy", href: "/privacy" },
    // { name: "nav.terms", href: "/terms" },
    // { name: "nav.faq", href: "/faq" },
];

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>
  
  