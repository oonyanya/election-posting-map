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
    LCircle,
    LCircleMarker,
    LTileLayer,
    LControlLayers,
    LTooltip,
    LControl,
    LPopup,
    LLayerGroup,    
  } from "@vue-leaflet/vue-leaflet";

  // 位置情報を更新する間隔
  const LOCATION_REFRASH_TIMING = 1000;

  const STATE_NAME = "leaestState";

  const showModal = ref(false);
  const user_input_for_state = ref("")
  const pins = ref(null);
  const statusMessage = ref("");
  const current_postion = ref([0,0]);
  const accuracy = ref(0);

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

  let globalMapObject;

  function serializeState() {
    if (pins.value == null)
      return;
    let str = borad_pins.serialize(pins.value);
    let newurl = "region=" + current_map.region + "&state=" + current_map.state + "&city=" + current_map.city + "&type=" + current_map.type + "&status=" + str;
    return newurl;
  }

  async function clickCopyStateButton() {
    navigator.clipboard.writeText(serializeState());
  }

  document.addEventListener("visibilitychange", () => {
    if (globalMapObject) {
      if (document.visibilityState != 'visible') {
        globalMapObject.stopLocate();
        let state = serializeState();
        if (state != null) {
          localStorage.setItem(STATE_NAME, state);
        }
      } else {
        globalMapObject.locate({ watch: true, maximumAge: LOCATION_REFRASH_TIMING });
      }
    }
  });

  function dblClickMarker(pin: Pin) {
    if (pin.status)
      pin.status = false;
    else
      pin.status = true;
  }

  function onLocationFound(e) {
    current_postion.value = e.latlng;
    accuracy.value = e.accuracy / 2;
    globalMapObject.setView(e.latlng);
  }

  function onLocationError()
  {
    statusMessage.value = "failed to get location";
    globalMapObject.setView([35.6769883, 139.7588499]);
  }

  function onMapReady(map: any) {
    globalMapObject = map;
    map.locate({ watch: true, maximumAge: LOCATION_REFRASH_TIMING });
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
      LCircle,
      LCircleMarker,
      LTooltip,
      Modal,
      LControl,
      LPopup,
      LLayerGroup,
      LControlLayers,
    },
    setup() {
      onMounted(async () => {
        const route = useRoute();
        var previousState = localStorage.getItem(STATE_NAME);
        if (route.query != null) {
          if (route.query.restore_state != null) {
            if (route.query.restore_state == "true" && previousState != null && previousState != "undefined") {
              await loadBorardPinFromString(previousState);
            } else {
              await loadBorardPin(route.query);
            }
          } else {
            await loadBorardPin(route.query);
          }
        }
        return;
      })
      return { showModal, user_input_for_state, pins, statusMessage, onLocationFound, current_postion, accuracy, onLocationError };
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
  <div id="map">
    <l-map @ready="onReady" @locationfound="onLocationFound" @locationerror="onLocationError" v-model:zoom="zoom" :center="center" :use-global-leaflet="false" :options="{doubleClickZoom:false}">
      <l-tile-layer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    v-model:subdomains="subdomains"
                    layer-type="base"
                    name="GoogleStreetMap">
      </l-tile-layer>
      <l-layer-group name="ポスター掲示板一覧" layer-type="overlay" :visible="true">
        <l-circle-marker v-for="pin in pins" :color="pin.color()" :lat-lng="[pin.lat, pin.long]" :fillOpacity="0.9" :radius="16" :weight="1" :border="1">
          <l-popup>
            <b>{{pin.name}}</b></br>
            <button v-if="pin.status" @click.prevent.stop="dblClickMarker(pin)">処理済</button></br>
            <button v-else @click.prevent.stop="dblClickMarker(pin)">未処理</button></br>
            <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
          </l-popup>
        </l-circle-marker>
      </l-layer-group>
      <l-control-layers />
      <l-circle :lat-lng="current_postion" :radius="accuracy"></l-circle>
      <l-control class="leaflet-control leaflet-control-attribution" position="bottomright">
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
    color: var(--color-text);
    background: var(--color-background);
    border: 1px solid steelblue;
    padding: 1em;
    font-size: large;
    font-style: italic;
  }
</style>
