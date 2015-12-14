"use strict";
import React from "react";
import ReactDOM from "react-dom";
import debugFactory from "debug";
const debug = debugFactory('app:components:CropMetricsPane');

import {Glyphicon, Button, DropdownButton, MenuItem} from "react-bootstrap";
import RainfallVsYieldChart from './rainfall_vs_yield';
import MonthlyRainfallChart from './monthly_rainfall';
import CropSelection from "./CropSelection";


let CropMetricsPaneComponent = React.createClass({
    propTypes: {
        state: React.PropTypes.string.isRequired,
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired,
        zoom: React.PropTypes.number.isRequired,
        crop: React.PropTypes.string.isRequired,
        radius: React.PropTypes.number.isRequired,
        onCropChange: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div className="pane">
                <div className="paneHeader">
                    <h4 className="paneHeaderContent">What do you grow?</h4>
                    <CropSelection state={this.props.state} onSelect={this.props.onCropChange} crop={this.props.crop} />
                </div>
                <div>
                    <RainfallVsYieldChart crop={this.props.crop}
                        state={this.props.state}
                        lat={this.props.lat}
                        lng={this.props.lng}
                        radius={this.props.radius}
                        zoom={this.props.zoom} />
                </div>
                <div>
                </div>
            </div>
        );
    },

});
module.exports = CropMetricsPaneComponent;
