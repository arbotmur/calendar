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


let Calendar = {
    evenements: {},
    currentYear: null,
    currentMonth: null,
    isCalendarView: false,

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
            Calendar.evenements = response;

            if (Calendar.isCalendarView) {
                Calendar.renderCalendar(response);
            }
            else {
                Calendar.afficherEvenements(response);
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

        let currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        this.renderCalendar();
    },
    setCurrenTime: function () {
        let date = new Date();
        let heure = date.getHours(); // Récupère l'heure (0-23)
        let minutes = date.getMinutes();
        if (heure < 10) {
            heure = "0" + heure;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        document.getElementById("event-time").value = heure + ":" + minutes;
    },
    prevMonth: function () {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.loadEvents();

    },

    nextMonth: function () {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.loadEvents();
    },

    prevYear: function () {
        this.currentYear--;
        this.loadEvents();
    },

    nextYear: function () {
        this.currentYear++;
        this.loadEvents();
    },

    loadEvents: function () {
        $.get('/load.php?month=' + (this.currentMonth + 1) + '&year=' + this.currentYear, function (data) {
            for (let i in data) {
                last3MonthsEvents[i] = data[i];
            }
            Calendar.evenements = last3MonthsEvents;
            Calendar.renderCalendar(data);
        });
    },

    onDayClick: function (day) {
        // Logique à exécuter lorsqu'un jour est cliqué
        document.getElementById('form').style.display = 'block';
        document.location = '#form';
        document.getElementById('event-date').value = day.getAttribute('data-date');
    },

    // Logique à exécuter lorsqu'un événement est cliqué
    onEventClick: function (evenement) {
        let overlay = document.createElement("div");
        overlay.id = 'eventOverlay';
        overlay.classList.add("overlay");

        let closeBtn = document.createElement("div");
        closeBtn.classList.add("close-btn");
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", this.closeEventOverlay);

        let id = evenement.getAttribute('data-id');
        let eventContainer = Calendar.displayOneEvent(id, true);
        eventContainer.appendChild(closeBtn);
        overlay.appendChild(eventContainer);

        document.body.appendChild(overlay);

    },
    closeEventOverlay: function () {
        document.body.removeChild(document.getElementById('eventOverlay'));
    },

    /**
     * Render the calendar view with events.
     * @param {Array} eventsToDisplay - Optional array of events to display.
     */
    renderCalendar: function (eventsToDisplay) {
        // Hide other blocks and remove selected class
        hideBlocks();
        removeSelectedClass();
        document.getElementById('calendarToogle').classList.add('selected');

        // Hide other blocks and remove selected class
        this.isCalendarView = true;
        document.getElementById('calendar').style.display = 'block';


        // Retrieve events to display
        this.evenements = eventsToDisplay ? eventsToDisplay : last3MonthsEvents;

        // Create calendar
        let calendarContainer = document.getElementById('calendar');
        calendarContainer.innerHTML = '';

        // Get current date
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let currentDay = currentDate.getDate();

        // Create calendar element
        let calendarElement = document.createElement('div');
        calendarElement.classList.add('calendar');

        // Create month label with previous and next month buttons
        let monthLabel = document.createElement('h2');
        this.createMonthLabel(monthLabel, currentMonth, currentYear);
        calendarElement.appendChild(monthLabel);

        // Get the first day of the month
        let firstDay = new Date(this.currentYear, this.currentMonth, 1);
        let startingDay = firstDay.getDay();

        // Get the number of days in the month
        let lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        let numDays = lastDay.getDate();

        // Create day headers
        this.createDayHeaders(calendarElement);

        //Nombre de jour affichés
        let nb = 0;

        // Add empty cells for previous days
        nb += this.addEmptyCells(calendarElement, startingDay);

        // Add days with events
        this.addDaysWithEvents(calendarElement, numDays, currentYear, currentMonth, currentDay);
        nb += numDays;

        // Ajouter les cases vides pour les jours suivants
        while (nb % 7 !== 0) {
            let dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('blank');
            calendarElement.appendChild(dayCell);
            nb++;
        }

        calendarContainer.appendChild(calendarElement);
    },

    /**
     * Create the month label with previous and next month buttons.
     * @param {HTMLElement} monthLabel - Month label element.
     */
    createMonthLabel: function (monthLabel) {
        // Previous month button
        let prevMonthButton = document.createElement('button');
        prevMonthButton.textContent = '<';
        prevMonthButton.onclick = function () {
            Calendar.prevMonth();
        };
        monthLabel.appendChild(prevMonthButton);

        // Month label
        let monthLabelSpan = document.createElement('span');
        monthLabelSpan.classList.add('month-label');
        monthLabelSpan.textContent = Calendar.getMonthName(this.currentMonth) + ' ' + this.currentYear;
        monthLabel.appendChild(monthLabelSpan);

        // Next month button
        let nextMonthButton = document.createElement('button');
        nextMonthButton.textContent = '>';
        nextMonthButton.onclick = function () {
            Calendar.nextMonth();
        };
        monthLabel.appendChild(nextMonthButton);
    },

    /**
     * Create day headers.
     * @param {HTMLElement} calendarElement - Calendar element.
     */
    createDayHeaders: function (calendarElement) {
        for (let jour of jours) {
            let dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('header');

            let dayCellLabel = document.createElement('span');
            dayCellLabel.textContent = jour;

            dayCell.appendChild(dayCellLabel);

            calendarElement.appendChild(dayCell);
        }
    },

    /**
     * Add days with events to the calendar.
     * @param {HTMLElement} calendarElement - Calendar element.
     * @param {number} numDays - Number of days in the current month.
     * @param {number} currentYear - Current year.
     * @param {number} currentMonth - Current month.
     * @param {number} currentDay - Current day.
     */
    addDaysWithEvents: function (calendarElement, numDays, currentYear, currentMonth, currentDay) {
        for (let i = 1; i <= numDays; i++) {
            let dayCell = document.createElement('div');
            dayCell.addEventListener('click', function (event) {
                event.stopPropagation();
                Calendar.onDayClick(this);
            });
            dayCell.setAttribute('data-date', currentYear + '-' + (currentMonth < 9 ? 0 : '') + (currentMonth + 1) + '-' + (i < 10 ? '0' : '') + i);
            dayCell.classList.add('day');

            // Check if it's today
            if (i === currentDay && currentMonth === Calendar.currentMonth && currentYear === Calendar.currentYear) {
                dayCell.classList.add('today');
            }

            let dayCellTitle = document.createElement('div');
            dayCellTitle.classList.add('dayNumber');
            dayCellTitle.textContent = i;
            dayCell.appendChild(dayCellTitle);

            // Check if there are events for this day
            let dayEvents = Object.values(Calendar.evenements).filter(function (event) {
                let eventDate = new Date(event.date);
                return eventDate.getFullYear() === Calendar.currentYear && eventDate.getMonth() === Calendar.currentMonth && eventDate.getDate() === i;
            });

            if (dayEvents.length > 0) {
                for (let eventItem of dayEvents) {
                    let eventDiv = document.createElement('div');
                    eventDiv.setAttribute('data-id', eventItem.id);
                    eventDiv.addEventListener('click', function (event) {
                        event.stopPropagation();
                        Calendar.onEventClick(this);
                    });
                    eventDiv.classList.add('event');
                    eventDiv.textContent = eventItem.name;
                    eventDiv.style.backgroundColor = eventItem.color || getRandomBrightColor();

                    let point = document.createElement('div');
                    point.classList.add('point');
                    point.style.backgroundColor = '#ffffff';
                    eventDiv.appendChild(point);
                    dayCell.appendChild(eventDiv);
                }
            }

            calendarElement.appendChild(dayCell);
        }
    },

    /**
     * Add empty cells for previous or remaining days.
     * @param {HTMLElement} calendarElement - Calendar element.
     * @param {number} count - Number of empty cells to add (default: 7).
     * @returns {int} - The nomber of empty cells.
     */
    addEmptyCells: function (calendarElement, count = 7) {
        let nb = 0;
        for (let i = 0; i < count; i++) {
            let dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('blank');
            calendarElement.appendChild(dayCell);
            nb++;
        }
        return nb;
    },

    /**
     * Get the name of the month.
     * @param {number} month - The month number.
     * @returns {string} - The name of the month.
     */
    getMonthName: function (month) {
        return mois[month];
    },

    afficherEvenements: function (evenements) {
        hideBlocks();
        removeSelectedClass();
        document.getElementById("eventListButton").classList.add("selected");
        Calendar.isCalendarView = false;
        document.getElementById("events-list").style.display = "block";

        let calendrierDiv = document.getElementById("events-list");
        calendrierDiv.innerHTML = "";

        // Récupérer les événements de la liste
        this.evenements = !evenements
            ? last3MonthsEvents
            : evenements;

        for (let id in this.evenements) {
            if (this.evenements.hasOwnProperty(id)) {
                let eventDiv = this.displayOneEvent(id);
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
    displayOneEvent: function (key, noLazy = false) {
        console.log(key);
        // Retrieve the event object from the collection
        let evenement = this.evenements[key];

        let { id, name, color, date, time, description, fileUrl, user } = evenement;

        let eventDiv = document.createElement("div");
        eventDiv.id = `event-${id}`;
        eventDiv.classList.add("evenement");
        eventDiv.dataset.date = `${date} ${time}`;
        eventDiv.dataset.name = name;
        eventDiv.dataset.description = description;
        eventDiv.dataset.color = color || getRandomBrightColor();
        eventDiv.dataset.id = id;
        eventDiv.dataset.user = user;

        // Create the event title element
        let titleDiv = document.createElement("h2");
        titleDiv.textContent = evenement.name;

        // Create the user title element
        let userDiv = document.createElement("div");
        userDiv.textContent = 'Par '+evenement.user;
        userDiv.style.fontSize = 'small';
        userDiv.style.color = '#666666';

        // Create the colored dot element
        let dotDiv = document.createElement("span");
        dotDiv.classList.add("pastille");
        dotDiv.style.backgroundColor = eventDiv.dataset.color;
        titleDiv.appendChild(dotDiv);

        // Create the event date element
        let dateDiv = document.createElement("time");
        dateDiv.dateTime = `${date} ${time}`;
        dateDiv.textContent = this.getFrenchDate(evenement);

        // Create the event description element
        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = description;
        descriptionDiv.classList.add("description");

        // Create the image gallery element
        let imagesDiv = new Gallery().init(fileUrl, noLazy);

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
            Calendar.createEditForm(event);
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

                        last3MonthsEvents = response;
                        Calendar.evenements = response;

                        if (Calendar.isCalendarView) {
                            Calendar.renderCalendar(response);
                        }
                        else {
                            Calendar.afficherEvenements(response);
                        }

                        FormUploader.reset();

                    }
                );
            }
        });

        // Create the icons container element
        let iconsContainer = document.createElement("div");
        iconsContainer.classList.add("icons-container");
        iconsContainer.appendChild(editButton);
        iconsContainer.appendChild(deleteButton);

        // Append all elements to the event container
        eventDiv.appendChild(dateDiv);
        eventDiv.appendChild(titleDiv);
        eventDiv.appendChild(userDiv);
        eventDiv.appendChild(descriptionDiv);
        eventDiv.appendChild(imagesDiv);
        eventDiv.appendChild(iconsContainer);

        // Return the event container element
        return eventDiv;
    },

    createEditForm: function (event) {
        let eventData = event.currentTarget.evenement;
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
        document.getElementById("event-user").value = eventData.user;

        //On crée une galerie pour voir les images déjà uploadées
        $("#image-preview").html(new Gallery().init(eventData.fileUrl, true, true));
    },

    getFrenchDate: function (event) {
        let date = new Date(event.date + " " + event.time);
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
};

