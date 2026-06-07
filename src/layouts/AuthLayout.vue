<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-green-700 rounded-t-2xl px-8 py-6 text-center">
        <h1 class="text-white text-2xl font-bold tracking-tight">IC Moscow Admin</h1>
        <p class="text-green-200 text-sm mt-1">Islamic Center of Moscow</p>
      </div>
      <div class="bg-white rounded-b-2xl shadow-xl px-8 py-8">
        <slot />
      </div>
    </div>
  </div>
</template>
