<script lang="ts" >
  import { computed, ref } from 'vue';
  import Modal from './Modal.vue';
  import PopupInPin from './PopupInPin.vue'
  import { Suspense, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router';
  import { Pin, BoardPins } from './boardpins.ts'
  import "leaflet/dist/leaflet.css";
  import {
    LMap,
    LMarker,
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
  const accuracy = ref(0);
  const user_input_for_state = ref("")
  const user_input_for_from_marge = ref("")
  const pins = ref([]);
  const polling_station_pins = ref([]);
  const statusMessage = ref("");
  const current_postion = ref([0,0]);
  const pins_only_processed = computed(() => {
    if (pins.value != null && pins.value.length > 0)
      return pins.value.filter((p) => { return p.status == true; });
    else
      return [];
  });
  const pins_only_non_processed = computed(() => {
    if (pins.value != null && pins.value.length > 0)
      return pins.value.filter((p) => { return p.status == false; })
    else
      return [];
  });
  const watchCurrentState = ref(false);

  class Map {
    election: String;
    region: String;
    state: String;
    city: String;
    type: String;
    constructor() {
      this.election = "";
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
    let newurl = "election=" + current_map.election + "&region=" + current_map.region + "&state=" + current_map.state + "&city=" + current_map.city + "&type=" + current_map.type + "&status=" + str;
    return newurl;
  }

  async function clickCopyStateButton() {
    navigator.clipboard.writeText(serializeState());
    statusMessage.value = "sucess to copy state";
  }

  document.addEventListener("visibilitychange", () => {
    if (globalMapObject != null) {
      if (document.visibilityState != 'visible') {
        if (watchCurrentState.value)
        {
          globalMapObject.stopLocate();
        }
        let state = serializeState();
        if (state != null) {
          localStorage.setItem(STATE_NAME, state);
          statusMessage.value = "sucess to save state";
        }
      } else {
        if (watchCurrentState.value)
        {
          globalMapObject.locate({ watch: true, maximumAge: LOCATION_REFRASH_TIMING });
        }
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
    statusMessage.value = "sucessed to get location (accuracy " + e.accuracy / 2 + " meter)";
    globalMapObject.setView(e.latlng);
  }

  function onLocationError()
  {
    statusMessage.value = "failed to get location";
    globalMapObject.setView([35.6769883, 139.7588499]);
  }

  function onMapReady(map: any) {
    globalMapObject = map;
  }

  async function loadBorardPin(query) {
    if (query.election != null && query.region != null && query.state != null && query.city != null && query.type != null)
    {
      try {
        current_map.election = query.election;
        current_map.region = query.region;
        current_map.state = query.state;
        current_map.city = query.city;
        if (query.type == "json") {
          current_map.type = "json";
          pins.value = await borad_pins.fetchBoardPinsFromJson(query.election, query.region, query.state, query.city, query.status);
        } else if (query.type == "kml") {
          current_map.type = "kml";
          pins.value = await borad_pins.fetchBoardPinsFromKml(query.election, query.region, query.state, query.city, query.status);
        }
        polling_station_pins.value = await borad_pins.fetchPollingStationFromCsv(query.election, query.region, query.state, query.city);
      } catch (error) {
        debugger;
        statusMessage.value = error;
      }
    }
  }

  async function loadBorardPinFromString(uri_param: string, merge_from_params: string) {
    const url = new URLSearchParams(uri_param);
    let election, region, state, city, status, type;
    if (url.has("election"))
      election = url.get("election");
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
    if (election != null && region != null && state != null && city != null && type != null) {
      let temp_pins = [];
      try {
        current_map.election = election;
        current_map.region = region;
        current_map.state = state;
        current_map.city = city;
        if (type == "json") {
          current_map.type = "json";
          temp_pins = await borad_pins.fetchBoardPinsFromJson(election, region, state, city, status);
        } else if (type == "kml") {
          current_map.type = "kml";
          temp_pins = await borad_pins.fetchBoardPinsFromKml(election, region, state, city, status);
        } else {
          throw "invaild type";
        }

        if (merge_from_params != null)
        {
          let uri_params = merge_from_params.split('\n');
          for (const uri_param of uri_params)
          {
            const url = new URLSearchParams(uri_param);
            let election, region, state, city, status, type;
            if (url.has("election"))
              election = url.get("election");
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
            if (current_map.region == region && current_map.state == state && current_map.city == city)
              temp_pins = await borad_pins.mergeBoardPins(temp_pins, status);
          }
        }

        pins.value = temp_pins;

        polling_station_pins.value = await borad_pins.fetchPollingStationFromCsv(election, region, state, city);
        statusMessage.value = "sucess to restore state";
      } catch (error) {
        statusMessage.value = error;
      }
    }
  }

  async function onCloseRestoreModal(uri_param: string,merge_from_params: string) {
    showModal.value = false;
    if (uri_param != null) {
      if (uri_param != "") {
        await loadBorardPinFromString(uri_param, merge_from_params);
      } else {
        var previousState = localStorage.getItem(STATE_NAME);
        if (previousState != null) {
          await loadBorardPinFromString(previousState, null);
        }
      }
    } else {
      var previousState = localStorage.getItem(STATE_NAME);
      if (previousState != null) {
        await loadBorardPinFromString(previousState, null);
      }
    }
  }

  function onCancelModal() {
    showModal.value = false;
  }

  function onShowRestoreModal() {
    showModal.value = true;
  }

  function toggleCurrentPostion() {
    if (watchCurrentState.value) {
      watchCurrentState.value = false;
      globalMapObject.stopLocate();
    } else {
      watchCurrentState.value = true;
      globalMapObject.locate({ watch: true, maximumAge: LOCATION_REFRASH_TIMING });
    }
  }

  export default {
    components: {
      LMap,
      LMarker,
      LTileLayer,
      LCircle,
      LCircleMarker,
      LTooltip,
      Modal,
      LControl,
      LPopup,
      LLayerGroup,
      LControlLayers,
      PopupInPin
    },
    setup() {
      onMounted(async () => {
        const route = useRoute();
        var previousState = localStorage.getItem(STATE_NAME);
        if (route.query != null) {
          if (route.query.restore_state != null) {
            if (route.query.restore_state == "true" && previousState != null && previousState != "undefined") {
              statusMessage.value = "sucess to restore state";
              await loadBorardPinFromString(previousState, null);
            } else {
              await loadBorardPin(route.query);
              statusMessage.value = "successed to load pins and state";
            }
          } else {
            await loadBorardPin(route.query);
            statusMessage.value = "successed to load pins and state";
          }
        }
        return;
      })
      onUnmounted(() => {
        pins.value = [];
        user_input_for_state.value = null;
        user_input_for_from_marge.value = null;
        showModal.value = false;
      })
      return { showModal, user_input_for_state, user_input_for_from_marge, pins, statusMessage, current_postion, accuracy, pins_only_processed, pins_only_non_processed, polling_station_pins, watchCurrentState };
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
        onCancelModal: onCancelModal,
        toggleCurrentPostion: toggleCurrentPostion,
        onLocationFound: onLocationFound,
        onLocationError: onLocationError,
      };
    },
  };
</script>
<template>
  <modal :show="showModal" @close="onCloseRestoreModal(user_input_for_state,user_input_for_from_marge)" @cancel="onCancelModal">
    <template #body>
      <p>一番最初に復元したいものをペーストしてください。</p>
      <textarea v-model="user_input_for_state" />
      <p>二番目に復元したいものをペーストしてください。三番目以降は改行することで追加できます。何もない場合は空欄でも問題ありません。</p>
      <textarea v-model="user_input_for_from_marge" />
      <p>「OK」ボタンを押すと前の作業結果を合成したうえで復元できます。</p>
      <p>両方とも空欄のまま、「OK」ボタンを押した場合、前に保存したやつが復元されます。</p>
    </template>
  </modal>
  <div id="map">
    <l-map @ready="onReady" @locationfound="onLocationFound" @locationerror="onLocationError" :preferCanvas="true" v-model:zoom="zoom" :center="center" :use-global-leaflet="false" :options="{doubleClickZoom:false}">
      <l-tile-layer url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="国土地理院">
      </l-tile-layer>
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap">
      </l-tile-layer>
      <l-tile-layer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    v-model:subdomains="subdomains"
                    layer-type="base"
                    name="GoogleStreetMap">
      </l-tile-layer>
      <l-layer-group name="ポスター掲示板一覧（処理済）" layer-type="overlay" :visible="true">
        <l-circle-marker v-for="pin in pins_only_processed" :key="pin.name" :color="pin.color()" :lat-lng="[pin.lat, pin.long]" :fillOpacity="0.9" :radius="16" :weight="1" :border="1">
          <PopupInPin :pin="pin" @changeStatus="dblClickMarker(pin)" />
        </l-circle-marker>
      </l-layer-group>
      <l-layer-group name="ポスター掲示板一覧（未処理）" layer-type="overlay" :visible="true">
        <l-circle-marker v-for="pin in pins_only_non_processed" :key="pin.name" :color="pin.color()" :lat-lng="[pin.lat, pin.long]" :fillOpacity="0.9" :radius="16" :weight="1" :border="1">
          <PopupInPin :pin="pin" @changeStatus="dblClickMarker(pin)" />
        </l-circle-marker>
      </l-layer-group>
      <l-layer-group name="投票所" layer-type="overlay" :visible="true">
        <l-marker v-for="pin in polling_station_pins" :key="pin.name" :lat-lng="[pin.lat, pin.long]">
          <l-popup>
            <h3>{{pin.name}}</h3>
            <div v-html="pin.description"></div>
            <div>
              <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
            </div>
          </l-popup>
        </l-marker>
      </l-layer-group>
      <l-control-layers />
      <l-marker :lat-lng="current_postion">
      </l-marker>
      <l-circle :lat-lng="current_postion" :radius="accuracy"></l-circle>
      <l-control class="leaflet-control leaflet-control-attribution" position="bottomright">
        <table>
          <tr>
            <td>処理済</td>
            <td>{{pins_only_processed.length}}</td>
          </tr>
          <tr>
            <td>全体</td>
            <td>{{pins.length}}</td>
          </tr>
        </table>
        <p>{{statusMessage}}</p>
      </l-control>
      <l-control class="leaflet-control leaflet-demo-control" position="bottomright" @click="toggleCurrentPostion">
        <span v-if="watchCurrentState">現在位置：ON</span>
        <span v-else>現在位置：OFF</span>
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
    font-style: italic;
  }
</style>
