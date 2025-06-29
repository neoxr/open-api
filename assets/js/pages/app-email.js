/*
Template Name: Larkon - Responsive 5 Admin Dashboard
Author: Techzaa
File: email js
*/
class EmailApp {

    constructor() {
        this.body = document.getElementsByTagName("body")[0];
        this.window = window;
    }

    initEditors() {

        if (document.getElementById('bubble-editor')) {
            new Quill('#bubble-editor', {
                theme: 'bubble'
            });
        }
        if (document.getElementById('snow-editor')) {
            new Quill('#snow-editor', {
                theme: 'snow',
                modules: {
                    'toolbar': [[{ 'font': [] }], ['bold', 'italic', 'underline'], [{ 'color': [] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['direction', { 'align': [] }], ['link', 'image', 'video']]
                },
            });
        }
        if (document.getElementById('snow-editor2')) {
            new Quill('#snow-editor2', {
                theme: 'snow',
                modules: {
                    'toolbar': [[{ 'font': [] }], ['bold', 'italic', 'underline'], [{ 'color': [] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['direction', { 'align': [] }], ['link', 'image', 'video']]
                },
            });
        }
    }

    init() {
        this.initEditors();
    }

}

document.addEventListener('DOMContentLoaded', function (e) {
    new EmailApp().init();
});