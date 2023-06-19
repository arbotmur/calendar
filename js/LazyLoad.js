"use strict";

const LazyLoad = {
    loadImage: function (element) {
        const src = element.getAttribute('data-src');
        if (!src) return;

        element.src = src;
        element.removeAttribute('data-src');
    },

    init: function () {
        const options = {
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    this.loadImage(image);
                    observer.unobserve(image);
                }
            });
        }, options);

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(image => {
            observer.observe(image);
        });
    }
};
