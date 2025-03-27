<template>
    <div class="relative">
        <button 
        @click="toggleDropdown"
        class="flex items-center rounded-full p-2 text-gray-700  hover:bg-gray-100 "
        >
            <GlobeIcon class="h-5 w-5" />
            <span class="sr-only">{{ $t('nav.language') }}</span>
        </button>
        
        <div 
            v-if="isOpen" 
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
            <div class="py-1" role="menu" aria-orientation="vertical">
                <button
                v-for="(lang, code) in languages"
                :key="code"
                @click="changeLanguage(code)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                :class="{ 'bg-gray-100 ': currentLocale === code }"
                role="menuitem"
                >
                {{ lang }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Globe as GlobeIcon } from 'lucide-vue-next';
import axios from 'axios';

const { locale } = useI18n();
const isOpen = ref(false);
const currentLocale = computed(() => locale.value);

const languages = {
    vi: 'Tiếng Việt',
    en: 'English'
};

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const changeLanguage = (lang) => {
    locale.value = lang;
    localStorage.setItem('language', lang);
    isOpen.value = false;
    axios.defaults.headers['Accept-Language'] = lang;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (isOpen.value && !event.target.closest('.relative')) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

