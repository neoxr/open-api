document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners to all plus and minus buttons
    var plusButtons = document.querySelectorAll(".plus");
    var minusButtons = document.querySelectorAll(".minus");

    plusButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            updateQuantity(button, 1);
        });
    });

    minusButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            updateQuantity(button, -1);
        });
    });

    function updateQuantity(button, delta) {
        var input =
            delta === 1 ? button.previousElementSibling : button.nextElementSibling;
        var currentValue = parseInt(input.value);
        var minValue = parseInt(input.min);
        var maxValue = parseInt(input.max);

        var newValue = currentValue + delta;

        if (newValue >= minValue && newValue <= maxValue) {
            input.value = newValue;
            // Add any additional actions here, e.g., update cart total, etc.
        }
    }
});

