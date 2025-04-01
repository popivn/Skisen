<template>
    <div class="container mx-auto max-w-4xl py-12 px-4 md:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('terms.title') }}</h1>
      
      <div class="bg-white  rounded-lg shadow-sm border border-gray-200  p-6">
        <div class="prose  max-w-none">
          <p class="mb-4">{{ $t('terms.lastUpdated') }}: 20/03/2025</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.introduction.title') }}</h2>
          <p class="mb-4">{{ $t('terms.introduction.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.services.title') }}</h2>
          <p class="mb-4">{{ $t('terms.services.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.medicalDisclaimer.title') }}</h2>
          <p class="mb-4">{{ $t('terms.medicalDisclaimer.content') }}</p>
          <p class="mb-4 font-semibold">{{ $t('terms.medicalDisclaimer.warning') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.userAccounts.title') }}</h2>
          <p class="mb-4">{{ $t('terms.userAccounts.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.intellectualProperty.title') }}</h2>
          <p class="mb-4">{{ $t('terms.intellectualProperty.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.userContent.title') }}</h2>
          <p class="mb-4">{{ $t('terms.userContent.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.prohibitedUses.title') }}</h2>
          <p class="mb-4">{{ $t('terms.prohibitedUses.content') }}</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>{{ $t('terms.prohibitedUses.items.illegal') }}</li>
            <li>{{ $t('terms.prohibitedUses.items.harmful') }}</li>
            <li>{{ $t('terms.prohibitedUses.items.impersonation') }}</li>
            <li>{{ $t('terms.prohibitedUses.items.interference') }}</li>
          </ul>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.termination.title') }}</h2>
          <p class="mb-4">{{ $t('terms.termination.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.changes.title') }}</h2>
          <p class="mb-4">{{ $t('terms.changes.content') }}</p>
          
          <h2 class="text-2xl font-semibold mt-8 mb-4">{{ $t('terms.contact.title') }}</h2>
          <p class="mb-4">{{ $t('terms.contact.content') }}</p>
          <p class="mb-4">Email: legal@skisen.com</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Không cần logic bổ sung
  </script>
  
  