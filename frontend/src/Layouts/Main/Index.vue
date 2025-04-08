<script setup>
import Header from '@/Components/Header/Index.vue';
import Footer from '@/Components/Footer/Index.vue';
</script>

<template>
    <div  class="min-h-screen bg-white  text-gray-900 flex flex-col">
        <Header />
        <main class="flex-1">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                <component :is="Component" />
                </transition>
            </router-view>
            </main>
        <Footer />
    </div>
</template>