/**
 * Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Apex Scatter Charts
 */

//
// SCATTER (XY) CHART
//
var colors = ["#1c84ee", "#f9b931", "#4ecac2"];
var options = {
  chart: {
    height: 380,
    type: "scatter",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },

  series: [
    {
      name: "Sample A",
      data: [
        [16.4, 5.4],
        [21.7, 2],
        [25.4, 3],
        [19, 2],
        [10.9, 1],
        [13.6, 3.2],
        [10.9, 7.4],
        [10.9, 0],
        [10.9, 8.2],
        [16.4, 0],
        [16.4, 1.8],
        [13.6, 0.3],
        [13.6, 0],
        [29.9, 0],
        [27.1, 2.3],
        [16.4, 0],
        [13.6, 3.7],
        [10.9, 5.2],
        [16.4, 6.5],
        [10.9, 0],
        [24.5, 7.1],
        [10.9, 0],
        [8.1, 4.7],
        [19, 0],
        [21.7, 1.8],
        [27.1, 0],
        [24.5, 0],
        [27.1, 0],
        [29.9, 1.5],
        [27.1, 0.8],
        [22.1, 2],
      ],
    },
    {
      name: "Sample B",
      data: [
        [6.4, 13.4],
        [1.7, 11],
        [5.4, 8],
        [9, 17],
        [1.9, 4],
        [3.6, 12.2],
        [1.9, 14.4],
        [1.9, 9],
        [1.9, 13.2],
        [1.4, 7],
        [6.4, 8.8],
        [3.6, 4.3],
        [1.6, 10],
        [9.9, 2],
        [7.1, 15],
        [1.4, 0],
        [3.6, 13.7],
        [1.9, 15.2],
        [6.4, 16.5],
        [0.9, 10],
        [4.5, 17.1],
        [10.9, 10],
        [0.1, 14.7],
        [9, 10],
        [12.7, 11.8],
        [2.1, 10],
        [2.5, 10],
        [27.1, 10],
        [2.9, 11.5],
        [7.1, 10.8],
        [2.1, 12],
      ],
    },
    {
      name: "Sample C",
      data: [
        [21.7, 3],
        [23.6, 3.5],
        [24.6, 3],
        [29.9, 3],
        [21.7, 20],
        [23, 2],
        [10.9, 3],
        [28, 4],
        [27.1, 0.3],
        [16.4, 4],
        [13.6, 0],
        [19, 5],
        [22.4, 3],
        [24.5, 3],
        [32.6, 3],
        [27.1, 4],
        [29.6, 6],
        [31.6, 8],
        [21.6, 5],
        [20.9, 4],
        [22.4, 0],
        [32.6, 10.3],
        [29.7, 20.8],
        [24.5, 0.8],
        [21.4, 0],
        [21.7, 6.9],
        [28.6, 7.7],
        [15.4, 0],
        [18.1, 0],
        [33.4, 0],
        [16.4, 0],
      ],
    },
  ],
  xaxis: {
    tickAmount: 10,
  },
  yaxis: {
    tickAmount: 7,
  },
  colors: colors,
  grid: {
    borderColor: "#f1f3fa",
    padding: {
      bottom: 5,
    },
  },
  legend: {
    offsetY: 7,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};
var chart = new ApexCharts(document.querySelector("#basic-scatter"), options);
chart.render();

//
// SCATTER CHART – DATETIME
//
var colors = ["#1c84ee", "#7f56da", "#ef5f5f", "#f9b931", "#22c55e"];
var options = {
  chart: {
    height: 380,
    type: "scatter",
    zoom: {
      type: "xy",
    },
  },
  series: [
    {
      name: "Team 1",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "Team 2",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "Team 3",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "Team 4",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        10,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "Team 5",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
  ],
  dataLabels: {
    enabled: false,
  },
  colors: colors,
  grid: {
    borderColor: "#f1f3fa",
    padding: {
      bottom: 5,
    },
    xaxis: {
      showLines: true,
    },
    yaxis: {
      showLines: true,
    },
  },
  legend: {
    offsetY: 10,
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    max: 70,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

var chart = new ApexCharts(
  document.querySelector("#datetime-scatter"),
  options
);

chart.render();

/*
// this function will generate output in this format
// data = [
    [timestamp, 23],
    [timestamp, 33],
    [timestamp, 12]
    ...
]
*/
function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([baseval, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

//
// SCATTER - IMAGES
//
var options = {
  chart: {
    height: 380,
    type: "scatter",
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: colors,
  series: [
    {
      name: "Dribbble",
      data: [
        [16.4, 5.4],
        [21.7, 4],
        [25.4, 3],
        [19, 2],
        [10.9, 1],
        [13.6, 3.2],
        [10.9, 7],
        [10.9, 8.2],
        [16.4, 4],
        [13.6, 4.3],
        [13.6, 12],
        [29.9, 3],
        [10.9, 5.2],
        [16.4, 6.5],
        [10.9, 8],
        [24.5, 7.1],
        [10.9, 7],
        [8.1, 4.7],
        [19, 10],
        [27.1, 10],
        [24.5, 8],
        [27.1, 3],
        [29.9, 11.5],
        [27.1, 0.8],
        [22.1, 2],
      ],
    },
    {
      name: "Github",
      data: [
        [6.4, 5.4],
        [11.7, 4],
        [15.4, 3],
        [9, 2],
        [10.9, 11],
        [20.9, 7],
        [12.9, 8.2],
        [6.4, 14],
        [11.6, 12],
      ],
    },
  ],
  xaxis: {
    tickAmount: 10,
    min: 0,
    max: 40,
  },
  yaxis: {
    tickAmount: 7,
  },
  markers: {
    size: 20,
  },
  fill: {
    type: "image",
    opacity: 1,
    image: {
      src: [
        "assets/images/brands/dribbble.svg",
        "assets/images/brands/github.svg",
      ],
      width: 40,
      height: 40,
    },
  },
  legend: {
    labels: {
      useSeriesColors: true,
    },
    offsetY: 7,
  },
};
var chart = new ApexCharts(document.querySelector("#scatter-images"), options);
chart.render();
