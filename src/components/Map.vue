<script lang="ts">
  import { forEachChild } from "typescript";
  import { Suspense, onMounted } from 'vue'
  import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
  import "leaflet/dist/leaflet.css";
  import {
    LMap,
    LCircleMarker,
    LTileLayer,
    LControlLayers,
    LTooltip,
  } from "@vue-leaflet/vue-leaflet";

  class Pin {
    name: String;
    lat: int;
    long: int;
    status: Boolean;
    color() { return this.status ? "#FF0000" : "#0000FF"; }
  }

  class Map {
    region: String;
    state: String;
    city: String;
  }

  let current_map = new Map();

function serialize(pins) {
    let s = "";
    for (let pin of pins) {
      s += pin.name + "=" + pin.status + ":";
    }
    return compressToEncodedURIComponent(s);
  }

function deserialize(compressedStr) {
    let s = decompressFromEncodedURIComponent(compressedStr);
    let tokens = s.split(":");
    let result = {};
    for (let token of tokens) {
      let pair = token.split("=");
      result[pair[0]] = (pair[1] == "true");
    }
    return result;
  }

  async function fetchBoardPinsFromJson(region, state, city, status) {
    if (region != null) {
      current_map.region = region;
    } else {
      current_map.region = "japan";
    }

    if (state != null) {
      current_map.state = state;
    } else {
      current_map.state = "saitama";
    }

    if (city != null) {
      current_map.city = city;
    } else {
      current_map.city = "test";
    }

    let status_list = null;
    if (status != null) {
      status_list = await deserialize(status);
    }

    let response = await fetch(`../data/${current_map.region}/${current_map.state}/${current_map.city}.json`)
    const data = await response.json();
    return data.map((v) => {
      let pin = new Pin();
      pin.name = v.dispname;
      pin.long = v.geom.coordinates[0];
      pin.lat = v.geom.coordinates[1];
      if (status_list)
        pin.status = status_list[v.dispname];
      else
        pin.status = false;
      return pin;
    });
  }

  async function clickCopyStateButton() {
    let str = serialize(pins);
    const oldurl = new URLSearchParams(window.location.search);
    let newurl = window.location.host + "?region=" + current_map.region + "&state="+ current_map.state + "&city=" + current_map.city + "&status=" + str;
    navigator.clipboard.writeText(newurl);
  }

  function dblClickMarker(pin) {
    if (pin.status)
      pin.status = false;
    else
      pin.status = true;
  }

  function onMapReady(mapObject) {
    mapObject.locate({ setView: true, maxZoom: 16 });
  }

  const url = new URLSearchParams(window.location.search);
  let region,state,city, status;
  if (url.has("region"))
    region = url.get("region");
  if (url.has("state"))
    state = url.get("state");
  if (url.has("city"))
    city = url.get("city");
  if (url.has("status"))
    status = url.get("status");
  const pins = await fetchBoardPinsFromJson(region, state, city, status);

  export default {
    components: {
      LMap,
      LTileLayer,
      LCircleMarker,
      LTooltip,
    },
    data() {
      return {
        zoom: 15,
        center: [35.6769883, 139.7588499],
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        pins: pins,
        dblClickMarker: dblClickMarker,
        clickCopyStateButton: clickCopyStateButton,
        onReady: onMapReady,
      };
    },
  };
</script>
<template>
  <button @click="clickCopyStateButton">状態をコピーする</button>
  <div style="height:1080px;">
    <l-map @ready="onReady" v-model:zoom="zoom" :use-global-leaflet="false" :center="center">
      <l-tile-layer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    v-model:subdomains="subdomains"
                    layer-type="base"
                    name="GoogleStreetMap">
      </l-tile-layer>
      <l-circle-marker v-for="pin in pins" @click="dblClickMarker(pin)" :color="pin.color()" :lat-lng="[pin.lat, pin.long]" :fillOpacity="0.9" :radius="8" :weight="1" :border="1">
        <l-tooltip>
          <b>{{pin.name}}</b>
          <p v-if="pin.status">処理</p>
          <p v-else>未処理</p>
          <a :href='"https://www.google.com/maps/search/" +pin.lat +","+pin.long' target="_blank" rel="noopener noreferrer">({{pin.lat}}, {{pin.long}})</a>
        </l-tooltip>
      </l-circle-marker>
    </l-map>
  </div>
</template>
