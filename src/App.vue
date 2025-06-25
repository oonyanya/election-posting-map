<script setup lang="ts">
import Map from './components/Map.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      選挙ポスター
    </div>
  </header>

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

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

  #map {
    height: 1080px;
  }

  @media (min-width: 1024px) {
    header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
