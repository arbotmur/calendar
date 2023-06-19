function getRandomBrightColor() {
  var letters = "3456789ABCDE";
  var color = "#";

  // Génère six caractères hexadécimaux aléatoires pour former un code couleur
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 12)];
  }

  return color;
}

const EventForm = {
  init: function () {
    this.form = document.getElementById("event-form");
    // Initialisation du gestionnaire de barres de progression
    ProgressBarManager.init();
    FormImagePreview.init();
    // Initialisation du formulaire avec l'envoi AJAX et les barres de progression
    FormUploader.init();

    FormUploader.onComplete(function (response) {
      // Callback pour l'événement "complete"
      response = JSON.parse(response.detail);
      last3MonthsEvents = response;
      Events.evenements = response;

      if (Calendar.isCalendarView) {
        Calendar.renderCalendar(response);
      }
      else {
        Events.afficherEvenements(response);
      }

      FormUploader.reset();
    });

    FormUploader.onError(function (status) {
      // Callback pour l'événement "error"
      FormUploader.activateSubmitButton();
      console.error("Erreur lors de l'upload :", status);
    });
    // Initialisation du formulaire avec la prévisualisation des images
    FormUploader.reset();
  },
  setCurrenTime: function () {
    var date = new Date();
    var heure = date.getHours(); // Récupère l'heure (0-23)
    var minutes = date.getMinutes();
    if (heure < 10) {
      heure = "0" + heure;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    document.getElementById("event-time").value = heure + ":" + minutes;
  },
  identificate: function () { },
};

const mois =
  "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
    "_"
  );
const jours = "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_");
const Events = {
  afficherEvenements: function (evenements) {
    hideBlocks();
    removeSelectedClass();
    document.getElementById("eventListButton").classList.add("selected");
    Calendar.isCalendarView = false;
    document.getElementById("events-list").style.display = "block";

    var calendrierDiv = document.getElementById("events-list");
    calendrierDiv.innerHTML = "";

    // Récupérer les événements de la liste
    this.evenements = !evenements
      ? last3MonthsEvents
      : evenements;

    for (var id in this.evenements) {
      if (this.evenements.hasOwnProperty(id)) {
        var eventDiv = this.displayOneEvent(id);
        calendrierDiv.appendChild(eventDiv);
      }
    }
    LazyLoad.init();
  },

  /**
   * Displays a single event.
   * @param {string} id - The id of the event.
   * @param {boolean} [noLazy=false] - Determines whether lazy loading of images should be disabled. If true desactivate lazy loading
   * @returns {HTMLDivElement} - The event container element.
   */
  displayOneEvent: function (id, noLazy = false) {
    // Retrieve the event object from the collection
    var evenement = this.evenements[id];

    var { id, name, color, date, time, description, fileUrl } = evenement;

    var eventDiv = document.createElement("div");
    eventDiv.id = `event-${id}`;
    eventDiv.classList.add("evenement");
    eventDiv.dataset.date = `${date} ${time}`;
    eventDiv.dataset.name = name;
    eventDiv.dataset.description = description;
    eventDiv.dataset.color = color || getRandomBrightColor();
    eventDiv.dataset.id = id;

    // Create the event title element
    var titleDiv = document.createElement("h2");
    titleDiv.textContent = evenement.name;

    // Create the colored dot element
    var dotDiv = document.createElement("span");
    dotDiv.classList.add("pastille");
    dotDiv.style.backgroundColor = eventDiv.dataset.color;
    titleDiv.appendChild(dotDiv);

    // Create the event date element
    var dateDiv = document.createElement("time");
    dateDiv.dateTime = `${date} ${time}`;
    dateDiv.textContent = this.getFrenchDate(evenement);

    // Create the event description element
    var descriptionDiv = document.createElement("div");
    descriptionDiv.textContent = description;

    // Create the image gallery element
    var imagesDiv = new Gallery().init(fileUrl, noLazy);

    const createIconButton = (className, title, onClick) => {
      const button = document.createElement("button");
      button.evenement = evenement;
      button.classList.add(className);
      button.title = title;
      button.addEventListener("click", onClick);

      const icon = document.createElement("i");
      icon.classList.add("fas", `fa-${className}`);

      button.appendChild(icon);
      return button;
    };

    const editButton = createIconButton("edit", "Modifier", (event) => {
      // Handle the edit event functionality
      const editForm = Events.createEditForm(event);
    });

    const deleteButton = createIconButton("trash", "Supprimer", (event) => {
      // Handle the delete event functionality
      if (
        confirm(
          "Voulez-vous vraiment supprimer " +
          event.currentTarget.evenement.name +
          "?"
        )
      ) {
        $.post(
          '/delete.php?month=' + (Calendar.currentMonth + 1) + '&year=' + Calendar.currentYear,
          event.currentTarget.evenement,
          function (response) {
            if (document.getElementById("eventOverlay")) {
              document.getElementById("eventOverlay").remove();
            }
            console.log(response);
            
            last3MonthsEvents = response;
            Events.evenements = response;

            if (Calendar.isCalendarView) {
              Calendar.renderCalendar(response);
            }
            else {
              Events.afficherEvenements(response);
            }

            FormUploader.reset();

          }
        );
      }
    });

    // Create the icons container element
    var iconsContainer = document.createElement("div");
    iconsContainer.classList.add("icons-container");
    iconsContainer.appendChild(editButton);
    iconsContainer.appendChild(deleteButton);

    // Append all elements to the event container
    eventDiv.appendChild(dateDiv);
    eventDiv.appendChild(titleDiv);
    eventDiv.appendChild(descriptionDiv);
    eventDiv.appendChild(imagesDiv);
    eventDiv.appendChild(iconsContainer);

    // Return the event container element
    return eventDiv;
  },

  createEditForm: function (event) {
    eventData = event.currentTarget.evenement;
    console.log(eventData);
    if (document.getElementById("eventOverlay")) {
      document.getElementById("eventOverlay").remove();
    }

    document.getElementById("addEvent").click();

    document.getElementById("event-form-title").innerHTML = "Modifier événement";

    // Remplir les champs de formulaire avec les données de l'événement
    document.getElementById("event-id").value = eventData.id;
    document.getElementById("event-date").value = eventData.date;
    document.getElementById("event-time").value = eventData.time;
    document.getElementById("event-color").value = eventData.color;
    document.getElementById("event-title").value = eventData.name;
    document.getElementById("event-text").value = eventData.description;

    //On crée une galerie pour voir les images déjà uploadées
    $("#image-preview").html(new Gallery().init(eventData.fileUrl, true,true));
  },

  getFrenchDate: function (event) {
    var date = new Date(event.date + " " + event.time);
    return (
      "Le " +
      jours[date.getDay()] +
      " " +
      date.getDate() +
      " " +
      mois[date.getMonth()] +
      " " +
      date.getFullYear() +
      " à " +
      date.getHours() +
      "h" +
      date.getMinutes()
    );
  },

  chargerEvenements: function () {
    new Ajax().request("GET", "/load.php", null, function (evenements) {
      Events.afficherEvenements(evenements);
    });
  },
};
