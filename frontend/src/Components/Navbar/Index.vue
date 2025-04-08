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
            
            <!-- Auth Buttons -->
            <div v-if="!isAuthenticated" class="hidden md:flex items-center space-x-2">
              <router-link to="/login" custom v-slot="{ navigate }">
                <button 
                  @click="navigate" 
                  class="text-sm font-medium text-gray-700 hover:text-blue-600 "
                >
                  {{ $t('nav.login') }}
                </button>
              </router-link>
              <router-link to="/register" custom v-slot="{ navigate }">
                <button 
                  @click="navigate" 
                  class="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
                >
                  {{ $t('nav.register') }}
                </button>
              </router-link>
            </div>

            <!-- User Menu -->
            <div v-else class="relative">
              <button 
                @click="isUserMenuOpen = !isUserMenuOpen"
                class="flex items-center space-x-1 text-sm font-medium text-gray-700  hover:text-blue-600 "
              >
                <span>{{ user.name }}</span>
                <ChevronDownIcon class="h-4 w-4" :class="{ 'transform rotate-180': isUserMenuOpen }" />
              </button>
              
              <div 
                v-if="isUserMenuOpen" 
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <router-link to="/profile" custom v-slot="{ navigate }">
                    <button
                      @click="navigate; isUserMenuOpen = false"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                      role="menuitem"
                    >
                      {{ $t('nav.profile') }}
                    </button>
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                    role="menuitem"
                  >
                    {{ $t('nav.logout') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile menu button -->
            <button 
              class="md:hidden rounded-full p-2 text-gray-700  hover:bg-gray-100 "
              @click="toggleMenu"
            >
              <component :is="isMenuOpen ? XIcon : MenuIcon" class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-200 ">
        <div class="container mx-auto px-4 py-4 space-y-4">
          <router-link 
            v-for="link in navLinks" 
            :key="link.href" 
            :to="link.href"
            class="block text-sm font-medium transition-colors"
            :class="$route.path === link.href 
              ? 'text-blue-600 ' 
              : 'text-gray-700  hover:text-blue-600'"
            @click="isMenuOpen = false"
          >
            {{ $t(link.name) }}
          </router-link>
          
          <!-- Mobile Auth Buttons -->
          <div v-if="!isAuthenticated" class="pt-2 border-t border-gray-200 ">
            <router-link to="/login" custom v-slot="{ navigate }">
              <button 
                @click="navigate; isMenuOpen = false" 
                class="block w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600  py-2"
              >
                {{ $t('nav.login') }}
              </button>
            </router-link>
            <router-link to="/register" custom v-slot="{ navigate }">
              <button 
                @click="navigate; isMenuOpen = false" 
                class="block w-full text-left text-sm font-medium text-gray-700  hover:text-blue-600  py-2"
              >
                {{ $t('nav.register') }}
              </button>
            </router-link>
          </div>
          
          <!-- Mobile User Menu -->
          <div v-else class="pt-2 border-t border-gray-200 ">
            <router-link to="/profile" custom v-slot="{ navigate }">
              <button 
                @click="navigate; isMenuOpen = false" 
                class="block w-full text-left text-sm font-medium text-gray-700  hover:text-blue-600 py-2"
              >
                {{ $t('nav.profile') }}
              </button>
            </router-link>
            <button 
              @click="handleLogout" 
              class="block w-full text-left text-sm font-medium text-gray-700  hover:text-blue-600  py-2"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>
  
<script setup>
import { ref, onMounted, onUnmounted  } from 'vue';
import { useRoute } from 'vue-router';
import { Menu as MenuIcon, X as XIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next';
import LanguageSwitcher from '@/Components/LanguageSwitcher/Index.vue';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const isDarkMode = ref(false);
const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

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
  if (isMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
};

const handleLogout = () => {
  logout();
  isUserMenuOpen.value = false;
  isMenuOpen.value = false;
  router.push('/');
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isUserMenuOpen.value && !event.target.closest('.relative')) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const { user, isAuthenticated, logout } = useAuth();
</script>
  
  