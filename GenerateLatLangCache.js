import * as fs from "fs/promises";
import { glob } from "glob";
import { JSDOM } from 'jsdom';

async function fetchLatLongFormAddress(address)
{
  if (address != null) {
    // 国土地理院API
    // https://elsammit-beginnerblg.hatenablog.com/entry/2021/07/11/122916
    //で変換をかけてる
    const response = await fetch("https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + encodeURIComponent(address));
    try {
      const data = await response.json();
      return data[0].geometry.coordinates;
    } catch {
      return [];
    }
  }
  return [];
}

// うまく動かないので、boardpins.ts からコピペ
async function GenerateCache() {
  const remove_files = await glob("./public/data/**/*.geo_cache");
  for (const file of remove_files) {
    fs.rm(file);
  }

  const files = await glob("./public/data/**/*.kml");
  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const data = parser.parseFromString(text, "text/xml");
    const Placemarks = data.querySelectorAll("Placemark");
    for (const v of Placemarks) {
      const nameselector = v.querySelector("name");
      let name = "";
      if (nameselector != null)
        name = nameselector.textContent;

      const coordinatesselector = v.querySelector("coordinates");
      let coordinatesText = "";
      let coordinates = null;
      if (coordinatesselector != null) {
        coordinatesText = coordinatesselector.textContent;
        if (coordinatesText != null)
          coordinates = coordinatesText.split(",");
      }

      const addressselector = v.querySelector("address");
      let address = "";
      if (addressselector != null) {
        address = addressselector.textContent;
      }

      if (coordinates != null)
        continue;
      if (address != null) {
        const coordinates = await fetchLatLongFormAddress(address);
        if (coordinates == null) {
          console.log("faild to reslove " + address + " in " + name);
          continue;
        } else {
          const str = address + "," + coordinates;
          const write_file_str = file + ".geo_cache";
          await fs.appendFile(write_file_str, str + "\r\n");
          if (coordinates.length == 2) {
            console.log("sucess to reslove " + coordinates[0] + "," + coordinates[1] + " in " + name + " from " + address);
            console.log("and then saved to " + write_file_str);
          } else {
            console.log("failed to reslove  in " + name + " from " + address);
          }
        }
      }
    }
  }
}


const promise = GenerateCache();
promise.then(() => {
  console.log("generated cache");
});
