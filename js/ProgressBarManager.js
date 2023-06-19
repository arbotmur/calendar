"use strict";

const ProgressBarManager = {
    progressBars: {},

    init: function () {
        this.progressBars = {};
    },

    createProgressBar: function (file) {
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");

        //const progressLabel = document.createElement("div");
        //progressLabel.textContent = file.name;

        const progress = document.createElement("div");
        progress.classList.add("progress");

        const progressBarFill = document.createElement("div");
        progressBarFill.classList.add("progress-fill");

        progress.appendChild(progressBarFill);
        //progressBar.appendChild(progressLabel);
        progressBar.appendChild(progress);

        this.progressBars[file.name] = progressBar;

        return progressBar;
    },

    updateProgress: function (progressBar, percentage) {
        progressBar.querySelector(".progress-fill").style.width = percentage + "%";
    },
};