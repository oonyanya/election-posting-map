<script setup lang="ts">
  import Map from './components/Map.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <main>
        <Map />
      </main>
    </template>
    <template #fallback>
      <main>
        読み込み中...
      </main>
    </template>
  </Suspense>
</template>
