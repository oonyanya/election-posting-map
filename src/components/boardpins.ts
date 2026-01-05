import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

export class Pin {
  public name: string;
  public description: string | null;
  public lat: number;
  public long: number;
  public status: boolean;
  public color() { return this.status ? "#FF0000" : "#0000FF"; }
  constructor() {
    this.name = "";
    this.description = "";
    this.lat = 0.0;
    this.long = 0.0;
    this.status = false;
    this._hash = null;
  }

  private _hash: string | null;
  public get_hash(): string {
    if (this._hash == null)
      this._hash = this.name + "%20" + this.lat.toString() + "%20" + this.long.toString();
    return this._hash;
  }
}

export class PollingStationPin {
  public name: string;
  public description: string;
  public lat: number;
  public long: number;

  constructor() {
    this.name = "";
    this.description = "";
    this.lat = 0.0;
    this.long = 0.0;
  }
}

export class BoardPins
{
  static readonly DUMMY_NAME = "dummy";

  public serialize(pins: Array<Pin>): string {
    let s = "";
    for (const pin of pins) {
      s += pin.get_hash() + "=" + pin.status + ":";
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

  public async fetchPollingStationFromCsv(election:string, region: string, state: string, city: string): Promise<Array<PollingStationPin>> {
    if (Object.keys(this.cached_address).length == 0) {
      await this.createAddressListCache(election, region, state, city);
    }

    const response = await fetch(`../data/${election}/polling_place/${region}/${state}/${city}.csv`)
    const data = (await response.text()).split("\n");
    const result: Array<PollingStationPin> = [];
    for (const v of data) {
      if (v == "")
        continue;
      const columns = v.split(",");
      if (columns.length == 2) {
        const pin = new PollingStationPin();
        pin.name = columns[0];
        pin.description = columns[1];
        const coordinates = await this.fetchLatLongFormAddress(pin.description);
        if (coordinates == null) {
          console.log("faild to reslove " + pin.description + " in " + pin.name);
          continue;
        } else {
          if (coordinates.length == 2) {
            pin.long = Number(coordinates[0]);
            pin.lat = Number(coordinates[1]);
          } else {
            console.log("faild to reslove " + pin.description + " in " + pin.name);
          }
        }
        result.push(pin);
      } else if (columns.length == 4) {
        const pin = new PollingStationPin();
        pin.name = columns[0];
        pin.description = columns[1];
        pin.long = Number(columns[2]);
        pin.lat = Number(columns[3]);
        result.push(pin);
      }
    }
    return result;

  }

  public async fetchBoardPinsFromJson(election: string, region: string, state: string, city: string, status: string) : Promise<Array<Pin>> {
    let status_list = null;
    if (status != null) {
      status_list = await this.deserialize(status);
    }

    const response = await fetch(`../data/${election}/board/${region}/${state}/${city}.json`)
    const data = await response.json();
    const result: Array<Pin> = [];
    for (const v of data) {
      const pin = new Pin();
      if (v.dispname == null)
        pin.name = BoardPins.DUMMY_NAME;
      else
        pin.name = v.dispname;
      pin.long = v.geom.coordinates[0];
      pin.lat = v.geom.coordinates[1];
      if (status_list && pin.name != null)
        pin.status = status_list[pin.get_hash()];
      else
        pin.status = false;
      result.push(pin);
    }
    return result;
}

  cached_address: { [key: string]: string[] } = {};
;
  public async fetchAddressListFromPath(cache_path: string) {

    if (cache_path != null) {
      const response = await fetch(cache_path);
      try {
        const data = await response.text();
        const lines = data.split('\n');
        for (const line of lines) {
          if (line == "")
            continue;
          const items = line.split(",");
          //本当は中身もチェックしないといけないが、面倒なので、要素数だけチェックする
          if (items.length == 3)
          {
            this.cached_address[items[0]] = [items[1], items[2]];
          }
        }
      } catch {
        //何もしなくていい
      }
    }
  }

  public async createAddressListCache(election: string, region: string, state: string, city: string)
  {
    if (city == "test_no_geo_cache")
    {
      console.log("skip create address cache list because city is " + city);
      return;
    }
    if (Object.keys(this.cached_address).length == 0) {
      await this.fetchAddressListFromPath(`../data/${election}/board/${region}/${state}/${city}.kml.geo_cache`);
      await this.fetchAddressListFromPath(`../data/${election}/polling_place/${region}/${state}/${city}.csv.geo_cache`);
    }
    return;
  }


  public async fetchLatLongFormAddress(address: string | null): Promise<Array<string>> {
    if (address != null) {
      if (this.cached_address != null && this.cached_address[address] != null) {
        const result = this.cached_address[address];
        console.log("sucess to reslove to " + result[0] + "," + result[1] + " from " + address + " in cache");
        return result;
      }
      // 国土地理院API
      // https://elsammit-beginnerblg.hatenablog.com/entry/2021/07/11/122916
      //で変換をかけてる
      const response = await fetch("https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + encodeURIComponent(address));
      try {
        const data = await response.json();
        const result = data[0].geometry.coordinates;
        console.log("sucess to reslove to " + result[0] + "," + result[1] + " from " + address);
        return result;
      } catch {
        return [];
      }
    }
    return [];
  }

  public fetchKml(text:string)
  {
    const parser = new DOMParser();
    const data = parser.parseFromString(text, "text/xml");
    const Placemarks = data.querySelectorAll("Placemark");
    const items = [];
    for (const v of Placemarks) {
      const nameselector = v.querySelector("name");
      let name: string | null = "";
      if (nameselector != null)
        name = nameselector.textContent;

      const coordinatesselector = v.querySelector("coordinates");
      let coordinatesText: string | null = "";
      let coordinates = null;
      if (coordinatesselector != null) {
        coordinatesText = coordinatesselector.textContent;
        if (coordinatesText != null)
          coordinates = coordinatesText.split(",");
      }

      const addressselector = v.querySelector("address");
      let address: string | null = "";
      if (addressselector != null) {
        address = addressselector.textContent;
      }

      const descriptionselector = v.querySelector("description");
      let description: string | null = "";
      if (descriptionselector != null) {
        description = descriptionselector.textContent;
      }

      items.push({ name: name, coordinates: coordinates, address: address, description: description });
    }
    return items;
  }

  public async fetchBoardPinsFromKml(election:string, region:string , state:string, city:string, status:string) : Promise<Array<Pin>> {
    let status_list = null;
    if (status != null) {
      status_list = await this.deserialize(status);
    }

    await this.createAddressListCache(election, region, state, city);

    const items = [];
    const response = await fetch(`../data/${election}/board/${region}/${state}/${city}.kml`);
    const text = await response.text();
    const kml_items = this.fetchKml(text);
    for (const item of kml_items) {
      const pin = new Pin();
      if (item.name == null)
        pin.name = BoardPins.DUMMY_NAME;
      else
        pin.name = item.name;
      pin.description = item.description;

      if (item.coordinates != null) {
        pin.long = Number(item.coordinates[0]);
        pin.lat = Number(item.coordinates[1]);
      } else if (item.address != null) {
        const coordinates = await this.fetchLatLongFormAddress(item.address);
        if (coordinates == null) {
          console.log("faild to reslove " + item.address + " in " + item.name);
          continue;
        } else {
          if (coordinates.length == 2) {
            pin.long = Number(coordinates[0]);
            pin.lat = Number(coordinates[1]);
          } else {
            console.log("faild to reslove " + item.address + " in " + item.name);
          }
        }
      } else {
        console.log("address or  coordinates must be require in " + item.name);
        continue;
      }

      if (status_list && pin.name != null)
        pin.status = status_list[pin.get_hash()];
      else
        pin.status = false;        

      items.push(pin);      
    }
    return items;
  }

  public async mergeBoardPins(targetpins: Array<Pin>, status: string)
  {
    let status_list = null;
    if (status != null) {
      status_list = await this.deserialize(status);
    }

    const items = [];
    for (const oldpin of targetpins)
    {
      const pin = new Pin();
      pin.name = oldpin.name;
      pin.lat = oldpin.lat;
      pin.long = oldpin.long;
      if (status_list && pin.name != null && oldpin.status == false)
        pin.status = status_list[pin.get_hash()];
      else
        pin.status = oldpin.status;
      items.push(pin);
    }
    return items;
  }

}
