"use strict";
import Layer from './Layer';

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
    if (!this.counties) {
      this.counties = new google.maps.FusionTablesLayer({
        query: {
          select: 'location',
          from: '1xdysxZ94uUFIit9eXmnw1fYc6VcQiXhceFd_CVKa'
        }
      });
    }
    this.counties.setMap(map);
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

  emitOnDataLoaded(min, max) {
    this.onDataLoadedCallbacks.forEach((cb) => {
      if (cb) {
        cb(min, max);
      }
    });
  }

  clear() {
    if (this.counties) {
      this.counties.setMap(null);
    }
  }
}

export default PesticideLayer;
