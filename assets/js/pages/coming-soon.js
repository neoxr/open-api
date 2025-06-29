/*
Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
Version: 1.0
Author: Techzaa
File: countdown js
*/

class Countdown {

    initCountDown() {

        if (document.getElementById("days")) {
            // The data/time we want to countdown to
            var eventCountDown = new Date("Jan 17, 2026 12:00:01").getTime();

            // Run myfunc every second
            var myfunc = setInterval(function () {

                var now = new Date().getTime();
                var timeleft = eventCountDown - now;

                // Calculating the days, hours, minutes and seconds left
                var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
                var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

                // Result is output to the specific element
                document.getElementById("days").innerHTML = days
                document.getElementById("hours").innerHTML = hours
                document.getElementById("minutes").innerHTML = minutes
                document.getElementById("seconds").innerHTML = seconds
                
                // Display the message when countdown is over
                if (timeleft < 0) {
                    clearInterval(myfunc);
                    document.getElementById("days").innerHTML = ""
                    document.getElementById("hours").innerHTML = ""
                    document.getElementById("minutes").innerHTML = ""
                    document.getElementById("seconds").innerHTML = ""
                    document.getElementById("end").innerHTML = "00:00:00:00";
                }
            }, 1000);
        }
    }
    
    init() {
        this.initCountDown();
    }
}

new Countdown().init();