<template>
    <div class="container mx-auto max-w-md py-12 px-4 md:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-center">{{ $t('login.title') }}</h1>
        </div>
        
        <div class="p-6">
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100  text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">{{ $t('login.email') }}</label>
              <input
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('login.emailPlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label for="password" class="text-sm font-medium">{{ $t('login.password') }}</label>
                <a href="#" class="text-xs text-blue-600  hover:underline">
                  {{ $t('login.forgotPassword') }}
                </a>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                :placeholder="$t('login.passwordPlaceholder')"
                class="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700 ">
                {{ $t('login.rememberMe') }}
              </label>
            </div>
            
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center"
              :disabled="isLoading"
            >
              <template v-if="isLoading">
                <span class="mr-2">{{ $t('login.loggingIn') }}</span>
                <div class="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
              </template>
              <template v-else>
                {{ $t('login.loginButton') }}
              </template>
            </button>
          </form>
          
          <div class="mt-6 text-center text-sm">
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('login.noAccount') }}
              <router-link to="/register" class="text-blue-600  hover:underline">
                {{ $t('login.signUp') }}
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
  
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const handleLogin = async () => {
    errorMessage.value = '';
    isLoading.value = true;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email with a password longer than 5 characters
      if (password.value.length < 6) {
        throw new Error('Invalid credentials');
      }
      
      // Login successful
      login({
        email: email.value,
        name: email.value.split('@')[0], // Use part of email as name for demo
        rememberMe: rememberMe.value
      });
      
      // Redirect to home page or intended destination
      router.push('/');
    } catch (error) {
      errorMessage.value = error.message || 'Login failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  