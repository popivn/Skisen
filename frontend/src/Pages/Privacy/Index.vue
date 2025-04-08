<template>
    <div class="container mx-auto max-w-4xl py-12 px-4 md:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('privacy.title') }}</h1>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200  p-6">
        <div class="prose  max-w-none">
          <p class="mb-4">{{ $t('privacy.lastUpdated') }}: 20/03/2025</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.introduction.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.introduction.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.dataCollection.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataCollection.content') }}</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>{{ $t('privacy.dataCollection.items.personal') }}</li>
            <li>{{ $t('privacy.dataCollection.items.medical') }}</li>
            <li>{{ $t('privacy.dataCollection.items.usage') }}</li>
            <li>{{ $t('privacy.dataCollection.items.technical') }}</li>
          </ul>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.dataUsage.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataUsage.content') }}</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>{{ $t('privacy.dataUsage.items.service') }}</li>
            <li>{{ $t('privacy.dataUsage.items.improvement') }}</li>
            <li>{{ $t('privacy.dataUsage.items.communication') }}</li>
            <li>{{ $t('privacy.dataUsage.items.research') }}</li>
          </ul>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.dataSecurity.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSecurity.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.dataSharing.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.dataSharing.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.userRights.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.userRights.content') }}</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>{{ $t('privacy.userRights.items.access') }}</li>
            <li>{{ $t('privacy.userRights.items.correction') }}</li>
            <li>{{ $t('privacy.userRights.items.deletion') }}</li>
            <li>{{ $t('privacy.userRights.items.objection') }}</li>
            <li>{{ $t('privacy.userRights.items.portability') }}</li>
          </ul>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('privacy.contact.title') }}</h2>
          <p class="mb-4">{{ $t('privacy.contact.content') }}</p>
          <p class="mb-4">Email: privacy@skisen.com</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Không cần logic bổ sung
  </script>
  
  