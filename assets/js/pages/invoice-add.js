

// Profile Foreground Img
if (document.querySelector("#profile-img-file-input")) {
  document
    .querySelector("#profile-img-file-input")
    .addEventListener("change", function () {
      var preview = document.querySelector(".user-profile-image");
      var file = document.querySelector(".profile-img-file-input").files[0];
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          preview.src = reader.result;
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    });
}

// Profile Foreground Img
if (document.querySelector("#profile-img-file-input1")) {
    document
      .querySelector("#profile-img-file-input1")
      .addEventListener("change", function () {
        var preview = document.querySelector(".user-profile-image1");
        var file = document.querySelector(".profile-img-file-input1").files[0];
        var reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            preview.src = reader.result;
          },
          false
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      });
  }

// datepicker

document.getElementById("schedule-date").flatpickr();

// datepicker

document.getElementById("due-date").flatpickr();


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
  
  