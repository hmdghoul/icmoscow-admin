<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
    <p class="text-7xl font-black text-green-700">404</p>
    <h1 class="mt-4 text-2xl font-bold text-gray-800">Page not found</h1>
    <p class="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
    <router-link
      to="/"
      class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <i class="ri-home-line" /> Go to Dashboard
    </router-link>
  </div>
</template>
