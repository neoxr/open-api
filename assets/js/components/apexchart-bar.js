/**
 * Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Apex Bar Charts
 */

//
// BASIC BAR CHART
//

var colors = ["#1c84ee"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  series: [
    {
      data: [455, 435, 410, 480, 530, 575, 685, 1345, 1165, 1075],
    },
  ],
  colors: colors,
  xaxis: {
    categories: [
      "South Korea",
      "Canada",
      "United Kingdom",
      "Netherlands",
      "Italy",
      "France",
      "Japan",
      "United States",
      "China",
      "Germany",
    ],
  },
  states: {
    hover: {
      filter: "none",
    },
  },
  grid: {
    borderColor: "#f1f3fa",
  },
};

var chart = new ApexCharts(document.querySelector("#basic-bar"), options);

chart.render();

//
// GROUPED BAR CHART
//
var colors = ["#1c84ee", "#4ecac2"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  colors: colors,
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  series: [
    {
      name: "Series 1",
      data: [51, 30, 31, 50, 11, 42, 30],
    },
    {
      name: "Series 2",
      data: [46, 57, 43, 66, 24, 45, 23],
    },
  ],
  xaxis: {
    categories: [2016, 2017, 2018, 2019, 2021, 2022, 2023],
  },
  legend: {
    offsetY: 5,
  },
  states: {
    hover: {
      filter: "none",
    },
  },
  grid: {
    borderColor: "#f1f3fa",
    padding: {
      bottom: 5,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#grouped-bar"), options);

chart.render();

//
// STACKED BAR CHART
//
var colors = ["#1c84ee", "#4ecac2", "#22c55e", "#f9b931", "#ff6c2f"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    show: false,
  },
  series: [
    {
      name: "Marine Sprite",
      data: [30, 17, 24, 37, 30, 29, 15],
    },
    {
      name: "Striking Calf",
      data: [11, 9, 7, 10, 8, 11, 6],
    },
    {
      name: "Tank Picture",
      data: [14, 19, 13, 11, 17, 13, 22],
    },
    {
      name: "Bucket Slope",
      data: [55, 34, 35, 54, 15, 45, 34],
    },
    {
      name: "Reborn Kid",
      data: [46, 57, 43, 39, 24, 45, 23],
    },
  ],
  xaxis: {
    categories: [2016, 2017, 2018, 2019, 2021, 2022, 2023],
    labels: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
      colors: "#fff",
    },
  },
  colors: colors,
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  states: {
    hover: {
      filter: "none",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
    offsetY: 10,
  },
  grid: {
    borderColor: "#f1f3fa",
  },
};

var chart = new ApexCharts(document.querySelector("#stacked-bar"), options);

chart.render();

//
// 100% STACKED BAR CHART
//
var colors = ["#1c84ee", "#4ecac2", "#22c55e", "#f9b931", "#ff6c2f"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    stacked: true,
    stackType: "100%",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  series: [
    {
      name: "Marine Sprite",
      data: [30, 17, 24, 37, 30, 29, 15],
    },
    {
      name: "Striking Calf",
      data: [11, 9, 7, 10, 8, 11, 6],
    },
    {
      name: "Tank Picture",
      data: [14, 19, 13, 11, 17, 13, 22],
    },
    {
      name: "Bucket Slope",
      data: [55, 34, 35, 54, 15, 45, 34],
    },
    {
      name: "Reborn Kid",
      data: [46, 57, 43, 39, 24, 45, 23],
    },
  ],
  xaxis: {
    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
  },
  colors: colors,
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  states: {
    hover: {
      filter: "none",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
    offsetY: 10,
  },
  grid: {
    borderColor: "#f1f3fa",
    padding: {
      top: 0,
    },
  },
};

var chart = new ApexCharts(
  document.querySelector("#full-stacked-bar"),
  options
);

chart.render();

//
// BAR WITH NEGATIVE VALUES
//
var colors = ["#1c84ee", "#4ecac2"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  colors: colors,
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "80%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  series: [
    {
      name: "Males",
      data: [
        0.75, 0.85, 0.96, 1.08, 1.7, 2.3, 3.1, 4.0, 4.1, 4.4, 4.2, 4.5, 4.3,
        4.4, 4.7, 4.1, 3.7, 3.2,
      ],
    },
    {
      name: "Females",
      data: [
        -0.75, -0.85, -0.86, -0.98, -1.2, -2.0, -2.65, -3.5, -3.76, -4.02, -4.1,
        -4.2, -3.9, -3.8, -3.9, -3.2, -2.9, -2.6,
      ],
    },
  ],
  grid: {
    xaxis: {
      showLines: false,
    },
  },
  yaxis: {
    min: -5,
    max: 5,
    title: {
      // text: 'Age',
    },
  },
  tooltip: {
    shared: false,
    x: {
      formatter: function (val) {
        return val;
      },
    },
    y: {
      formatter: function (val) {
        return Math.abs(val) + "%";
      },
    },
  },
  xaxis: {
    categories: [
      "90+",
      "85-89",
      "80-84",
      "75-79",
      "70-74",
      "65-69",
      "60-64",
      "55-59",
      "50-54",
      "45-49",
      "40-44",
      "35-39",
      "30-34",
      "25-29",
      "20-24",
      "15-19",
      "10-14",
      "0-9",
    ],
    title: {
      text: "Percent",
    },
    labels: {
      formatter: function (val) {
        return Math.abs(Math.round(val)) + "%";
      },
    },
  },
  legend: {
    offsetY: 7,
  },
  grid: {
    borderColor: "#f1f3fa",
    padding: {
      bottom: 5,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#negative-bar"), options);

chart.render();

//
// Reversed Bar Chart
//
var colors = ["#f9b931"];
var options = {
  series: [
    {
      data: [380, 400, 418, 440, 500, 530, 580],
    },
  ],
  chart: {
    type: "bar",
    height: 380,
    toolbar: {
      show: false,
    },
  },
  annotations: {
    xaxis: [
      {
        x: 500,
        borderColor: colors[1],
        label: {
          borderColor: colors[1],
          style: {
            color: "#fff",
            background: colors[1],
          },
          text: "X annotation",
        },
      },
    ],
    yaxis: [
      {
        y: "July",
        y2: "September",
        label: {
          text: "Y annotation",
        },
      },
    ],
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: ["Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan"],
  },
  colors: colors,
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  yaxis: {
    reversed: true,
    axisTicks: {
      show: true,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#reversed-bar"), options);
chart.render();

//
// PATTERNED BAR CHART
//
var colors = ["#1c84ee", "#22c55e", "#040505", "#4ecac2"];
var options = {
  chart: {
    height: 380,
    type: "bar",
    stacked: true,
    toolbar: {
      show: false,
    },
    shadow: {
      enabled: true,
      blur: 1,
      opacity: 0.5,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "60%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  series: [
    {
      name: "Marine Sprite",
      data: [44, 55, 41, 37, 22, 43, 21],
    },
    {
      name: "Striking Calf",
      data: [53, 32, 33, 52, 13, 43, 32],
    },
    {
      name: "Tank Picture",
      data: [12, 17, 11, 9, 15, 11, 20],
    },
    {
      name: "Bucket Slope",
      data: [9, 7, 5, 8, 6, 9, 4],
    },
  ],
  xaxis: {
    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  colors: colors,
  fill: {
    type: "pattern",
    opacity: 1,
    pattern: {
      style: ["circles", "slantedLines", "verticalLines", "horizontalLines"], // string or array of strings
    },
  },
  states: {
    hover: {
      filter: "none",
    },
  },
  legend: {
    position: "right",
  },
  grid: {
    borderColor: "#f1f3fa",
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
};

var chart = new ApexCharts(document.querySelector("#pattern-bar"), options);

chart.render();

//
// BAR WITH IMAGE FILL
//

var labels = Array.apply(null, { length: 39 }).map(function (el, index) {
  return index + 1;
});

var options = {
  chart: {
    height: 450,
    type: "bar",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "100%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    colors: ["#fff"],
    width: 0.2,
  },
  series: [
    {
      name: "coins",
      data: [
        2, 4, 3, 4, 3, 5, 5, 6.5, 6, 5, 4, 5, 8, 7, 7, 8, 8, 10, 9, 9, 12, 12,
        11, 12, 13, 14, 16, 14, 15, 17, 19, 21,
      ],
    },
  ],
  labels: labels,
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    title: {
      text: "Weight",
    },
  },
  grid: {
    position: "back",
    borderColor: "#f1f3fa",
  },
  fill: {
    type: "image",
    opacity: 0.87,
    image: {
      src: ["../../../assets/images/small/img-4.jpg"],
      width: 466,
      height: 406,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#image-fill-bar"), options);

chart.render();

//
// CUSTOM DATALABELS BAR
//

var colors = [
  "#1c84ee",
  "#53389f",
  "#7f56da",
  "#ff86c8",
  "#ef5f5f",
  "#ff6c2f",
  "#f9b931",
  "#22c55e",
  "#040505",
  "#4ecac2",
];
var options = {
  chart: {
    height: 450,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      barHeight: "100%",
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: "bottom",
      },
    },
  },
  colors: colors,
  dataLabels: {
    enabled: true,
    textAnchor: "start",
    style: {
      colors: ["#fff"],
    },
    formatter: function (val, opt) {
      return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
    },
    offsetX: 0,
    dropShadow: {
      enabled: false,
    },
  },
  series: [
    {
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    },
  ],
  stroke: {
    width: 0,
    colors: ["#fff"],
  },
  xaxis: {
    categories: [
      "South Korea",
      "Canada",
      "United Kingdom",
      "Netherlands",
      "Italy",
      "France",
      "Japan",
      "United States",
      "China",
      "India",
    ],
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  grid: {
    borderColor: "#f1f3fa",
  },

  tooltip: {
    theme: "dark",
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return "";
        },
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#datalables-bar"), options);

chart.render();

//
// Bar with Markers
//

var colors = ["#f9b931", "#22c55e"];
var options = {
  series: [
    {
      name: "Actual",
      data: [
        {
          x: "2017",
          y: 12,
          goals: [
            {
              name: "Expected",
              value: 14,
              strokeWidth: 2,
              strokeDashArray: 2,
              strokeColor: colors[1],
            },
          ],
        },
        {
          x: "2018",
          y: 44,
          goals: [
            {
              name: "Expected",
              value: 54,
              strokeWidth: 5,
              strokeHeight: 10,
              strokeColor: colors[1],
            },
          ],
        },
        {
          x: "2019",
          y: 54,
          goals: [
            {
              name: "Expected",
              value: 52,
              strokeWidth: 10,
              strokeHeight: 0,
              strokeLineCap: "round",
              strokeColor: colors[1],
            },
          ],
        },
        {
          x: "2020",
          y: 66,
          goals: [
            {
              name: "Expected",
              value: 61,
              strokeWidth: 10,
              strokeHeight: 0,
              strokeLineCap: "round",
              strokeColor: colors[1],
            },
          ],
        },
        {
          x: "2021",
          y: 81,
          goals: [
            {
              name: "Expected",
              value: 66,
              strokeWidth: 10,
              strokeHeight: 0,
              strokeLineCap: "round",
              strokeColor: colors[1],
            },
          ],
        },
        {
          x: "2022",
          y: 67,
          goals: [
            {
              name: "Expected",
              value: 70,
              strokeWidth: 5,
              strokeHeight: 10,
              strokeColor: colors[1],
            },
          ],
        },
      ],
    },
  ],
  chart: {
    height: 380,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  colors: colors,
  dataLabels: {
    dataLabels: {
      formatter: function (val, opt) {
        var goals =
          opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

        // if (goals && goals.length) {
        //   return `${val} / ${goals[0].value}`
        // }
        return val;
      },
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ["Actual", "Expected"],
    markers: {
      fillColors: colors,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#bar-markers"), options);
chart.render();
