<template>
    <footer class="bg-gray-100 border-t border-gray-200 py-8">
        <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                <h3 class="text-lg font-semibold mb-4">{{ $t('app.name') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('footer.description') }}
                </p>
                </div>
                <div>
                <h3 class="text-lg font-semibold mb-4">{{ $t('footer.links') }}</h3>
                <ul class="space-y-2">
                    <li v-for="(link, index) in links" :key="index">
                    <router-link :to="link.href" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        {{ $t(link.name) }}
                    </router-link>
                    </li>
                </ul>
                </div>
                <div>
                <h3 class="text-lg font-semibold mb-4">{{ $t('footer.policies') }}</h3>
                <ul class="space-y-2">
                    <li v-for="(policy, index) in policies" :key="index">
                    <router-link :to="policy.href" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        {{ $t(policy.name) }}
                    </router-link>
                    </li>
                </ul>
                </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-200  text-center">
                <p class="text-sm text-gray-600 ">
                © {{ new Date().getFullYear() }} {{ $t('app.name') }}. {{ $t('footer.copyright') }}
                </p>
            </div>
        </div>
    </footer>
</template>
  
<script setup>
const links = [
    { name: "nav.home", href: "/" },
    { name: "nav.diagnosis", href: "/diagnosis" },
    { name: "nav.chatbot", href: "/chatbot" },
    { name: "nav.contact", href: "/contact" }
];

const policies = [
    { name: "footer.privacy", href: "/privacy" },
    { name: "footer.terms", href: "/terms" },
    { name: "footer.faq", href: "/faq" }
];
</script>
