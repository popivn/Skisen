<script setup>
import Header from '@/Components/Header/Index.vue';
</script>

<template>
    <div>
        <Header />
        <main class="min-h-[calc(100vh-72px)] min-w-screen flex items-center justify-center">
            <slot />
        </main>
    </div>
</template>