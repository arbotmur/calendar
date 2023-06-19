"use strict";

const FormUploader = {
    form: null,
    previewContainer: null,
    savedFiles: [],

    init: function () {
        this.form = document.getElementById("event-form");
        this.previewContainer = document.getElementById("image-preview");

        this.form.addEventListener("submit", this.handleSubmit.bind(this));
        this.submitButton = this.form.querySelector("[type='submit']");
    },

    handleSubmit: function (e) {
        e.preventDefault();

        // Désactiver le bouton de soumission
        this.submitButton.disabled = true;

        // Afficher une indication de chargement sur le bouton
        this.submitButton.innerHTML = '<span class="loader"></span>Loading...';

        //const files = document.getElementById("event-images").files;

        this.uploadFiles(FormImagePreview.files);
    },

    uploadFiles: function (files) {
        const totalFiles = files.length;
        let uploadedFiles = 0;

        //Si aucun fichier, on envoie le formulaire
        if (totalFiles === 0) {
            this.sendForm();
        }

        // Parcourir chaque fichier
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Créer une barre de progression pour le fichier
            const progressBar = ProgressBarManager.createProgressBar(file);

            // Trouver le conteneur de prévisualisation correspondant
            const previewContainer = document.getElementById("image-preview-container-" + i);

            if (previewContainer) {
                // Ajouter la barre de progression au conteneur de prévisualisation
                previewContainer.appendChild(progressBar);
            }

            // Créer un objet FormData pour le fichier actuel
            const formData = new FormData();
            formData.append("file", file);

            // Envoyer le fichier à saveFile.php
            this.sendFormData(formData, progressBar)
                .then((response) => {
                    // Traitement de la réponse de saveFile.php
                    const savedFile = JSON.parse(response);
                    this.savedFiles.push(savedFile.url);

                    // Mettre à jour la barre de progression du fichier terminé
                    ProgressBarManager.updateProgress(progressBar, 100);

                    uploadedFiles++;

                    // Vérifier si tous les fichiers ont été téléchargés
                    if (uploadedFiles === totalFiles) {
                        // Tous les fichiers sont téléchargés, envoyer le formulaire
                        this.sendForm();
                    }
                })
                .catch((error) => {
                    // Gérer les erreurs
                    console.error("Une erreur s'est produite lors de l'envoi du fichier :", error);
                });
        }
    },

    sendFormData: function (formData, progressBar) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "saveFile.php");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    ProgressBarManager.updateProgress(progressBar, progress);
                }
            };

            xhr.onerror = function () {
                reject("Une erreur réseau s'est produite lors de l'envoi du fichier.");
            };

            xhr.send(formData);
        });
    },

    sendForm: function () {
        // Collecter les données du formulaire
        const formData = new FormData(this.form);

        // Ajouter les URL des fichiers sauvegardés aux données du formulaire
        for (let i = 0; i < this.savedFiles.length; i++) {
            formData.append("fileUrl[]", this.savedFiles[i]);
        }

        // Envoyer le formulaire à addEvent.php
        const xhr = new XMLHttpRequest();
        xhr.open("POST", 'addEvent.php?month=' + (Calendar.currentMonth + 1) + '&year=' + Calendar.currentYear);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Traitement de la réponse de addEvent.php
                FormUploader.triggerEvent.call(FormUploader, 'Complete', xhr.responseText);
            } else {
                FormUploader.triggerEvent.call(FormUploader, 'Error', xhr.status);
            }
        };
        xhr.send(formData);
    },

    triggerEvent: function (eventName, eventData) {
        const event = new CustomEvent(`formUploader${eventName}`, {
            detail: eventData,
        });
        document.dispatchEvent(event);
    },
    onComplete: function (callback) {
        document.addEventListener("formUploaderComplete", callback);
    },
    onError: function (callback) {
        document.addEventListener("formUploaderError", callback);
    },
    activateSubmitButton: function () {
        this.submitButton.removeAttribute("disabled");
        this.submitButton.innerHTML = 'Publier';
    }, 
    reset: function () {
        this.form.reset();
        this.savedFiles = [];
        this.activateSubmitButton();
        FormImagePreview.reset();
        EventForm.setCurrenTime();
        document.getElementById("event-id").value = 0;
        document.getElementById("event-color").value = getRandomBrightColor();
        document.getElementById('event-form-title').innerHTML='Ajouter un événement';
    }
};