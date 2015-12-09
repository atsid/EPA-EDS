"use strict";
import Layer from './Layer';
import request from 'superagent';
import debugFactory from "debug";
const debug = debugFactory('app:layers:PesticideLayer');

const mapKeys = {
  2009: "1nMEiEPdRJj1ErZqLtbBB380kNMxdNr0Ivt7-QJXd",
  2008: "1fSTwmEYhXsjrYN8-JDslpzDNVQFEprsPTg6j8HiW",
  2007: "1cz1ftDFRkKD7JBMwgqEWs1iUWBJzvy1MaMBrM4kq",
  2006: "1S9FMhERR9KZqlJqF_InWoyUeaaKIjiQY8grVbpih",
  2005: "16VPVKyjxWsV508W7hmCeGq9I1pa-AJi3unCVpMzr",
  2004: "1B24XlEtAckhnPNLhYfje8IApWM-8j620QLm4gtBC",
  2003: "11WhUtIkxdEyWyopZEnBVVTzD41ZP096VLICyo_zH",
  2002: "1tvGRUaFyLdnHvYYftUVlRUeeLKPrjEbk-Nwb4Rlj",
  2001: "1eJpuZJL38pMvCIkbZWBlX7-hol870X-xKNbBgHca",
  2000: "1PCyFHqmjDT7LTysuj9LROq7mc4DkxK_TthRfk6bo"
};
let getReq = null;

class PesticideLayer extends Layer {
  constructor(map, isVisible) {
    super(map, isVisible);
    this.year = 2009;
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
    this.presentPesticideData(map);
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

  presentPesticideData(map) {
    if (mapKeys[this.year]) {
      this.counties = new google.maps.FusionTablesLayer({
        map: map,
        heatmap: {enabled: false},
        query: {
          select: "geometry",
          from: mapKeys[this.year],
          where: "weight > 0"
        },
        options: {
          styleId: 2,
          templateId: 2
        }
      });
      this.counties.setMap(map);
    }
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
