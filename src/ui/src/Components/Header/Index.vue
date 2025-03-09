<template>
    <header class="bg-white shadow-sm border-b-2 border-[#81C784] h-[72px]">
        <div class="container mx-auto flex items-center h-full px-4">
            <a href="/" class="flex items-center gap-2 h-full">
                <img src="/assets/img/logo.png" alt="Logo" class="h-full">
                <h1 class="text-2xl font-bold text-[#2F4F4F]">SkiSen</h1>
            </a>

            <!-- <nav class="flex-grow h-full flex items-center">
                <ul class="flex justify-evenly w-full h-full">
                    <li
                        v-for="item in navItems"
                        :key="item.text"
                        class="h-full flex items-center justify-center w-1/5 transition-transform duration-300 ease-in-out 
                                hover:-translate-y-1 hover:bg-[#81C784]/20"
                        :class="{ 'text-[#81C784] border-b-4 border-[#81C784] bg-[#81C784]/10': isActive(item.href) }"
                    >
                        <a 
                            :href="item.href" 
                            class="font-bold text-lg w-full text-center"
                        >{{ item.text }}</a>
                    </li>
                </ul>
            </nav> -->
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';

// const navItems = ref([
//     { text: "Detect", href: "#" },
// ]);

const isActive = (href) => {
    return window.location.pathname === href;
};
</script>
