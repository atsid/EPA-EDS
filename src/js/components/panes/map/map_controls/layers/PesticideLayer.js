"use strict";
import Layer from './Layer';
import request from 'superagent';
import debugFactory from "debug";
const debug = debugFactory('app:layers:PesticideLayer');

let getReq = null;

class PesticideLayer extends Layer {
  constructor(map, isVisible) {
    super(map, isVisible);
    this.year = 2014;
    this.onLoadingChangeCallbacks = [];
    this.onDataLoadedCallbacks = [];
  }

  setYear(year) {
    if (this.year !== year) {
      this.year = year;
      this.rerender();
    }
  }

  generateMapArtifacts(map) {
    if (getReq) {
      debug('pest get request aborted');
      getReq.abort();
      getReq = null;
    }

    this.emitLoadingChange(true);
    return this.initiateDataRequest()
      .then((data) => this.formatData(data))
      .then((data) => this.presentPesticideData(data, map))
      .catch((err) => debug('Pesticide Layer Error', err));
  }

  onLoadingChange(cb) {
    this.onLoadingChangeCallbacks.push(cb);
  }

  onDataLoaded(cb) {
    this.onDataLoadedCallbacks.push(cb);
  }

  emitLoadingChange(value) {
    this.onLoadingChangeCallbacks.forEach((cb) => {
      if (cb && cb.handle) {
          cb.handle(value);
      }
    });
  }

  emitOnDataLoaded() {
    this.onDataLoadedCallbacks.forEach((cb) => {
      if (cb) {
        cb();
      }
    });
  }

  initiateDataRequest() {
    const url = encodeURI('/usda-challenge/data/pesticides/2,4-D_' + this.year);
    return new Promise((resolve, reject) => {
      debug('requesting new pesticide data');
      getReq = request.get(url)
      .end((err, res) => {
        if (err) {
          debug("Error Requesting Pest. Data", err);
          reject (err);
        }
        else {
          debug('received pesticide data info', res);
          resolve(JSON.parse(res.text));
          getReq = null;
        }
      });
    });
  }

  formatData(data) {
    return new Promise((resolve, reject) => {
      const styles = [];
      data.forEach((item) => {
        styles.push({
          where: "'GEO_ID' == " + item.fips,
          polygonOptions: {
            fillColor: "#00CCCC"
          }
        });
      });
      resolve(styles);
    });
  }

  presentPesticideData(data, map) {
    this.counties = new google.maps.FusionTablesLayer({
      query: {
        select: 'location',
        from: '1xdysxZ94uUFIit9eXmnw1fYc6VcQiXhceFd_CVKa'
      },
      styles: data
    });
    this.counties.setMap(map);
    this.emitOnDataLoaded();
    this.emitLoadingChange(false);
  }

  clear() {
    this.emitLoadingChange(false);
    if (this.counties) {
      this.counties.setMap(null);
    }
  }
}

export default PesticideLayer;
