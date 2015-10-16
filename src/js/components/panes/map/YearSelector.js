"use strict";
import React from "react";
import ReactDOM from "react-dom";
import debugFactory from "debug";
const debug = debugFactory('app:components:YearSelector');

const MIN_YEAR = 2000;
const MAX_YEAR = 2012;
const YEARS = [];
for (let y = MAX_YEAR; y >= MIN_YEAR; y--) {
    YEARS.push(y);
}

const YearSelector = React.createClass({
    getInitialState() {
        return { selectedYear: 2012 }
    },
    render() {
        const yearComponents = YEARS.map((year) => {
            return (<div key={"year" + year} className="yearbox">{year}</div>);
        });
        for (let index = 1; index < yearComponents.length; index += 2) {
            yearComponents.splice(index, 0, (<div key={"yearline" + index} className="interYearLine"/>));
        }

        return (
            <div className="yearSelector">
                {yearComponents}
            </div>
        );
    }
});
module.exports = YearSelector;