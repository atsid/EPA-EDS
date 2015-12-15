"use strict";
import React from "react";
import _ from "lodash";
import ReactDOM from "react-dom";
import debugFactory from "debug";
const debug = debugFactory('app:components:OverlaySelector');

import {Button} from "react-bootstrap";

import VegetationLayer from './layers/VegetationLayer';
import PesticideLayer from './layers/PesticideLayer';

const OverlaySelector = React.createClass({
    propTypes: {
        map: React.PropTypes.object.isRequired,
        onLoadingChange: React.PropTypes.object.isRequired,
        onYearUpdate: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            isLoading: false,
            overlays: {
                plantDensity: false,
                soilType: false,
                pesticideDensity: false,
            },
            layers: {
                plantDensity: new VegetationLayer(this.props.map),
                pesticideDensity: new PesticideLayer(this.props.map),
            }
        };
    },

    componentDidMount() {
        this.props.onYearUpdate((year) => {
            this.state.layers.plantDensity.setYear(year)
            this.state.layers.pesticideDensity.setYear(year);
        });
        this.state.layers.plantDensity.onLoadingChange(this.props.onLoadingChange);
        this.state.layers.plantDensity.onDataLoaded(this.onVegitationDataLoaded);
        this.state.layers.pesticideDensity.onLoadingChange(this.props.onLoadingChange);
        this.state.layers.pesticideDensity.onDataLoaded(this.onPesticideDataLoaded);
    },

    onVegitationDataLoaded(minValue, maxValue) {
        this.setState(_.merge(this.state, { vegitationScale: { min: minValue, max: maxValue }, disabled: false }));
    },

    onPesticideDataLoaded() {
        this.setState(_.merge(this.state, { disabled: false }));
    },

    render() {
        const overlayStyle = (enabled) => enabled ? 'success' : 'default';
        const overlays = this.state.overlays;
        const toggleOverlay = (name) => {
            const isEnabled = this.state.overlays[name];
            let nextState = _.merge(this.state, {overlays: {[name]: !isEnabled}, disabled: !isEnabled});
            if (name === 'plantDensity') {
                delete nextState.vegitationScale;
            }
            this.setState(nextState);
            this.state.layers[name][(isEnabled ? 'hide' : 'show')]();
        };

        return (
            <div className="overlaySelectorGroup">
                <div>
                    <Button bsStyle={overlayStyle(overlays.pesticideDensity)}
                        onClick={() => toggleOverlay('pesticideDensity')}
                        className="layerButton"
                        disabled={this.state.disabled}>
                        <img className="layerIcon" src="src/img/icons/activities/pesticide.png"/>
                        &nbsp;
                        <span>Pesticides</span>
                    </Button>
                </div>
                <div>
                    <Button bsStyle={overlayStyle(overlays.plantDensity)}
                        onClick={() => toggleOverlay('plantDensity')}
                        className="layerButton"
                        disabled={this.state.disabled}>
                        <img className="layerIcon" src="src/img/icons/plant_density.png"/>
                        &nbsp;
                        <span>Plant Density</span>
                    </Button>
                </div>
                <div className="densityArea">
                    <div style={{ display: overlays.plantDensity && this.state.vegitationScale ? "block" : "none" }}>
                        <span> Density Scale:</span>
                        <div className="scale">
                            <span className="min-label">{ this.state.vegitationScale && this.state.vegitationScale.min ? this.state.vegitationScale.min.toFixed(1) : ""}</span>
                            <span className="gradient">&nbsp;</span>
                            <span className="max-label">{ this.state.vegitationScale && this.state.vegitationScale.max ? this.state.vegitationScale.max.toFixed(1) : "" }</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = OverlaySelector;
