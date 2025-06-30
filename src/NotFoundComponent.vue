<template>
  <div class="text_view">
    <h1>404</h1>
    <p>Sorry, the page <code>{{ $route.params.notFound }}</code> you're looking for is not found</p>
    <router-link :to="{ path: '/' }">Back to top page</router-link>
  </div>
</template>
