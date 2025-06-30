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
    <b>{{pin.name}}</b></br>
    <button v-if="pin.status" @click.prevent.stop="onChangeStatus">処理済</button></br>
    <button v-else @click.prevent.stop="onChangeStatus">未処理</button></br>
    <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
  </l-popup>
</template>
