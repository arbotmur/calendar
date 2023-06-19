"use strict";

const FormImagePreview = {
    files: [],
    n:0,
    init: function () {
        // Sélectionnez l'élément input file
        this.input = document.getElementById("event-images");
        // Sélectionnez l'élément de prévisualisation des images
        this.preview = document.getElementById("image-preview");

        // Écoutez l'événement de changement de fichier
        this.input.addEventListener("change", this.handleFileChange.bind(this));
    },

    handleFileChange: function (e) {
        // Réinitialiser la prévisualisation des images
        //this.preview.innerHTML = "";

        // Récupérer la liste des fichiers sélectionnés
        const files = Array.from(e.target.files);

        // Parcourir chaque fichier
        
        files.forEach(function (file) {
            this.files.push(file);
            // Créer un objet d'URL pour le fichier
            const imageURL = URL.createObjectURL(file);

            // Créer un élément d'image pour la prévisualisation
            const image = document.createElement("img");
            image.src = imageURL;
            image.classList.add("preview-image");

            const previewContainer = document.createElement("div");
            previewContainer.classList.add("image-preview-container");
            previewContainer.id = "image-preview-container-" + this.n;
            previewContainer.appendChild(image);

            const removeButton = document.createElement("a");
            removeButton.textContent="X";
            removeButton.dataset.image = file;
            removeButton.dataset.n = this.n;
            removeButton.onclick=function(){
                this.parentElement.remove();
                FormImagePreview.files.splice(this.dataset.n,1);
            }
            removeButton.classList.add("remove-image");
            previewContainer.appendChild(removeButton);

            this.preview.appendChild(previewContainer);

            this.n++;
        }, this);
    },

    reset: function () {
        // Réinitialiser la prévisualisation des images
        this.preview.innerHTML = "";
        this.files = [];
        this.n=0;
    },
};


