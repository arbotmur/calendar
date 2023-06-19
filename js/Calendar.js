var Calendar = {
    events: [],
    currentYear: null,
    currentMonth: null,
    isCalendarView: false,

    init: function () {
        var currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        this.renderCalendar();
    },
    prevMonth: function () {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.loadEvents(
            function (data) {
                Calendar.renderCalendar(data);
            }
        );

    },

    nextMonth: function () {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.loadEvents(
            function (data) {
                Calendar.renderCalendar(data);
            }
        );
    },

    prevYear: function () {
        this.currentYear--;
        this.loadEvents(
            function (data) {
                Calendar.renderCalendar(data);
            }
        );
    },

    nextYear: function () {
        this.currentYear++;
        this.loadEvents(
            function (data) {
                Calendar.renderCalendar(data);
            }
        );
    },

    loadEvents: function (callback) {
        $.get('/load.php?month=' + (this.currentMonth + 1) + '&year=' + this.currentYear, function (data) {
            for(var i in data){
                last3MonthsEvents[i] = data[i];
            }
            Events.evenements = last3MonthsEvents;
            callback(data);
        });
    },

    onDayClick: function (day) {
        // Logique à exécuter lorsqu'un jour est cliqué
        console.log("Day clicked:", day.getAttribute('data-date'));
        document.getElementById('form').style.display = 'block';
        document.location = '#form';
        document.getElementById('event-date').value = day.getAttribute('data-date');
    },

    // Logique à exécuter lorsqu'un événement est cliqué
    onEventClick: function (evenement) {
        var overlay = document.createElement("div");
        overlay.id = 'eventOverlay';
        overlay.classList.add("overlay");

        var closeBtn = document.createElement("div");
        closeBtn.classList.add("close-btn");
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", this.closeEventOverlay);

        var id = evenement.getAttribute('data-id');
        var eventContainer = Events.displayOneEvent(id, true);
        eventContainer.appendChild(closeBtn);
        overlay.appendChild(eventContainer);

        document.body.appendChild(overlay);

    },
    closeEventOverlay: function () {
        document.body.removeChild(document.getElementById('eventOverlay'));
    },

    renderCalendar: function (eventsToDisplay) {

        Calendar.isCalendarView = true;
        hideBlocks();
        removeSelectedClass();
        document.getElementById('calendarToogle').classList.add('selected');
        this.isCalendarView = true;
        document.getElementById('calendar').style.display = 'block';


        // Récupérer les événements de la liste
        this.events = Object.values(eventsToDisplay ? eventsToDisplay : last3MonthsEvents);

        // Créer le calendrier
        var calendarContainer = document.getElementById('calendar');
        calendarContainer.innerHTML = '';

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        var currentDay = currentDate.getDate();

        var calendar = document.createElement('div');
        calendar.classList.add('calendar');

        var monthLabel = document.createElement('h2');

        //Bouton mois précedent
        var prevMonthButton = document.createElement('button');
        prevMonthButton.textContent = '<';
        prevMonthButton.onclick = function () {
            Calendar.prevMonth();
        };
        monthLabel.appendChild(prevMonthButton);

        var monthLabelSpan = document.createElement('span');
        monthLabelSpan.classList.add('month-label');
        monthLabelSpan.textContent = this.getMonthName(this.currentMonth) + ' ' + this.currentYear;
        monthLabel.appendChild(monthLabelSpan);

        //Bouton mois suivant
        var nextMonthButton = document.createElement('button');
        nextMonthButton.textContent = '>';
        nextMonthButton.onclick = function () {
            Calendar.nextMonth();
        };
        monthLabel.appendChild(nextMonthButton);

        calendar.appendChild(monthLabel);

        // Obtenir le premier jour du mois
        var firstDay = new Date(this.currentYear, this.currentMonth, 1);
        var startingDay = firstDay.getDay();

        // Obtenir le nombre de jours dans le mois
        var lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        var numDays = lastDay.getDate();

        //Entêtes de jour
        for (var i = 0; i < jours.length; i++) {
            var dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('header');
            dayCell.textContent = jours[i];
            calendar.appendChild(dayCell);
        }

        //Nombre de jour affichés
        var nb = 0;

        // Ajouter les cases vides pour les jours précédents
        for (var i = 0; i < startingDay; i++) {
            var dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('blank');
            calendar.appendChild(dayCell);
            nb++;
        }

        // Ajouter les jours du mois avec les événements
        for (var i = 1; i <= numDays; i++) {
            var dayCell = document.createElement('div');
            dayCell.addEventListener('click', function (event) {
                event.stopPropagation();
                Calendar.onDayClick(this);
            });
            dayCell.setAttribute('data-date', this.currentYear + '-' + (this.currentMonth < 9 ? 0 : '') + (this.currentMonth + 1) + '-' + (i < 10 ? '0' : '') + i);
            dayCell.classList.add('day');
            //Vérifier si c'est aujourd'hui
            if (i === currentDay && currentMonth === this.currentMonth && currentYear === this.currentYear) {
                dayCell.classList.add('today');
            }

            var dayCellTitle = document.createElement('div');
            dayCellTitle.classList.add('dayNumber');
            dayCellTitle.textContent = i;
            dayCell.appendChild(dayCellTitle);

            // Vérifier s'il y a des événements pour ce jour
            var dayEvents = this.events.filter(function (event) {
                var eventDate = new Date(event.date);
                return eventDate.getFullYear() === Calendar.currentYear && eventDate.getMonth() === Calendar.currentMonth && eventDate.getDate() === i;
            });

            if (dayEvents.length > 0) {
                for (var j = 0; j < dayEvents.length; j++) {
                    var eventDiv = document.createElement('div');
                    eventDiv.setAttribute('data-id', dayEvents[j].id);
                    eventDiv.addEventListener('click', function (event) {
                        event.stopPropagation();
                        Calendar.onEventClick(this);
                    });
                    eventDiv.classList.add('event');
                    eventDiv.textContent = dayEvents[j].name;
                    eventDiv.style.backgroundColor = dayEvents[j].color || getRandomBrightColor();;

                    var point = document.createElement('div');
                    point.classList.add('point');
                    point.style.backgroundColor = '#ffffff';
                    eventDiv.appendChild(point);
                    dayCell.appendChild(eventDiv);
                }
            }

            calendar.appendChild(dayCell);
            nb++;
        }

        // Ajouter les cases vides pour les jours suivants
        while (nb % 7 !== 0) {
            var dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.classList.add('blank');
            calendar.appendChild(dayCell);
            nb++;
        }

        calendarContainer.appendChild(calendar);
    },

    getMonthName: function (month) {
        return mois[month];
    }
};

