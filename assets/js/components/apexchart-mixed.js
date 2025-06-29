/**
 * Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Apex Mixed Charts
 */

//
// LINE & COLUMN CHART
//
var colors = ["#1c84ee", "#4ecac2"];
var options = {
    chart: {
        height: 380,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    series: [{
        name: 'Website Blog',
        type: 'column',
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    }, {
        name: 'Social Media',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    }],
    stroke: {
        width: [0, 4]
    },
    labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
    xaxis: {
        type: 'datetime'
    },
    colors: colors,
    yaxis: [{
        title: {
            text: 'Website Blog',
        },

    }, {
        opposite: true,
        title: {
            text: 'Social Media'
        }
    }],
    legend: {
        offsetY: 7,
    },
    grid: {
        borderColor: '#f1f3fa',
        padding: {
            bottom: 5
        }
      }

}
var chart = new ApexCharts(
    document.querySelector("#line-column-mixed"),
    options
);
chart.render();


//
// MULTIPLE Y-AXIS CHART
//
var colors = ["#1c84ee", "#4ecac2", "#f9b931"];
var options = {
    chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [0, 0, 3]
    },
    series: [{
        name: 'Income',
        type: 'column',
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
    }, {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
    }, {
        name: 'Revenue',
        type: 'line',
        data: [20, 29, 37, 36, 44, 45, 50, 58]
    }],
    colors: colors,
    xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yaxis: [
        {
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: colors[0]
            },
            labels: {
                style: {
                    color: colors[0]
                }
            },
            title: {
                text: "Income (thousand crores)"
            },
        },

        {
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: colors[1]
            },
            labels: {
                style: {
                    color: colors[1]
                },
                offsetX: 10
            },
            title: {
                text: "Operating Cashflow (thousand crores)",
            },
        },
        {
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: colors[2]
            },
            labels: {
                style: {
                    color: colors[2]
                }
            },
            title: {
                text: "Revenue (thousand crores)"
            }
        },

    ],
    tooltip: {
        followCursor: true,
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return y + " thousand crores"
                }
                return y;
            }
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        padding: {
            bottom: 5
        }
    },
    legend: {
        offsetY: 7,
    },
    responsive: [{
        breakpoint: 600,
        options: {
            yaxis: {
                show: false
            },
            legend: {
                show: false
            }
        }
    }]
}
var chart = new ApexCharts(
    document.querySelector("#multiple-yaxis-mixed"),
    options
);
chart.render();


//
// LINE & AREA CHART
//
var colors = ["#4ecac2", "#1c84ee"];
var options = {
    chart: {
        height: 380,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    series: [{
        name: 'Team A',
        type: 'area',
        data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
    }, {
        name: 'Team B',
        type: 'line',
        data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43]
    }],
    fill: {
        type: 'solid',
        opacity: [0.35, 1],
    },
    labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09 ', 'Dec 10', 'Dec 11'],
    markers: {
        size: 0
    },
    legend: {
        offsetY: 7,
    },
    colors: colors,
    yaxis: [
        {
            title: {
                text: 'Series A',
            },
        },
        {
            opposite: true,
            title: {
                text: 'Series B',
            },
        },
    ],
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                }
                return y;

            }
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        padding: {
            bottom: 5
        }
    },
    responsive: [{
        breakpoint: 600,
        options: {
            yaxis: {
                show: false
            },
            legend: {
                show: false
            }
        }
    }]
}
var chart = new ApexCharts(
    document.querySelector("#line-area-mixed"),
    options
);
chart.render();


//
// LINE, COLUMN & AREA CHART
//
var colors = ["#4ecac2", "#f9b931", "#ff6c2f"];
var options = {
    chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    colors: colors,
    series: [{
        name: 'Team A',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    }, {
        name: 'Team B',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
        name: 'Team C',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }],
    fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
    markers: {
        size: 0
    },
    legend: {
        offsetY: 7,
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        title: {
            text: 'Points',
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                }
                return y;

            }
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        padding: {
            bottom: 5
        }
    }
}
var chart = new ApexCharts(
    document.querySelector("#all-mixed"),
    options
);
chart.render();