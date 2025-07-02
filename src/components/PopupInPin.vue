<script setup>
  import "leaflet/dist/leaflet.css";
  import {
    LPopup,
  } from "@vue-leaflet/vue-leaflet";

  defineProps({ pin: Object });
  const emit = defineEmits(['changeStatus']);

  function onChangeStatus() {
    emit('changeStatus');
  }
</script>

<template>
  <l-popup>
    <h3>{{pin.name}}</h3>
    <div v-html="pin.description"></div>
    <div>
      <span>処理状況</span>
      <button v-if="pin.status" @click.prevent.stop="onChangeStatus">処理済</button>
      <button v-else @click.prevent.stop="onChangeStatus">未処理</button>
    </div>
    <div>
      <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
    </div>
  </l-popup>
</template>
