<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="mb-4">
            <component :is="icon" class="h-10 w-10 text-blue-600 " />
        </div>
        <h3 class="text-xl font-semibold mb-3 text-gray-900">{{ title }}</h3>
        <p class="text-gray-600 ">{{ description }}</p>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: Object,
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
