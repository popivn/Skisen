<template>
    <div class="container mx-auto max-w-3xl py-12 px-4 md:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 class="text-2xl font-bold">{{ $t('profile.title') }}</h1>
        </div>
        
        <div class="p-6">
          <div v-if="successMessage" class="mb-6 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="space-y-4">
              <h2 class="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">
                {{ $t('profile.personalInfo') }}
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="name" class="text-sm font-medium">{{ $t('profile.name') }}</label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="email" class="text-sm font-medium">{{ $t('profile.email') }}</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readonly
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="phone" class="text-sm font-medium">{{ $t('profile.phone') }}</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">
                {{ $t('profile.preferences') }}
              </h2>
              
              <div class="space-y-2">
                <label for="language" class="text-sm font-medium">{{ $t('profile.language') }}</label>
                <select
                  id="language"
                  v-model="formData.language"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div class="flex items-center">
                <input
                  id="emailNotifications"
                  v-model="formData.emailNotifications"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="emailNotifications" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('profile.emailNotifications') }}
                </label>
              </div>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">
                {{ $t('profile.privacy') }}
              </h2>
              
              <div class="flex items-center">
                <input
                  id="dataConsent"
                  v-model="formData.dataConsent"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="dataConsent" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('profile.dataConsent') }}
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="imageProcessingConsent"
                  v-model="formData.imageProcessingConsent"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="imageProcessingConsent" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('profile.imageProcessingConsent') }}
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-4 py-2"
              >
                {{ $t('profile.cancel') }}
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center"
                :disabled="isSaving"
              >
                <template v-if="isSaving">
                  <span class="mr-2">{{ $t('profile.saving') }}</span>
                  <div class="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                </template>
                <template v-else>
                  {{ $t('profile.saveButton') }}
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAuth } from '@/composables/useAuth';
  
  const { t, locale } = useI18n();
  const { user, updateProfile } = useAuth();
  
  const formData = ref({
    name: '',
    email: '',
    phone: '',
    language: locale.value,
    emailNotifications: false,
    dataConsent: false,
    imageProcessingConsent: false
  });
  
  const isSaving = ref(false);
  const successMessage = ref('');
  
  onMounted(() => {
    // Initialize form with user data
    if (user.value) {
      formData.value.name = user.value.name || '';
      formData.value.email = user.value.email || '';
      formData.value.phone = user.value.phone || '';
      
      // Check if consent was previously given
      const savedConsent = localStorage.getItem('imageProcessingConsent');
      formData.value.imageProcessingConsent = savedConsent === 'true';
    }
  });
  
  const saveProfile = async () => {
    isSaving.value = true;
    successMessage.value = '';
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      updateProfile({
        name: formData.value.name,
        phone: formData.value.phone
      });
      
      // Update language preference
      if (locale.value !== formData.value.language) {
        locale.value = formData.value.language;
        localStorage.setItem('language', formData.value.language);
      }
      
      // Update image processing consent
      localStorage.setItem('imageProcessingConsent', formData.value.imageProcessingConsent.toString());
      
      // Show success message
      successMessage.value = t('profile.saveSuccess');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      isSaving.value = false;
    }
  };
  
  const resetForm = () => {
    // Reset form to initial values
    onMounted();
    successMessage.value = '';
  };
  </script>
  
  