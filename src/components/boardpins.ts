import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

export class Pin {
  public name: string | null;
  public lat: number;
  public long: number;
  public status: boolean;
  public color() { return this.status ? "#FF0000" : "#0000FF"; }
  constructor() {
    this.name = "";
    this.lat = 0.0;
    this.long = 0.0;
    this.status = false;
  }
}

export class BoardPins
{
  public serialize(pins : Array<Pin>):string {
    let s = "";
    for (const pin of pins) {
      s += pin.name + "=" + pin.status + ":";
    }
    return compressToEncodedURIComponent(s);
  }

  public deserialize(compressedStr: string): { [key: string]: boolean } {
    const s = decompressFromEncodedURIComponent(compressedStr);
    const tokens = s.split(":");
    const result: { [key: string] : boolean } = {};
    for (const token of tokens) {
      const pair = token.split("=");
      result[pair[0]] = (pair[1] == "true");
    }
    return result;
  }

  public async fetchBoardPinsFromJson(region: string, state: string, city: string, status: string) : Promise<Array<Pin>> {
    let status_list = null;
    if (status != null) {
      status_list = await this.deserialize(status);
    }

    const response = await fetch(`../data/${region}/${state}/${city}.json`)
    const data = await response.json();
    const result: Array<Pin> = [];
    for (const v of data) {
      const pin = new Pin();
      pin.name = v.dispname;
      pin.long = v.geom.coordinates[0];
      pin.lat = v.geom.coordinates[1];
      if (status_list)
        pin.status = status_list[v.dispname];
      else
        pin.status = false;
      result.push(pin);
    }
    return result;
}

  public async fetchLatLongFormAddress(address: string | null): Promise<Array<string>> {
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

  public async fetchBoardPinsFromKml(region:string , state:string, city:string, status:string) : Promise<Array<Pin>> {
    let status_list = null;
    if (status != null) {
      status_list = await this.deserialize(status);
    }

    const response = await fetch(`../data/${region}/${state}/${city}.kml`);
    const text = await response.text();
    const parser = new DOMParser();
    const data = parser.parseFromString(text, "text/xml");
    const Placemarks = data.querySelectorAll("Placemark");
    const items = [];
    for (const v of Placemarks) {
      const pin = new Pin();

      const nameselector = v.querySelector("name");
      let name: string | null = "";
      if (nameselector != null)
        name = nameselector.textContent;
      else
        name = "";
      pin.name = name;

      const coordinatesselector = v.querySelector("coordinates");
      let coordinatesText: string | null = "";
      let coordinates;
      if (coordinatesselector != null) {
        coordinatesText = coordinatesselector.textContent;
        if (coordinatesText != null)
          coordinates = coordinatesText.split(",");
      } else {
        const addressselector = v.querySelector("address");
        if (addressselector != null) {
          const address: string | null = addressselector.textContent;
          coordinates = await this.fetchLatLongFormAddress(address);
          if (coordinates == null) {
            console.log("faild to reslove " + address + " in " + name);
            continue;
          } else {
            console.log("sucess to reslove " + coordinates[0] + "," + coordinates[1] + " in " + name + " from " + address);
          }
        } else {
          console.log("must be have coordinates or address in " + name);
          continue;
        }
      }
      if (coordinates != undefined) {
        pin.long = Number(coordinates[0]);
        pin.lat = Number(coordinates[1]);
      } else {
        console.log("coordinates is undefind in " + name);      
        continue;
      }

      if (status_list && pin.name != null)
        pin.status = status_list[pin.name];
      else
        pin.status = false;

      items.push(pin);
    }

    return items;
  }

}
