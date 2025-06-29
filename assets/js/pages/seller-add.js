/*
Template Name: Larkon - Responsive 5 Admin Dashboard
Author: Techzaa
File: dashboard - ecommerce js
*/


const slider = document.getElementById("product-price-range");
if (slider) {

    noUiSlider.create(slider, {
        start: [0, 200], // Handle start position
        step: 1, // Slider moves in increments of '10'
        margin: 0, // Handles must be more than '20' apart
        connect: true, // Display a colored bar between the handles
        behaviour: 'tap-drag', // Move a handle on tap, bar is draggable
        range: { // Slider can select '0' to '100'
            'min': 0,
            'max': 1500
        },
        format: wNumb({
            decimals: 0,
            prefix: '$ '
        })

    });

    const minCostInput = document.getElementById("minCost"),
        maxCostInput = document.getElementById("maxCost");

    // When the slider value changes, update the input and span
    slider.noUiSlider.on('update', function (values, handle) {
        if (handle) {
            maxCostInput.value = values[handle];
        } else {
            minCostInput.value = values[handle];
        }
    });

    minCostInput.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });

    maxCostInput.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });
}

