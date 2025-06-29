/*
Template Name: Larkon - Responsive 5 Admin Dashboard
Author: Techzaa
File: form - Basic js
*/

class BasicForm {

    initClipboardBasic() {
        // Select elements
        const target = document.getElementById('clipboard_example');
        const button = target.nextElementSibling;

        // Init clipboard -- for more info, please read the offical documentation: https://clipboardjs.com/
        var clipboard = new ClipboardJS(button, {
            target: target,
            text: function () {
                return target.value;
            }
        });

        // Success action handler
        clipboard.on('success', function (e) {
            const currentLabel = button.innerHTML;

            // Exit label update when already in progress
            if (button.innerHTML === 'Copied!') {
                return;
            }

            // Update button label
            button.innerHTML = 'Copied!';

            // Revert button label after 3 seconds
            setTimeout(function () {
                button.innerHTML = currentLabel;
            }, 3000)
        });

    }

    initClipboardCut() {
        // Select elements
        const target = document.getElementById('clipboard_cut');
        const button = target.nextElementSibling;

        // Init clipboard -- for more info, please read the offical documentation: https://clipboardjs.com/
        var clipboard = new ClipboardJS(button, {
            target: target,
            text: function () {
                return target.innerText;
            }
        });

        // Success action handler
        clipboard.on('success', function (e) {
            const currentLabel = button.innerHTML;

            // Exit label update when already in progress
            if (button.innerHTML === 'Copied!') {
                return;
            }

            // Update button label
            button.innerHTML = 'Copied!';

            // Revert button label after 3 seconds
            setTimeout(function () {
                button.innerHTML = currentLabel;
            }, 3000)
        });
    }

    initClipboardText() {
        // Select element
        const target = document.getElementById('clipboard_text');

        // Init clipboard -- for more info, please read the offical documentation: https://clipboardjs.com/
        var clipboard = new ClipboardJS(target);

        // Success action handler
        clipboard.on('success', function (e) {
            const currentLabel = target.innerHTML;

            // Exit label update when already in progress
            if (target.innerHTML === 'Copied!') {
                return;
            }

            // Update button label
            target.innerHTML = 'Copied!';

            // Revert button label after 3 seconds
            setTimeout(function () {
                target.innerHTML = currentLabel;
            }, 3000)
        });

    }


    init() {
        this.initClipboardBasic();
        this.initClipboardCut();
        this.initClipboardText();
    }

}
document.addEventListener('DOMContentLoaded', function (e) {
    new BasicForm().init();
});