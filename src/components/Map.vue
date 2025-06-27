<script lang="ts" >
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  import { forEachChild } from "typescript";
  import { Suspense, onMounted } from 'vue'
  import { useRoute } from 'vue-router';
  import { Pin, BoardPins } from './boardpins.ts'
  import "leaflet/dist/leaflet.css";
  import {
    LMap,
    LCircleMarker,
    LTileLayer,
    LControlLayers,
    LTooltip,
    LControl,
  } from "@vue-leaflet/vue-leaflet";

  const showModal = ref(false);
  const user_input_for_state = ref("")
  const pins = ref(null);
  const statusMessage = ref("");

  class Map {
    region: String;
    state: String;
    city: String;
    type: String;
    constructor() {
      this.region = "";
      this.state = "";
      this.city = "";
      this.type = "";
    }
  }

  let current_map = new Map();

  let borad_pins = new BoardPins();

  async function clickCopyStateButton() {
    if (pins.value == null)
      return;
    let str = borad_pins.serialize(pins.value);
    let newurl = "region=" + current_map.region + "&state=" + current_map.state + "&city=" + current_map.city + "&type=" + current_map.type + "&status=" + str;
    navigator.clipboard.writeText(newurl);
  }

  function dblClickMarker(pin : Pin) {
    if (pin.status)
      pin.status = false;
    else
      pin.status = true;
  }

  function onMapReady(mapObject : any) {
    mapObject.locate({ setView: true, maxZoom: 16 });
  }

  async function loadBorardPin(query) {
    if (query.region != null && query.state != null && query.city != null && query.type != null)
    {
      try {
        current_map.region = query.region;
        current_map.state = query.state;
        current_map.city = query.city;
        if (query.type == "json") {
          pins.value = await borad_pins.fetchBoardPinsFromJson(query.region, query.state, query.city, query.status);
        } else if (query.type == "kml") {
          current_map.type = "kml";
          pins.value = await borad_pins.fetchBoardPinsFromKml(query.region, query.state, query.city, query.status);
        }
        statusMessage.value = "success";
      } catch (error) {
        debugger;
        statusMessage.value = error;
      }
    }
  }

  async function loadBorardPinFromString(uri_param: string) {
    const url = new URLSearchParams(uri_param);
    let region, state, city, status, type;
    if (url.has("region"))
      region = url.get("region");
    if (url.has("state"))
      state = url.get("state");
    if (url.has("city"))
      city = url.get("city");
    if (url.has("type"))
      type = url.get("type");
    if (url.has("status"))
      status = url.get("status");
    if (region != null && state != null && city != null && type != null) {
      try {
        current_map.region = region;
        current_map.state = state;
        current_map.city = city;
        if (type == "json") {
          pins.value = await borad_pins.fetchBoardPinsFromJson(region, state, city, status);
        } else if (type == "kml") {
          current_map.type = "kml";
          pins.value = await borad_pins.fetchBoardPinsFromKml(region, state, city, status);
        }
        statusMessage.value = "success";
      } catch (error) {
        statusMessage.value = error;
      }
    }
  }

  async function onCloseRestoreModal(uri_param: string) {
    showModal.value = false;
    await loadBorardPinFromString(uri_param);
  }

  function onShowRestoreModal() {
    showModal.value = true;
  }

  export default {
    components: {
      LMap,
      LTileLayer,
      LCircleMarker,
      LTooltip,
      Modal,
      LControl,
    },
    setup() {
      onMounted(async () => {
        const route = useRoute();
        await loadBorardPin(route.query);
      })
      return { showModal, user_input_for_state, pins, statusMessage };
    },
    data() {
      return {
        zoom: 15,
        center: [35.6769883, 139.7588499],
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        dblClickMarker: dblClickMarker,
        clickCopyStateButton: clickCopyStateButton,
        onReady: onMapReady,
        onCloseRestoreModal: onCloseRestoreModal,
        onShowRestoreModal: onShowRestoreModal,
      };
    },
  };
</script>
<template>
  <modal :show="showModal" @close="onCloseRestoreModal(user_input_for_state)">
    <template #body>
      <p>復元するにはここにペーストしてOKを押してください。</p>
      <textarea v-model="user_input_for_state" />
    </template>
  </modal>
  <div style="height:1080px;">
    <l-map @ready="onReady" v-model:zoom="zoom" :use-global-leaflet="false" :center="center">
      <l-tile-layer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    v-model:subdomains="subdomains"
                    layer-type="base"
                    name="GoogleStreetMap">
      </l-tile-layer>
      <l-circle-marker v-for="pin in pins" @click="dblClickMarker(pin)" :color="pin.color()" :lat-lng="[pin.lat, pin.long]" :fillOpacity="0.9" :radius="16" :weight="1" :border="1">
        <l-tooltip>
          <b>{{pin.name}}</b>
          <p v-if="pin.status">処理</p>
          <p v-else>未処理</p>
          <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
        </l-tooltip>
      </l-circle-marker>
      <l-control class="leaflet-control" position="bottomleft">
        {{statusMessage}}
      </l-control>
      <l-control class="leaflet-control leaflet-demo-control" position="bottomleft" @click="clickCopyStateButton">
        コピーする
      </l-control>
      <l-control class="leaflet-control leaflet-demo-control" position="bottomleft" @click="onShowRestoreModal">
        復元する
      </l-control>
    </l-map>
  </div>
</template>
<style>
  .leaflet-demo-control {
    background: white;
    border: 1px solid steelblue;
    padding: 1em;
    font-size: large;
    font-style: italic;
  }
</style>
