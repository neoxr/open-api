/**
 * Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Apex Boxplot Charts
 */

//
// BASIC BOXPLOT
//

var colors = ["#1c84ee", "#22c55e"];
var options = {
    series: [{
        type: 'boxPlot',
        data: [{
            x: 'Jan 2015',
            y: [54, 66, 69, 75, 88]
        },
        {
            x: 'Jan 2016',
            y: [43, 65, 69, 76, 81]
        },
        {
            x: 'Jan 2017',
            y: [31, 39, 45, 51, 59]
        },
        {
            x: 'Jan 2018',
            y: [39, 46, 55, 65, 71]
        },
        {
            x: 'Jan 2019',
            y: [29, 31, 35, 39, 44]
        },
        {
            x: 'Jan 2020',
            y: [41, 49, 58, 61, 67]
        },
        {
            x: 'Jan 2021',
            y: [54, 59, 66, 71, 88]
        }
        ]
    }],
    chart: {
        type: 'boxPlot',
        height: 350,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        boxPlot: {
            colors: {
                upper: colors[0],
                lower: colors[1]
            }
        }
    },
    stroke: {
        colors: ['#a1a9b1']
    }
};
var chart = new ApexCharts(document.querySelector("#basic-boxplot"), options);
chart.render();


//
// SCATTER BOXPLOT
//

var colors = ["#1c84ee", "#22c55e"];
var options = {
    series: [{
        name: 'Box',
        type: 'boxPlot',
        data: [{
            x: new Date('2017-01-01').getTime(),
            y: [54, 66, 69, 75, 88]
        },
        {
            x: new Date('2018-01-01').getTime(),
            y: [43, 65, 69, 76, 81]
        },
        {
            x: new Date('2019-01-01').getTime(),
            y: [31, 39, 45, 51, 59]
        },
        {
            x: new Date('2020-01-01').getTime(),
            y: [39, 46, 55, 65, 71]
        },
        {
            x: new Date('2021-01-01').getTime(),
            y: [29, 31, 35, 39, 44]
        }
        ]
    },
    {
        name: 'Outliers',
        type: 'scatter',
        data: [{
            x: new Date('2017-01-01').getTime(),
            y: 32
        },
        {
            x: new Date('2018-01-01').getTime(),
            y: 25
        },
        {
            x: new Date('2019-01-01').getTime(),
            y: 64
        },
        {
            x: new Date('2020-01-01').getTime(),
            y: 27
        },
        {
            x: new Date('2020-01-01').getTime(),
            y: 78
        },
        {
            x: new Date('2021-01-01').getTime(),
            y: 15
        }
        ]
    }
    ],
    chart: {
        type: 'boxPlot',
        height: 350,
        toolbar: {
            show: false
        }
    },
    colors: colors,
    stroke: {
        colors: ['#a1a9b1']
    },
    legend: {
        offsetY: 10,
    },
    xaxis: {
        type: 'datetime',
        tooltip: {
            formatter: function (val) {
                return new Date(val).getFullYear()
            }
        }
    },
    grid: {
        padding: {
            bottom: 5
        }
    },
    tooltip: {
        shared: false,
        intersect: true
    },
    plotOptions: {
        boxPlot: {
            colors: {
                upper: colors[0],
                lower: colors[1]
            }
        }
    },
};

var chart = new ApexCharts(document.querySelector("#scatter-boxplot"), options);
chart.render();