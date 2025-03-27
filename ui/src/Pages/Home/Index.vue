<template>
    <div class="flex flex-col min-h-screen">
      <!-- Hero Section -->
      <section class="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div class="container mx-auto max-w-6xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900  leading-tight">
                {{ $t('home.hero.title') }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 md:pr-10">
                {{ $t('home.hero.description') }}
              </p>
              <div class="pt-4">
                <router-link to="/diagnosis" custom v-slot="{ navigate }">
                  <button @click="navigate" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg flex items-center">
                    {{ $t('home.hero.cta') }} <ArrowRightIcon class="ml-2 h-5 w-5" />
                  </button>
                </router-link>
              </div>
            </div>
            <div class="relative">
              <div class="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/assets/img/placeholder.jpg" 
                  alt="AI Dermatology Diagnosis" 
                  class="w-full h-auto"
                />
              </div>
              <div class="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100  rounded-full opacity-70 z-0"></div>
              <div class="absolute -top-6 -left-6 w-32 h-32 bg-blue-100  rounded-full opacity-70 z-0"></div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="py-16 px-4 md:px-6 lg:px-8 bg-white ">
        <div class="container mx-auto max-w-6xl">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 ">{{ $t('home.features.title') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              :icon="CameraIcon"
              :title="$t('home.features.diagnosis.title')"
              :description="$t('home.features.diagnosis.description')"
            />
            <FeatureCard 
              :icon="MessageSquareIcon"
              :title="$t('home.features.chatbot.title')"
              :description="$t('home.features.chatbot.description')"
            />
            <FeatureCard 
              :icon="ShieldIcon"
              :title="$t('home.features.security.title')"
              :description="$t('home.features.security.description')"
            />
          </div>
        </div>
      </section>
  
      <!-- How It Works -->
      <section class="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div class="container mx-auto max-w-6xl">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 ">{{ $t('home.howItWorks.title') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              :title="$t('home.howItWorks.step1.title')"
              :description="$t('home.howItWorks.step1.description')"
            />
            <StepCard 
              number="2"
              :title="$t('home.howItWorks.step2.title')"
              :description="$t('home.howItWorks.step2.description')"
            />
            <StepCard 
              number="3"
              :title="$t('home.howItWorks.step3.title')"
              :description="$t('home.howItWorks.step3.description')"
            />
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="py-16 px-4 md:px-6 lg:px-8 bg-blue-600 text-white">
        <div class="container mx-auto max-w-6xl text-center">
          <h2 class="text-3xl font-bold mb-6">{{ $t('home.cta.title') }}</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            {{ $t('home.cta.description') }}
          </p>
          <router-link to="/diagnosis" custom v-slot="{ navigate }">
            <button @click="navigate" class="bg-white text-blue-600 hover:bg-gray-100 rounded-lg px-6 py-3 text-lg flex items-center mx-auto">
              {{ $t('home.cta.button') }} <ArrowRightIcon class="ml-2 h-5 w-5" />
            </button>
          </router-link>
        </div>
      </section>
    </div>
</template>
  
<script setup>
import { Camera as CameraIcon, MessageSquare as MessageSquareIcon, Shield as ShieldIcon, ArrowRight as ArrowRightIcon } from 'lucide-vue-next';
import FeatureCard from '@/Components/FeatureCard/Index.vue';
import StepCard from '@/Components/StepCard/Index.vue';
</script>
  
  