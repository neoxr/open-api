/**
 * Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Apex Radar Charts
 */

//
// BASIC RADAR CHART
//
var colors = ["#7f56da"];
var options = {
  chart: {
    toolbar: {
      show: false,
    },
    height: 350,
    type: "radar",
  },
  series: [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20],
    },
  ],
  colors: colors,
  labels: ["January", "February", "March", "April", "May", "June"],
};
var chart = new ApexCharts(document.querySelector("#basic-radar"), options);
chart.render();

//
// RADAR WITH POLYGON-FILL
//
var colors = ["#ff6c2f"];
var options = {
  chart: {
    height: 350,
    type: "radar",
    toolbar: {
      show: false,
    },
  },
  series: [
    {
      name: "Series 1",
      data: [20, 100, 40, 30, 50, 80, 33],
    },
  ],
  labels: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  plotOptions: {
    radar: {
      size: 140,
    },
  },
  colors: colors,
  markers: {
    size: 4,
    colors: ["#fff"],
    strokeColor: colors,
    strokeWidth: 2,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
  yaxis: {
    tickAmount: 7,
    labels: {
      formatter: function (val, i) {
        if (i % 2 === 0) {
          return val;
        } else {
          return "";
        }
      },
    },
  },
};
var chart = new ApexCharts(document.querySelector("#radar-polygon"), options);
chart.render();

//
// RADAR – MULTIPLE SERIES
//
var colors = ["#1c84ee", "#ef5f5f", "#4ecac2"];
var options = {
  chart: {
    height: 350,
    type: "radar",
    toolbar: {
      show: false,
    },
  },
  series: [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20],
    },
    {
      name: "Series 2",
      data: [20, 30, 40, 80, 20, 80],
    },
    {
      name: "Series 3",
      data: [44, 76, 78, 13, 43, 10],
    },
  ],
  stroke: {
    width: 0,
  },
  fill: {
    opacity: 0.4,
  },
  markers: {
    size: 0,
  },
  legend: {
    offsetY: -10,
  },
  colors: colors,
  labels: ["2011", "2012", "2013", "2014", "2015", "2016"],
};
var chart = new ApexCharts(
  document.querySelector("#radar-multiple-series"),
  options
);
chart.render();

function update() {
  function randomSeries() {
    var arr = [];
    for (var i = 0; i < 6; i++) {
      arr.push(Math.floor(Math.random() * 100));
    }

    return arr;
  }

  chart.updateSeries([
    {
      name: "Series 1",
      data: randomSeries(),
    },
    {
      name: "Series 2",
      data: randomSeries(),
    },
    {
      name: "Series 3",
      data: randomSeries(),
    },
  ]);
}
