function Gallery() {
    return {
        images: [],
        index: 0,
        init: function (images, noLazy = false, del = false) {
            var imagesDiv = document.createElement("div");
            imagesDiv.classList.add("images");
            if (images) {
                this.images = images;
                // Ajouter les images
                for (var i = 0; i < images.length; i++) {
                    var image = document.createElement("img");
                    if (LazyLoad && !noLazy) {
                        image.src = '/photos-icon.png';
                        image.setAttribute('data-src', images[i].replace('image/', 'thumb/'));
                    }
                    else {
                        image.src = images[i].replace('image/', 'thumb/');
                    }
                    image.addEventListener("click", this.openImage.bind(this, images, i));

                    if (del) {
                        const previewContainer = document.createElement("div");
                        previewContainer.classList.add("image-preview-container");
                        previewContainer.id = "image-preview-container-" + this.n;
                        previewContainer.appendChild(image);

                        const removeButton = document.createElement("a");
                        removeButton.textContent = "X";
                        removeButton.dataset.image = images[i];
                        removeButton.dataset.i = i;
                        removeButton.onclick = function () {
                            this.parentElement.remove();
                        }
                        removeButton.classList.add("remove-image");
                        previewContainer.appendChild(removeButton);

                        const inputField=document.createElement("input");
                        inputField.type="hidden";
                        inputField.name="fileUrl[]";
                        inputField.value=images[i];
                        previewContainer.appendChild(inputField);

                        imagesDiv.appendChild(previewContainer);
                    }
                    else{
                        imagesDiv.appendChild(image);
                    }
                    


                    
                }
            }

            return imagesDiv;
        },
        // Fonction pour afficher l'image en plein écran
        openImage: function (images, index) {
            var overlay = document.createElement("div");
            overlay.classList.add("overlay");
            overlay.id = "galleryOverlay";

            var imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            var prevArrow = document.createElement("div");
            prevArrow.classList.add("arrow", "prev-arrow");
            prevArrow.innerHTML = "&#10094;";
            prevArrow.addEventListener("click", this.changeImage.bind(this, images, -1));

            var nextArrow = document.createElement("div");
            nextArrow.classList.add("arrow", "next-arrow");
            nextArrow.innerHTML = "&#10095;";
            nextArrow.addEventListener("click", this.changeImage.bind(this, images, 1));

            var image = document.createElement("img");
            image.src = images[index];

            var closeBtn = document.createElement("div");
            closeBtn.classList.add("close-btn");
            closeBtn.innerHTML = "&times;";
            closeBtn.addEventListener("click", this.closeImage);

            imageContainer.appendChild(prevArrow);
            imageContainer.appendChild(image);
            imageContainer.appendChild(nextArrow);
            overlay.appendChild(imageContainer);
            overlay.appendChild(closeBtn);

            document.body.appendChild(overlay);
        },

        changeImage: function (images, offset) {
            var overlay = document.getElementById("galleryOverlay");
            var imageContainer = overlay.querySelector(".image-container");
            var image = imageContainer.querySelector("img");

            var newIndex = this.index + offset;
            if (newIndex < 0) {
                newIndex = images.length - 1;
            } else if (newIndex >= images.length) {
                newIndex = 0;
            }

            var newImage = new Image;
            newImage.src = images[newIndex];
            newImage.classList.add("imgtransparent");

            newImage.onload = function () {
                imageContainer.appendChild(newImage);
                image.classList.add("fadeout");
                newImage.classList.add("fadein");
                imageContainer.removeChild(image);
            };
            //image.src = images[newIndex];
            this.index = newIndex;
        },

        closeImage: function () {
            var overlay = document.getElementById("galleryOverlay");
            overlay.parentNode.removeChild(overlay);
        },
    };
};