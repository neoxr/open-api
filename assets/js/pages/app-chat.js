/*
Template Name: Larkon - Responsive 5 Admin Dashboard
Author: Techzaa
File: chat js
*/

class Chat {

    initStatus() {
        const swiper = new Swiper(".mySwiper", {
            loop: true,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            slidesPerView: 'auto',
            spaceBetween : 8,
            autoHeight: true,
        });
    }

    initChats() {
        const self = this;
        this.chatContainer = document.querySelector('.chat-conversation-list');
        // console.log(this.chatContainer);
        this.simplebar = new SimpleBar(this.chatContainer);

        this.scrollPosition = 0;
        this.scrollToBottom(false);

        const form = document.querySelector('form#chat-form');
        const messageInput = form.querySelector('input');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const message = messageInput.value;
            if (message.trim().length > 0) {
                messageInput.value = "";
                self.sendMessage(message);
            }

        });

        if (this.simplebar.getScrollElement()) {
            this.simplebar.getScrollElement().onscroll = function (e) {
                self.scrollPosition = e.target.scrollTop;
            }
        }
    }

    sendMessage(message) {
        const self = this;
        const messageNode = this.toNodes(this.createHTMLMessageFromMe(message));
        if (this.simplebar.getContentElement()) {
            this.simplebar.getContentElement().appendChild(messageNode);
            this.simplebar.recalculate();
            this.scrollToBottom();
            setTimeout(function () {
                self.receiveMessage("Server is not connected 😔");
            }, 1000);
        }
    }

    receiveMessage(message) {
        const messageNode = this.toNodes(this.createHTMLMessageFromOther(message));
        this.simplebar.getContentElement().appendChild(messageNode);
        this.simplebar.recalculate();
        this.scrollToBottom();

    }

    createHTMLMessageFromMe(message) {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + " " + (today.getHours() > 11 ? "pm" : "am");
        return '<li class="clearfix odd">\n' + '    <div class="chat-conversation-text ms-0">\n' + '        <div class="d-flex justify-content-end">\n' + '            <div class="chat-conversation-actions dropdown dropstart">\n' + '                <a href="javascript: void(0);" class="pe-1" data-bs-toggle="dropdown" aria-expanded="false"><i class=\'bx bx-dots-vertical-rounded fs-18\'></i></a>\n' + '                <div class="dropdown-menu">\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-share fs-18 me-2"></i>Reply\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-share-alt fs-18 me-2"></i>Forward\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-copy fs-18 me-2"></i>Copy\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-bookmark fs-18 me-2"></i>Bookmark\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-star fs-18 me-2"></i>Starred\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-info-square fs-18 me-2"></i>Mark as Unread\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-trash fs-18 me-2"></i>Delete\n' + '                    </a>\n' + '                </div>\n' + '            </div>\n' + '            <div class="chat-ctext-wrap">\n' + '                <p>' + message + '</p>\n' + '            </div>\n' + '        </div>\n' + '        <p class="text-muted fs-12 mb-0 mt-1">' + time + '<i class="bx bx-check-double ms-1 text-primary"></i></p>\n' + '    </div>\n' + '</li>\n';
    }

    createHTMLMessageFromOther(message) {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + " " + (today.getHours() > 11 ? "pm" : "am");
        return '<li class="clearfix">\n' + '    <div class="chat-conversation-text">\n' + '        <div class="d-flex">\n' + '            <div class="chat-ctext-wrap">\n' + '                <p>' + message + '</p>\n' + '            </div>\n' + '            <div class="chat-conversation-actions dropdown dropend">\n' + '                <a href="javascript: void(0);" class="ps-1" data-bs-toggle="dropdown" aria-expanded="false"><i class=\'bx bx-dots-vertical-rounded fs-18\'></i></a>\n' + '                <div class="dropdown-menu">\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-share fs-18 me-2"></i>Reply\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-share-alt fs-18 me-2"></i>Forward\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-copy fs-18 me-2"></i>Copy\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-bookmark fs-18 me-2"></i>Bookmark\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-star fs-18 me-2"></i>Starred\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-info-square fs-18 me-2"></i>Mark as Unread\n' + '                    </a>\n' + '                    <a class="dropdown-item" href="javascript: void(0);">\n' + '                        <i class="bx bx-trash fs-18 me-2"></i>Delete\n' + '                    </a>\n' + '                </div>\n' + '            </div>\n' + '        </div>\n' + '        <p class="text-muted fs-12 mb-0 mt-1 ms-2">' + time + '</p>\n' + '    </div>\n' + '</li>';
    }


    toNodes(html) {
        return new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]
    }

    scrollToBottom(smooth = true) {
        const self = this;
        if (this.simplebar.getContentElement()) {
            const maxPosition = this.simplebar.getContentElement().scrollHeight - 570;
            const time = smooth ? 10 : 1;
            const interval = setInterval(function () {
                self.scrollPosition += 2;
                self.simplebar.getScrollElement().scrollTop = self.scrollPosition;
                if (self.scrollPosition > maxPosition) clearInterval(interval);
            }, time);
        }
    }

    init() {
        this.initStatus();
        this.initChats();
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    new Chat().init();
});