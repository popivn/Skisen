<template>
    <div class="container mx-auto max-w-md py-12 px-4 md:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200  overflow-hidden">
        <div class="p-6 border-b border-gray-200 ">
          <h1 class="text-2xl font-bold text-center">{{ $t('register.title') }}</h1>
        </div>
        
        <div class="p-6">
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100  text-red-700  rounded-lg">
            {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">{{ $t('register.name') }}</label>
              <input
                id="name"
                v-model="name"
                type="text"
                :placeholder="$t('register.namePlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">{{ $t('register.email') }}</label>
              <input
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('register.emailPlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">{{ $t('register.password') }}</label>
              <input
                id="password"
                v-model="password"
                type="password"
                :placeholder="$t('register.passwordPlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="confirmPassword" class="text-sm font-medium">{{ $t('register.confirmPassword') }}</label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                :placeholder="$t('register.confirmPasswordPlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="flex items-center">
              <input
                id="terms"
                v-model="agreeToTerms"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700 ">
                {{ $t('register.agreeToTerms') }}
                <router-link to="/terms" class="text-blue-600  hover:underline">
                  {{ $t('register.termsLink') }}
                </router-link>
              </label>
            </div>
            
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center"
              :disabled="isLoading"
            >
              <template v-if="isLoading">
                <span class="mr-2">{{ $t('register.registering') }}</span>
                <div class="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
              </template>
              <template v-else>
                {{ $t('register.registerButton') }}
              </template>
            </button>
          </form>
          
          <div class="mt-6 text-center text-sm">
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('register.alreadyHaveAccount') }}
              <router-link to="/login" class="text-blue-600  hover:underline">
                {{ $t('register.signIn') }}
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth';
  
  const router = useRouter();
  const { login } = useAuth();
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const agreeToTerms = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const handleRegister = async () => {
    errorMessage.value = '';
    
    // Basic validation
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    if (password.value.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters';
      return;
    }
    
    isLoading.value = true;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Registration successful - log the user in
      login({
        email: email.value,
        name: name.value,
        rememberMe: true
      });
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      errorMessage.value = error.message || 'Registration failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  